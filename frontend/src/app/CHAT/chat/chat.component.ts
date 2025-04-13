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
  public chatData: Chat = new Chat();
  public alluser: any[] = [];

  chatId: string = sessionStorage.getItem('chatId') || '';
  secondUserEmail: string = '';
  firstUserEmail: string = sessionStorage.getItem('username') || '';
  senderEmail: string = sessionStorage.getItem('username') || '';

  public senderCheck: string = '';
  public check: string = '';

  timesRun = 0;
  timesRun2 = 0;

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
    // Set the current logged-in user's email from sessionStorage
    this.senderCheck = this.senderEmail = sessionStorage.getItem('username') || '';
    this.check = this.senderCheck;

    // Fetch the chat details every second (adjust the interval as needed)
    setInterval(() => {
      const chatId = sessionStorage.getItem('chatId');
      if (chatId) {
        this.chatService.getChatById(chatId).subscribe(data => {
          this.chatData = data;
          this.messageList = data.messageList || [];
          this.secondUserEmail = data.secondUserEmail || '';
          this.firstUserEmail = data.firstUserEmail || '';
        });
      }
    }, 1000);

    // Fetch all chats related to the logged-in user (both firstUserEmail and secondUserEmail)
    const email = sessionStorage.getItem('username');
    if (email) {
      const chatListInterval = setInterval(() => {
        this.chatService.getChatByFirstUserEmailOrSecondUserEmail(email).subscribe(data => {
          this.chatList = data || [];
        });
        this.timesRun2 += 1;
        if (this.timesRun2 === 2) {
          clearInterval(chatListInterval);
        }
      }, 1000);
    }

    // Fetch all users (combined from admin and agence)
    const userInterval = setInterval(() => {
      this.chatService. getAllUsers().subscribe((data: any) => {
        this.alluser = data || []; // All users will be stored here
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
      this.chatService.getChatByFirstUserEmailAndSecondUserEmail(firstUser, secondUser).subscribe(data => {
        if (data && data.length > 0) {
          this.chatData = data[0];
          this.chatId = this.chatData.chatId!;
          sessionStorage.setItem('chatId', this.chatId);

          this.chatService.getChatById(this.chatId).subscribe(chat => {
            this.chatData = chat;
            this.messageList = chat.messageList || [];
            this.secondUserEmail = chat.secondUserEmail || '';
            this.firstUserEmail = chat.firstUserEmail || '';
          });
        } else {
          console.warn('No chat found between the specified users.');
        }
      }, error => {
        console.error('Error fetching chat by emails', error);
      });
    } else {
      console.error('User emails are undefined');
    }
  }

  sendMessage(): void {
    this.messageObj.replymessage = this.chatForm.value.replymessage;
    this.messageObj.senderEmail = this.senderEmail;
    this.messageObj.time = new Date().toISOString();

    this.chatService.updateChat(this.messageObj, this.chatId).subscribe(() => {
      this.chatForm.reset();
      this.chatService.getChatById(this.chatId).subscribe(data => {
        this.chatData = data;
        this.messageList = this.chatData.messageList || [];
        this.secondUserEmail = this.chatData.secondUserEmail || '';
        this.firstUserEmail = this.chatData.firstUserEmail || '';
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

  goToChat(email: string): void {
    console.log("Go to chat with:", email);
  }
}
