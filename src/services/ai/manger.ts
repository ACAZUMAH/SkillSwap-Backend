import { SkillSwapRecommender } from "./recommender";

export class RecommendationManager {
  private recommender: SkillSwapRecommender;
  private retrain: boolean = false;
  private isTraining: boolean = false;
  private isInitialized: boolean = false;

  public constructor(recommender: SkillSwapRecommender) {
    this.recommender = recommender;
  }

  public async InitializeOnce(){
    if(!this.isInitialized) {
      await this.recommender.initialize();
      this.isInitialized = true;
    }
  }

  public makeDirty() {
    this.retrain = true;
  }

  public async reInitialize() {
    if (!this.isInitialized) {
      await this.InitializeOnce();
    }

    if (this.retrain || !this.isTraining) {
      this.isTraining = true;
      try {
        await this.recommender.initialize();
        this.retrain = false;
      } catch(err) {
        console.error("Failed to reinitialize the recommendation system", err);
        //throw new Error("Reinitialization failed");
      } finally {
        this.isTraining = false;
      }
    }
  }
  
  public getRecommender() {
    return this.recommender;
  }
}
