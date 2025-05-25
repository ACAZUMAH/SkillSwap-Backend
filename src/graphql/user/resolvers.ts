import { GraphqlContext, MutationUpdateUserArgs, QuerySearchArgs, UserDocument } from "src/common/interfaces";
import { getUserById, searchUsersOrSkills, updateUserProfile } from "src/services/user";

const me = (_: any, __: any, { user }: GraphqlContext) => {
  return getUserById(user._id);
}

const updateUser = (_: any, args: MutationUpdateUserArgs, { user }: GraphqlContext) => {
  return updateUserProfile({ id: user._id, ...args.data });
};

const search = (_: any, args: QuerySearchArgs) => {
  return searchUsersOrSkills({ ...args.filters });
};

const recommendation = async (_: any, __: any, { user, skillRecommender }: GraphqlContext) => {
  return await skillRecommender.getRecommendations(user._id)
}

const id = (parent: UserDocument) => parent._id.toString();

export const userResolver = {
  Query: {
    me,
    search,
    recommendation
  },
  User: {
    id,
  },

  Mutation: {
    updateUser,
  },
};
