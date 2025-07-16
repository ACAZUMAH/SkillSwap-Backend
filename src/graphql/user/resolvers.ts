import {
  GraphqlContext,
  MutationUpdateUserArgs,
  QueryRecommendationArgs,
  QuerySearchArgs,
  QueryUserArgs,
  UserDocument,
} from "src/common/interfaces";
import * as UserServices from "src/services/user";

const me = (_: any, __: any, { user }: GraphqlContext) => {
  return UserServices.getUserById(user._id);
};

const user = (_: any, args: QueryUserArgs) => {
  return UserServices.getUserById(args.id);
};

const updateUser = (_: any, args: MutationUpdateUserArgs, { user }: GraphqlContext) => {
  return UserServices.updateUserProfile({ id: user._id, ...args.data });
};

const search = (_: any, args: QuerySearchArgs) => {
  return UserServices.searchUsersOrSkills({ ...args.filters });
};

const recommendation = async (_: any, args: QueryRecommendationArgs, { user }: GraphqlContext) => {
  return UserServices.getRecommendations({ userId: user._id, ...args.filters });
};

const id = (parent: UserDocument) => parent._id.toString();

export const userResolver = {
  Query: {
    me,
    user,
    search,
    recommendation,
  },
  User: {
    id,
  },

  Mutation: {
    updateUser,
  },
};
