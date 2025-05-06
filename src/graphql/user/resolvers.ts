import { GraphqlContext, MutationUpdateUserArgs } from "src/common/interfaces";
import { updateUserProfile } from "src/services/user";

export const updateUser = (_: any, args: MutationUpdateUserArgs, { user }: GraphqlContext) => {
  return updateUserProfile({ id: user._id, ...args.data });
};

export const userResolver = {
  Mutation: {
    updateUser,
  },
};
