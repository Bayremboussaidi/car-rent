import { Message } from "./Message.model";


export class Chat {
  chatId?: string;
  firstUserEmail?: string;
  secondUserEmail?: string;
  messageList?: Message[];
}
