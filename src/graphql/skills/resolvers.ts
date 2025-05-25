import { SkillDocument } from "src/common/interfaces";

const id = (parent: SkillDocument) => parent._id.toString();

export const skillResolvers = {
    Skill: {
        id
    }
};