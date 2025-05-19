import * as tf from "@tensorflow/tfjs";
import { getAllUsers } from "../user";
import { recommendations, userDocument } from "src/common/interfaces";
import logger from "src/loggers/logger";
import { Types } from "mongoose";

export class SkillRecommender {
  private users: userDocument[] = [];
  private skillToIndex: Record<string, number> = {};
  private userToIndex: Record<string, number> = {};
  private model: tf.LayersModel | null = null;
  private isInitialized: boolean = false;

  public async initialiZe() {
    await this.loadUsers();
    logger.info(`Successfully loaded ${this.users.length} test users`);

    this.createMapping();

    this.model = await this.buildModel();

    await this.trainModal();

    this.isInitialized = true;

    logger.info("Recommendation system initialized");
  }

  private async loadUsers() {
    this.users = await getAllUsers();
  }

  private createMapping = () => {
    const allSkills = new Set<string>();

    this.users.forEach((user) => {
      user.skillsProficientAt.forEach((skill) => allSkills.add(skill.name));
      user.skillsToLearn.forEach((skill) => allSkills.add(skill.name));
    });

    Array.from(allSkills).forEach((skill, index) => {
      this.skillToIndex[skill] = index;
    });

    this.users.forEach((user, index) => {
      this.userToIndex[user._id.toString()] = index;
    });

    logger.info("Mappings created");
  };

  private async buildModel(): Promise<tf.LayersModel> {
    logger.info("Building model");
    const numUsers = this.users.length;
    const numSkills = Object.keys(this.skillToIndex).length;
    const embeddingSize = 8;

    // input layers
    const learnerInput: tf.SymbolicTensor = tf.input({
      shape: [1],
      name: "learner_input",
    });
    const skillInput: tf.SymbolicTensor = tf.input({
      shape: [1],
      name: "skill_input",
    });
    const teacherInput: tf.SymbolicTensor = tf.input({
      shape: [1],
      name: "teacher_input",
    });

    // embeddings
    const learnerEmbedding = tf.layers
      .embedding({
        inputDim: numUsers,
        outputDim: embeddingSize,
        name: "learner_embedding",
      })
      .apply(learnerInput) as tf.SymbolicTensor;

    const teacherEmdedding = tf.layers
      .embedding({
        inputDim: numUsers,
        outputDim: embeddingSize,
      })
      .apply(teacherInput) as tf.SymbolicTensor;
    // const skillMatch = tf.layers.lambda()
    const skillEmbedding = tf.layers
      .embedding({
        inputDim: numSkills,
        outputDim: embeddingSize,
        name: "skill_embedding",
      })
      .apply(skillInput) as tf.SymbolicTensor;



    const skillLearnerSimilarity = tf.layers
      .dot({
        axes: -1,
        normalize: true,
      })
      .apply([
        tf.layers.flatten().apply(skillEmbedding) as tf.SymbolicTensor,
        tf.layers.flatten().apply(learnerEmbedding) as tf.SymbolicTensor,
      ]) as tf.SymbolicTensor;

    // combine features
    const combineFeatures = tf.layers
      .concatenate()
      .apply([
        tf.layers.flatten().apply(learnerEmbedding) as tf.SymbolicTensor,
        tf.layers.flatten().apply(skillEmbedding) as tf.SymbolicTensor,
        tf.layers.flatten().apply(teacherEmdedding) as tf.SymbolicTensor,
        skillLearnerSimilarity,
      ]) as tf.SymbolicTensor;

    // Neural network
    const hidden1 = tf.layers
      .dense({ units: 64, activation: "relu" })
      .apply(combineFeatures);
    const output1 = tf.layers.dropout({ rate: 0.3 }).apply(hidden1);
    const hidden2 = tf.layers
      .dense({ units: 32, activation: "relu" })
      .apply(output1);
    const output = tf.layers
      .dense({ units: 1, activation: "sigmoid" })
      .apply(hidden2);

    // create the model
    const model = tf.model({
      inputs: [learnerInput, skillInput, teacherInput],
      outputs: output as tf.SymbolicTensor,
    });

    // compile the model
    model.compile({
      optimizer: tf.train.adam(0.001), //adam optimizer with learning rate
      loss: "binaryCrossentropy", // MSE for regression task
      metrics: ["accuracy"], // track accuracy during training
    });

    logger.info("Model completed building");

    return model;
  }

  private prepareTrainingData() {
    const learnerIndices: number[] = [];
    const skillIndices: number[] = [];
    const teacherIndices: number[] = [];
    const levelDiffs: number[] = [];
    const labels: number[] = [];

    this.users.forEach((learner) => {
      learner.skillsToLearn.forEach((disiredSkill) => {
        this.users.forEach((teacher) => {
          // skip if the same user
          if (teacher._id.toString() === learner._id.toString()) return;

          const teacherSkill = teacher.skillsProficientAt.find(
            (tSkill) => tSkill.name === disiredSkill.name
          );
          const canTeach =
            teacherSkill && teacherSkill.level >= disiredSkill.level;

          const levelDiff = teacherSkill
            ? (teacherSkill.level - disiredSkill.level) / 3
            : -1;

          //add to training data
          learnerIndices.push(this.userToIndex[learner._id.toString()]);
          skillIndices.push(this.skillToIndex[disiredSkill.name]);
          teacherIndices.push(this.userToIndex[teacher._id.toString()]);
          levelDiffs.push(levelDiff);
          labels.push(canTeach ? 1 : 0);
        });
      });
    });

    const positiveCount = labels.filter((l) => l === 1).length;
    const negativeCount = labels.length - positiveCount;
    const classWeight = positiveCount / negativeCount;

    return {
      x: [
        tf.tensor1d(learnerIndices, "int32"),
        tf.tensor1d(skillIndices, "int32"),
        tf.tensor1d(teacherIndices, "int32"),
        tf.tensor1d(levelDiffs, "int32"),
      ],
      y: tf.tensor1d(labels, "float32"),
      classWeight,
    };
  }

  private async trainModal(): Promise<void> {
    if (!this.model) throw new Error("Model not initiakized");
    logger.info("Beginning training process");

    const { x, y, classWeight } = this.prepareTrainingData();
    const batchSize = 32;
    const epochs = 15;

    await this.model.fit(x, y, {
      batchSize,
      epochs,
      validationSplit: 0.2,
      classWeight: { 0: 1, 1: classWeight },
    });

    tf.dispose([...x, y]);

    logger.info("Completed training model");
  }

  public async recommendations(
    userId: string | Types.ObjectId
  ): Promise<recommendations[]> {
    if (!this.isInitialized) throw Error("Recomendation model not initialized");

    const recommendations: recommendations[] = [];
    const learnerIndex = this.userToIndex[userId.toString()];

    const learner = this.users?.find(
      (u) => u._id.toString() === userId.toString()
    );

    for (const desiredSkill of learner?.skillsToLearn!) {
      const usersWithSkills = this.users.filter((u) => {
        const hasSkill = u.skillsProficientAt.some(
          (s) => s.name === desiredSkill.name && s.level >= desiredSkill.level
        );
        return hasSkill && u._id.toString() !== userId.toString()
      });

      for( const user of usersWithSkills ){
        const userSkill = user.skillsProficientAt.find(
          s => s.name === desiredSkill.name
        )!

        const levelDiff = (userSkill.level - desiredSkill.level) / 3
        const skillIndex = this.skillToIndex[desiredSkill.name]
        const teacherIndex = this.userToIndex[user._id.toString()]

        const prediction = this.model?.predict([
          tf.tensor2d([[learnerIndex]], [1, 1]),
          tf.tensor2d([[skillIndex]], [1, 1]),
          tf.tensor2d([[teacherIndex]], [1, 1]),
          tf.tensor2d([[levelDiff]], [1, 1])
        ]) as tf.Tensor

        const score = (await prediction.data())[0]

        tf.dispose(prediction)

        recommendations.push({
          user: user,
          matchScore: score,
          matchedSkill: desiredSkill.name,
          levelDifference: userSkill.level - desiredSkill.level
        })
      }

    }
    const uniqueRecords = Array.from(
      new Map(recommendations.map((r) => [r.user._id.toString(), r])).values()
    );

    return uniqueRecords.sort((a, b) => b.matchScore - a.matchScore);
  }

  public findBestMatches() {}
}
