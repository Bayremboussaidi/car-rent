import { Message } from "./Message.model";

export class Chat {
  chatId?: number = undefined;
  firstUserName: string = '';
  secondUserName: string = '';
  messageList: Message[] = [];
}
