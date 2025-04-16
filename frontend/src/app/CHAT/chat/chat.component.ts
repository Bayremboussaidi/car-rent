import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chat } from '../../models/CHAT/Chat.model';
import { Message } from '../../models/CHAT/Message.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../../services/CHAT/chat.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  allUsers: any[] = [];
  chatList: Chat[] = [];
  messageList: Message[] = [];
  chatForm: FormGroup;
  senderCheck: string = '';//current user
  firstUserName: string = '';
  secondUserName: string = '';
  secondUserEmail: string = '';
  currentChatId: number | null = null;
  check: string = '';

  @ViewChild('scrollMe', { static: false }) scrollMe?: ElementRef;

  constructor(
    private chatService: ChatService,
    private fb: FormBuilder
  ) {
    this.chatForm = this.fb.group({
      messageContent: ['']
    });
  }

  ngOnInit(): void {
    this.senderCheck = this.chatService.getCurrentUserEmailFromLocalStorage() || '';
    this.loadAllUsers();
    this.loadChatList();
    this.fetchCurrentUserDetails();


    this.chatForm = this.fb.group({
      messageContent: ['', Validators.required]
    });
  }

  fetchCurrentUserDetails(): void {
    this.chatService.getUserByEmail(this.senderCheck).subscribe({
      next: (user: any) => {
        this.firstUserName = user?.userName || 'Unknown User';
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
        this.firstUserName = 'Unknown User';
      }
    });
  }

  loadAllUsers(): void {
    this.chatService.getAllUsers().subscribe({
      next: (users: any[]) => {
        this.allUsers = users.filter(user => user.email !== this.senderCheck);
      },
      error: (error) => console.error('Error loading users:', error)
    });
  }

  loadChatList(): void {
    this.chatService.getChatByFirstUserEmailOrSecondUserEmail(this.senderCheck).subscribe({
      next: (chats: Chat[]) => {
        this.chatList = chats;
      },
      error: (error) => console.error('Error loading chats:', error)
    });
  }

  async goToChat(user: any): Promise<void> {
    this.secondUserEmail = user.email;
    this.secondUserName = user.userName;

    try {
      const existingChats = await lastValueFrom(
        this.chatService.getChatByFirstUserEmailAndSecondUserEmail(
          this.senderCheck,
          this.secondUserEmail
        )
      );

      if (existingChats.length > 0) {
        this.handleExistingChat(existingChats[0]);
        this.currentChatId = existingChats[0].chatId ?? null;
        console.log('currentChatId set to:', this.currentChatId);
      } else {
        await this.createNewChat();
      }
    } catch (error) {
      console.error('Error handling chat:', error);
    }
  }


  private handleExistingChat(chat: Chat): void {
    this.currentChatId = chat.chatId!;
    this.messageList = chat.messages || [];
    this.scrollToBottom();
  }


  async createNewChat(): Promise<void> {
    try {
      const newChat = {
        firstUserEmail: this.senderCheck,
        firstUserName: this.firstUserName,
        secondUserEmail: this.secondUserEmail,
        secondUserName: this.secondUserName,
      };

      const createdChat = await lastValueFrom(this.chatService.createChatRoom(newChat));
      this.currentChatId = createdChat.chatId ?? null;
      console.log('New chat created, currentChatId set to:', this.currentChatId);

      this.messageList = []; // optional: clear previous messages
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  }


  sendMessage(): void {
    console.log('sendMessage triggered');  // <-- Add this

    if (!this.chatForm.valid) {
      console.warn('Form invalid');
      return;
    }

    if (!this.currentChatId) {
      console.warn('No currentChatId');
      return;
    }

    const message: Message = {
      content: this.chatForm.value.messageContent,
      senderEmail: this.senderCheck,
      time: new Date().toISOString()
    };

    console.log('Sending message:', message);

    this.chatService.updateChat(message, this.currentChatId).subscribe({
      next: (updatedChat) => {
        console.log('Message sent, response:', updatedChat);
        this.messageList = updatedChat.messages || [];
        this.chatForm.reset();
        this.scrollToBottom();
      },
      error: (error) => console.error('Error sending message:', error)
    });
  }



  loadChatByEmail(firstUserEmail: string, secondUserEmail: string): void {
    this.chatService.getChatByFirstUserEmailAndSecondUserEmail(firstUserEmail, secondUserEmail)
      .subscribe({
        next: (chats: Chat[]) => {
          if (chats.length > 0) {
            const chat = chats[0];
            this.currentChatId = chat.chatId!;
            this.messageList = chat.messages || [];

            if (this.senderCheck === chat.firstUserEmail) {
              this.secondUserEmail = chat.secondUserEmail || '';
              this.secondUserName = chat.secondUserName || '';
            } else {
              this.secondUserEmail = chat.firstUserEmail || '';
              this.secondUserName = chat.firstUserName || '';
            }
          }
        },
        error: (error) => console.error('Error loading chat:', error)
      });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollMe?.nativeElement) {
        this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight;
      }
    }, 0);
  }

  goBack(): void {
    window.history.back();
  }
}
