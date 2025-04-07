import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Chat } from '../../models/CHAT/Chat.model';
import { Message } from '../../models/CHAT/Message.model';
import { ChatService } from '../../services/CHAT/chat.service';
import { UserService } from '../../services/user.service';
import { AgenceService } from '../../services/agence/agence.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  chatForm: FormGroup;
  chatObj: Chat = new Chat();
  messageObj: Message = new Message();
  public messageList: any = [];
  public chatList: any = [];
  replymessage: String = "checking";
  public chatData: any;
  chatId: any = sessionStorage.getItem('chatId');
  secondUserName = "";
  public alluser: any = [];  // ✅ To store all users fetched from AgenceService
  check = sessionStorage.getItem('username');
  timesRun = 0;
  timesRun2 = 0;

  firstUserName = sessionStorage.getItem('username');
  senderEmail = sessionStorage.getItem('username');

  // Define senderCheck as the logged-in username
  senderCheck = sessionStorage.getItem('username') || ''; // Make sure it's defined

  constructor(
    private chatService: ChatService,
    private router: Router,
    private userService: UserService,
    private agenceService: AgenceService  // ✅ Inject AgenceService
  ) {
    this.chatForm = new FormGroup({
      replymessage: new FormControl()
    });
  }

  ngOnInit(): void {
    // Get chat data and message list on an interval (every second)
    setInterval(() => {
      this.chatService.getChatById(sessionStorage.getItem('chatId')).subscribe(data => {
        this.chatData = data;
        this.messageList = this.chatData.messageList;
        this.secondUserName = this.chatData.secondUserName;
        this.firstUserName = this.chatData.firstUserName;
      });
    }, 1000);

    // Get all chat list for the logged-in user
    let getByname = setInterval(() => {
      this.chatService.getChatByFirstUserNameOrSecondUserName(sessionStorage.getItem('username')).subscribe(data => {
        this.chatData = data;
        this.chatList = this.chatData;
      });
      this.timesRun2 += 1;
      if (this.timesRun2 === 2) {
        clearInterval(getByname);
      }
    }, 1000);

    // Fetch all users using AgenceService
    let all = setInterval(() => {
      this.agenceService.getAll().subscribe((data: any) => {
        this.alluser = data;  // Populate the `alluser` array with data
      });

      this.timesRun += 1;
      if (this.timesRun === 2) {
        clearInterval(all);
      }
    }, 1000);
  }

  loadChatByEmail(event: string, event1: string) {
    sessionStorage.removeItem("chatId");
    this.chatService.getChatByFirstUserNameAndSecondUserName(event, event1).subscribe(data => {
      this.chatData = data;
      this.chatId = this.chatData[0].chatId;
      sessionStorage.setItem('chatId', this.chatId);

      setInterval(() => {
        this.chatService.getChatById(this.chatId).subscribe(data => {
          this.chatData = data;
          this.messageList = this.chatData.messageList;
          this.secondUserName = this.chatData.secondUserName;
          this.firstUserName = this.chatData.firstUserName;
        });
      }, 1000);
    });
  }

  sendMessage() {
    this.messageObj.replymessage = this.chatForm.value.replymessage;
    //this.messageObj.senderEmail = this.senderEmail;
    this.chatService.updateChat(this.messageObj, this.chatId).subscribe(data => {
      this.chatForm.reset();

      // Refresh the message list after sending a message
      this.chatService.getChatById(this.chatId).subscribe(data => {
        this.chatData = data;
        this.messageList = this.chatData.messageList;
        this.secondUserName = this.chatData.secondUserName;
        this.firstUserName = this.chatData.firstUserName;
      });
    });
  }

  routeX() {
    sessionStorage.clear();
    this.router.navigateByUrl('');
  }

  routeHome() {
    this.router.navigateByUrl('');
  }

  goToChat(username: any) {
    /*this.chatService.getChatByFirstUserNameAndSecondUserName(username, sessionStorage.getItem("username")).subscribe(
      (data) => {
        this.chatId = data.chatId;
        sessionStorage.setItem("chatId", this.chatId);
      },
      (error) => {
        if (error.status == 404) {
          this.chatObj.firstUserName = sessionStorage.getItem("username");
          this.chatObj.secondUserName = username;
          this.chatService.createChatRoom(this.chatObj).subscribe(
            (data) => {
              this.chatData = data;
              this.chatId = this.chatData.chatId;
              sessionStorage.setItem("chatId", this.chatData.chatId);
            }
          );
        }
      }
    );*/
  }
}
