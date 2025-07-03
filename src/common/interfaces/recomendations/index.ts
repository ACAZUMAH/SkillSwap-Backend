import { UserSkill } from "../skills";
import { UserDocument } from "../user";

export interface UserMatch {}

export interface SkillRecommendations {
  user: UserDocument;
  matchScore?: number;
  matchedSkill?: UserSkill;
  levelDifference?: number;
  mutualExchange?: boolean;
}