import * as tf from "@tensorflow/tfjs";
import { SkillRecommendations, UserDocument } from "src/common/interfaces";
import { getAllUsers } from "../user";
import logger from "src/loggers/logger";

export class SkillSwapRecommender {
  private users: UserDocument[] = [];
  private model: tf.LayersModel | null = null;
  private skillToIndex: Record<string, number> = {};
  private userToIndex: Record<string, number> = {};
  private institutionToIndex: Record<string, number> = {};
  private initialized: boolean = false;

  public async initialize() {
    await this.loadUsers();
    logger.info(`Successfully loaded ${this.users.length} test users`);
    this.createMappings();
    this.model = this.buildModel();
    await this.trainModel();
    this.initialized = true;
    logger.info("Recommendation system initialized");
  }

  private async loadUsers() {
    this.users = await getAllUsers();
  }

  private createMappings() {
    const allSkills = new Set<string>();
    this.users.forEach((user) => {
      user.skillsProficientAt?.forEach((skill) => allSkills.add(skill.name));
      user.skillsToLearn?.forEach((skill) => allSkills.add(skill.name));
    });
    Array.from(allSkills).forEach((skill, i) => (this.skillToIndex[skill] = i));

    this.users.forEach((user, i) => {
      this.userToIndex[user._id.toString()] = i;
      if (user.education?.institution) {
        this.institutionToIndex[user.education.institution] =
          this.institutionToIndex[user.education.institution] ||
          Object.keys(this.institutionToIndex).length;
      }
    });

    logger.info("Mappings created");
  }

  private prepareTrainigData = () => {
    const features: number[][] = [];
    const labels: number[] = [];

    for (const learner of this.users) {
      for (const desiredSkill of learner.skillsToLearn || []) {
        for (const teacher of this.users) {
          if (teacher._id.toString() === learner._id.toString()) continue;
          const teacherSkill = teacher.skillsProficientAt?.find(
            (s) => s.name === desiredSkill.name
          );
          const isMatch =
            teacherSkill && teacherSkill.level >= desiredSkill.level ? 1 : 0;

          if (Math.random() > 0.7 && isMatch === 0) continue; // Balance dataset
          const skillsExists = teacherSkill ? 1 : 0;
          const levelDiff = teacherSkill
            ? (teacherSkill.level - desiredSkill.level) / 3
            : 0;
          const sameInstitution =
            learner.education?.institution === teacher.education?.institution
              ? 1
              : 0;
          const normalizedRating = teacher.averageRating
            ? teacher.averageRating / 5
            : 0;
          const mutualSkills = this.countMutualSkills(learner, teacher);
          features.push([
            skillsExists * 0.4,
            levelDiff * 0.2,
            sameInstitution * 0.1,
            normalizedRating * 0.2,
            mutualSkills * 0.1,
          ]);
          labels.push(isMatch);
        }
      }
    }
    return { features, labels };
  };

  private countMutualSkills(learner: UserDocument, teacher: UserDocument): number {
    const learnerSkills = new Set(learner.skillsToLearn?.map((s) => s.name));
    const teacherSkills = new Set(
      teacher.skillsProficientAt?.map((s) => s.name)
    );
    let count = 0;
    for (const skill of teacherSkills) {
      if (learnerSkills.has(skill)) count++;
    }
    return count / 10;
  }

  private buildModel(): tf.LayersModel {
    logger.info("Building model");

    const model = tf.sequential();

    // Input layers
    model.add(
      tf.layers.dense({ units: 64, activation: "relu", inputShape: [5] })
    );

    // Hidden layers
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 32, activation: "relu" }));

    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 16, activation: "relu" }));

    // Output (0-1 score)
    model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: "binaryCrossentropy",
      metrics: ["accuracy"],
    });

    logger.info("Model completed building");

    return model;
  }

  private async trainModel() {
    if (!this.model) throw new Error("Model not initiakized");
    logger.info("Beginning training process");

    const { features, labels } = this.prepareTrainigData();

    await this.model.fit(tf.tensor2d(features), tf.tensor1d(labels), {
      epochs: 20,
      batchSize: 32,
      validationSplit: 0.2,
    });
    logger.info("Completed training model");
  }

  public async getRecommendations(learnerId: string): Promise<SkillRecommendations[]> {
    if (!this.initialized) throw Error("Recomendation model not initialized");

    await this.loadUsers()
      .catch((err) => {
        logger.error("Failed to load users for recommendations", err);
        // throw new Error("Failed to load users for recommendations");
      });
      
    const learner = this.users.find(
      (u) => u._id.toString() === learnerId.toString()
    );
    
    if (!learner) return [];

    const recommendations: SkillRecommendations[] = [];

    for (const desiredSkill of learner.skillsToLearn || []) {
      for (const teacher of this.users) {
        const teacherSkill = teacher.skillsProficientAt?.find(
          (s) => s.name === desiredSkill.name
        );
        if (!teacherSkill || teacherSkill.level < desiredSkill.level) continue;
        const skillsExists = 1;
        const levelDiff = (teacherSkill.level - desiredSkill.level) / 3;
        const sameInstitution =
          learner.education?.institution === teacher.education?.institution
            ? 1
            : 0;
        const normalizedRating = teacher.averageRating
          ? teacher.averageRating / 5
          : 0;
        const mutualSkills = this.countMutualSkills(learner, teacher);
        // Prepare features
        const input = tf.tensor2d([
          [
            skillsExists * 0.4,
            levelDiff * 0.2,
            sameInstitution * 0.1,
            normalizedRating * 0.2,
            mutualSkills * 0.1,
          ],
        ]);
        // Predict
        const score = (
          await (this.model?.predict(input) as tf.Tensor).data()
        )[0];

        input.dispose();

        recommendations.push({
          user: teacher,
          matchScore: score,
          matchedSkill: desiredSkill.name,
          levelDifference: teacherSkill.level - desiredSkill.level,
        });
      }
    }

    const uniqueRecords = Array.from(
      new Map(recommendations.map((r) => [r.user._id.toString(), r])).values()
    );

    return uniqueRecords.sort((a, b) => b.matchScore - a.matchScore);
  }

  public async getBestMatches(learnerId: string) {}
}
