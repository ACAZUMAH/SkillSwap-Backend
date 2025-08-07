import { ChatUsers } from "../graphql";

interface FromUser {
  id: string;
  profile_img: string;
  firstName: string;
  lastName: string;
}

export interface videoData {
  to: string;
  from: FromUser;
  type: string;
  roomId: string;
  users?: ChatUsers;
  chatId?: string;
}
