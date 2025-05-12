import * as tf from "@tensorflow/tfjs-node";
import { getAllUsers } from "../user";
import { skillDocument, userDocument } from "src/common/interfaces";
import { Types } from "mongoose";

class SkillRecommer {
  private users: userDocument[] = [];
  private allSkills: string[] = [];
  private skillToIndex: Record<string, number> = {};
  private userToIndex: Record<string, number> = {};
  private model: tf.LayersModel | null = null;
  private isInitialized: boolean = false;

  async initialiZe() {
    this.users = await this.loadUsers();
    this.allSkills = this.getAllSkills()
    
  }

  constructor() {
    this.users = [];
    this.allSkills = [];
    this.skillToIndex = {};
    this.userToIndex = {};
    this.model = null;
    this.isInitialized = false;
  }

  private async loadUsers() {
    return await getAllUsers();
  }

  private getAllSkills(): string[] {
    const skillSet = new Set<string>();

    this.users.forEach((user) => {
      user.skillsProficientAt.forEach((skill) => skillSet.add(skill.skill));
      user.skillsToLearn.forEach((skill) => skillSet.add(skill.skill));
    });
    return Array.from(skillSet);
  }

  private createMapping = () => {
    this.allSkills.forEach((skill, index) => {
        this.skillToIndex[skill] = index
    })

    this.users.forEach((user, index) => {
        this.userToIndex[user._id.toString()] = index
    })
  }

  private async createModel (){

  }

  private prepareTrainingData () {

  }

  private trainModal () {

  }

  public recommendSkills(){

  }
}
