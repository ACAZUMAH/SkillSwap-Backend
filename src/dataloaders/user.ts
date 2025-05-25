import DataLoader from "dataloader";
import { userModel } from "src/models";

export const createUserLoader = () => {
    const getUsersByIds = async (ids: readonly string[]) => {
        const users = await userModel.find({ _id: { $in: ids } })
        return ids.map(id => users.find(user => user._id.toString() === id))
    }

    return new DataLoader(getUsersByIds)
}