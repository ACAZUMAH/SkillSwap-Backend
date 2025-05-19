import { GraphqlContext, MutationUpdateUserArgs, QuerySearchArgs } from "src/common/interfaces";
import { searchUsersOrSkills, updateUserProfile } from "src/services/user";

export const updateUser = (_: any, args: MutationUpdateUserArgs, { user }: GraphqlContext) => {
  return updateUserProfile({ id: user._id, ...args.data });
};

export const search = (_: any, args: QuerySearchArgs) => {
  return searchUsersOrSkills({ ...args.filters });
};

export const recommendation = async (_: any, __: any, { user, skillRecommender }: GraphqlContext) => {
  return await skillRecommender.getRecommendations(user._id)
}

export const userResolver = {
  Query: {
    search,
    recommendation
  },
  Mutation: {
    updateUser,
  },
};
