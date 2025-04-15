import { Message } from "./Message.model";


export interface Chat {
  firstUserEmail: string;
  secondUserEmail: string;
  // Add any additional properties here
  firstUserName?: string;  // Optional: Add first user name
  secondUserName?: string; // Optional: Add second user name
  messages?: Message[];
}
