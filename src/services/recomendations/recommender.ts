import * as tf from "@tensorflow/tfjs";
import { UserDocument } from "src/common/interfaces";
import { getAllUsers } from "../user";
import logger from "src/loggers/logger";
import { SkillRecommendations } from "src/common/interfaces/recomendations";

export class SkillSwapRecommender {
  private users: UserDocument[] = [];
  private model: tf.LayersModel | null = null;
  private skillToIndex: Record<string, number> = {};
  private userToIndex: Record<string, number> = {};
  private institutionToIndex: Record<string, number> = {};
  private initialized: boolean = false

  public async initialize() {
    await this.loadUsers()
    logger.info(`Successfully loaded ${this.users.length} test users`);

    this.createMappings();

    this.model = this.buildModel();
    
    await this.trainModel();

    this.initialized = true

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

  private buildModel(): tf.LayersModel {
    logger.info("Building model");

    const model = tf.sequential();

    // Input layers
    model.add(
      tf.layers.dense({
        units: 32,
        activation: "relu",
        inputShape: [4], // [skillMatch, levelDiff, sameInstitution, rating]
      })
    );

    // Hidden layers
    model.add(tf.layers.dense({ units: 16, activation: "relu" }));

    // Output (0-1 score)
    model.add(
      tf.layers.dense({
        units: 1,
        activation: "sigmoid",
      })
    );

    model.compile({
      optimizer: tf.train.adam(0.01),
      loss: "binaryCrossentropy",
      metrics: ["accuracy"],
    });

    logger.info("Model completed building");

    return model;
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

          features.push([
            teacherSkill ? 1 : 0, // Skill exists
            teacherSkill ? (teacherSkill.level - desiredSkill.level) / 3 : 0, // Normalized level diff
            learner.education?.institution === teacher.education?.institution
              ? 1
              : 0,
            teacher.averageRating ? teacher.averageRating / 5 : 0, // Normalized rating
          ]);

          labels.push(isMatch);
        }
      }
    }

    return { features, labels }
  };

  private async trainModel() {
    if (!this.model) throw new Error("Model not initiakized");
    logger.info("Beginning training process");

    const { features, labels } = this.prepareTrainigData()

    await this.model.fit(tf.tensor2d(features), tf.tensor1d(labels), {
      epochs: 20,
      batchSize: 32,
      validationSplit: 0.2,
    });
    logger.info("Completed training model");
  }

  public async getRecommendations(learnerId: string): Promise<SkillRecommendations[]> {
    if (!this.initialized) throw Error("Recomendation model not initialized");

    const learner = this.users.find(u => u._id.toString() === learnerId.toString());
    if (!learner) return [];

    const recommendations: SkillRecommendations[] = [];

    for (const desiredSkill of learner.skillsToLearn || []) {
      for (const teacher of this.users) {
        const teacherSkill = teacher.skillsProficientAt?.find(
          (s) => s.name === desiredSkill.name
        );
        if (!teacherSkill || teacherSkill.level < desiredSkill.level) continue;

        // Prepare features
        const input = tf.tensor2d([
          [
            1, // Skill exists
            (teacherSkill.level - desiredSkill.level) / 3,
            learner.education?.institution === teacher.education?.institution
              ? 1
              : 0,
            teacher.averageRating ? teacher.averageRating / 5 : 0,
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
          levelDifference: teacherSkill.level - desiredSkill.level
        });
      }
    }

    const uniqueRecords = Array.from(
      new Map(recommendations.map((r) => [r.user._id.toString(), r])).values()
    );

    return uniqueRecords.sort((a, b) => b.matchScore - a.matchScore);
  }
}
