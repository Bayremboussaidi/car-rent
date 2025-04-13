import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Chat } from '../../models/CHAT/Chat.model';
import { Message } from '../../models/CHAT/Message.model';
import { ChatService } from '../../services/CHAT/chat.service';
import { UserService } from '../../services/user.service';
import { AgenceService } from '../../services/agence/agence.service';
import { Location } from '@angular/common';
import { AdminService } from '../../services/admin/admin.service';

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
    private agenceService: AgenceService,
    private adminService: AdminService
  ) {
    this.chatForm = new FormGroup({
      replymessage: new FormControl()
    });
  }

  ngOnInit(): void {
    const currentAdmin = this.adminService.getCurrentAdmin();
    if (currentAdmin) {
      this.senderEmail = currentAdmin.email;
      this.senderCheck = currentAdmin.email;
      this.check = currentAdmin.email;
      console.log('Utilisateur courant (init):', currentAdmin.email);
    } else {
      console.warn('Aucun admin connecté');
    }

    // Set the current logged-in user's email from sessionStorage
    this.senderCheck = this.senderEmail = sessionStorage.getItem('username') || '';
    this.check = this.senderCheck;

    // Fetch all users (combined from admin and agence)
    const userInterval = setInterval(() => {
      this.chatService.getAllUsers().subscribe((data: any) => {
        this.alluser = data || []; // All users will be stored here

        // Check for each pair of users and create a chat if it doesn't exist
        this.alluser.forEach(user => {
          if (user.email !== this.senderEmail) {
            this.chatService.getChatByFirstUserEmailAndSecondUserEmail(this.senderEmail, user.email).subscribe(chatData => {
              if (chatData.length === 0) {
                // No chat exists, create a new chat
                const newChat: Chat = {
                  firstUserEmail: this.senderEmail,
                  secondUserEmail: user.email,
                  messageList: []
                };
                this.chatService.createChatRoom(newChat).subscribe(createdChat => {
                  console.log('Chat created successfully between', this.senderEmail, 'and', user.email);

                  // Now send "hello" message from both users
                  const initialMessage = "hello";

                  // Message from logged-in user
                  const messageFromUser: Message = {
                    senderEmail: this.senderEmail,
                    replymessage: initialMessage,
                    time: new Date().toISOString()
                  };

                  this.chatService.updateChat(messageFromUser, createdChat.chatId!).subscribe(() => {
                    console.log('Message from', this.senderEmail, 'sent: hello');
                  });

                  // Message from the other user (the second user)
                  const messageFromOtherUser: Message = {
                    senderEmail: user.email,
                    replymessage: initialMessage,
                    time: new Date().toISOString()
                  };

                  this.chatService.updateChat(messageFromOtherUser, createdChat.chatId!).subscribe(() => {
                    console.log('Message from', user.email, 'sent: hello');
                  });
                });
              }
            });
          }
        });
      });
      this.timesRun += 1;
      if (this.timesRun === 2) {
        clearInterval(userInterval);
      }
    }, 1000);
  }



  loadChatByEmail(firstUser: string | undefined, secondUser: string | undefined): void {
    console.log('Trying to load chat between:', firstUser, 'and', secondUser);

    sessionStorage.removeItem("chatId");

    if (firstUser && secondUser) {
      this.chatService.getChatByFirstUserEmailAndSecondUserEmail(firstUser, secondUser).subscribe(data => {
        console.log('API Response:', data); // ✅ voir si API renvoie quelque chose

        if (data && data.length > 0) {
          this.chatData = data[0];
          this.chatId = this.chatData.chatId!;
          sessionStorage.setItem('chatId', this.chatId);

          this.chatService.getChatById(this.chatId).subscribe(chat => {
            console.log('Chat loaded by ID:', chat); // ✅ 2e appel
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
    const currentAdmin = this.adminService.getCurrentAdmin();
    if (currentAdmin && email) {
      console.log(' goToChat cliqué, utilisateur courant:', currentAdmin.email, 'autre utilisateur:', email);
      this.loadChatByEmail(currentAdmin.email, email);
    } else {
      console.warn(' utilisateur courant ou cible non défini');
    }
  }

}
