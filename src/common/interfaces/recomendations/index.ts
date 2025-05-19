import { UserDocument } from "../user";

export interface UserMatch {}

export interface SkillRecommendations {
  user: UserDocument;
  matchScore: number;
  matchedSkill: string;
  levelDifference: number;
}