import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Chat } from '../../models/CHAT/Chat.model';
import { Message } from '../../models/CHAT/Message.model';
import { ChatService } from '../../services/CHAT/chat.service';
import { UserService } from '../../services/user.service';
import { AgenceService } from '../../services/agence/agence.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  chatForm: FormGroup;
  chatObj: Chat = new Chat();
  messageObj: Message = {
    senderEmail: '',
    replymessage: '',
    time: ''
  };

  public messageList: Message[] = [];
  public chatList: Chat[] = [];
  public chatData: Chat | any;

  public alluser: any[] = [];

  replymessage: string = "checking";

  chatId: string = sessionStorage.getItem('chatId') || '';
  secondUserName: string = '';
  firstUserName: string = sessionStorage.getItem('username') || '';
  senderEmail: string = sessionStorage.getItem('username') || '';
  senderCheck: string = sessionStorage.getItem('username') || '';

  timesRun = 0;
  timesRun2 = 0;

  // Adding the 'check' property as mentioned in the template error
  check: string = 'someValue';  // Define 'check' with a valid value

  constructor(
    private chatService: ChatService,
    private router: Router,
    private userService: UserService,
    private location: Location,
    private agenceService: AgenceService
  ) {
    this.chatForm = new FormGroup({
      replymessage: new FormControl()
    });
  }

  ngOnInit(): void {
    // Refresh current chat messages every second
    setInterval(() => {
      const chatId = sessionStorage.getItem('chatId');
      if (chatId) {
        this.chatService.getChatById(chatId).subscribe(data => {
          this.chatData = data;
          this.messageList = data.messageList || [];
          this.secondUserName = data.secondUserName || '';
          this.firstUserName = data.firstUserName || '';
        });
      }
    }, 1000);

    // Fetch chats for the logged-in user
    const username = sessionStorage.getItem('username');
    if (username) {
      const chatListInterval = setInterval(() => {
        this.chatService.getChatByFirstUserNameOrSecondUserName(username).subscribe(data => {
          this.chatList = data || [];
        });
        this.timesRun2 += 1;
        if (this.timesRun2 === 2) {
          clearInterval(chatListInterval);
        }
      }, 1000);
    }

    // Fetch all users
    const userInterval = setInterval(() => {
      this.agenceService.getAll().subscribe((data: any) => {
        this.alluser = data || [];
      });
      this.timesRun += 1;
      if (this.timesRun === 2) {
        clearInterval(userInterval);
      }
    }, 1000);
  }

  loadChatByEmail(firstUser: string | undefined, secondUser: string | undefined): void {
    sessionStorage.removeItem("chatId");

    if (firstUser && secondUser) {
      this.chatService.getChatByFirstUserNameAndSecondUserName(firstUser, secondUser).subscribe(data => {
        if (data && data.length > 0) {
          this.chatData = data[0];
          this.chatId = this.chatData.chatId;
          sessionStorage.setItem('chatId', this.chatId.toString());

          this.chatService.getChatById(this.chatId.toString()).subscribe(chat => {
            this.chatData = chat;
            this.messageList = chat.messageList || [];
            this.secondUserName = chat.secondUserName || '';
            this.firstUserName = chat.firstUserName || '';
          });
        } else {
          console.warn('No chat found between the specified users.');
        }
      }, error => {
        console.error('Error fetching chat by usernames', error);
      });
    } else {
      console.error('User names are undefined');
    }
  }

  sendMessage(): void {
    this.messageObj.replymessage = this.chatForm.value.replymessage;
    this.chatService.updateChat(this.messageObj, this.chatId).subscribe(() => {
      this.chatForm.reset();
      this.chatService.getChatById(this.chatId.toString()).subscribe(data => {
        this.chatData = data;
        this.messageList = this.chatData.messageList || [];
        this.secondUserName = this.chatData.secondUserName || '';
        this.firstUserName = this.chatData.firstUserName || '';
      });
    });
  }

  routeX(): void {
    sessionStorage.clear();
    this.router.navigateByUrl('');
  }

  routeHome(): void {
    this.router.navigateByUrl('');
  }

  goBack(): void {
    window.history.back();
  }

  goToChat(username: string): void {
    // (Intentionally left empty for now as you commented it out)
  }
}
