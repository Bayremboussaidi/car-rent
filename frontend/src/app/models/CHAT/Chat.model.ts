import { Message } from "./Message.model";

export class Chat {
  chatId?: number;
  firstUserName?: string;
  secondUserName?: string;
  messageList?: Message[];
}
