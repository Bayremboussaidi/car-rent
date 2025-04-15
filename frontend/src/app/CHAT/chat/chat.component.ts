import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chat } from '../../models/CHAT/Chat.model';
import { Message } from '../../models/CHAT/Message.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChatService } from '../../services/CHAT/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  allUsers: any[] = []; // Store all users
  chatList: Chat[] = []; // Store chat list
  messageList: Message[] = []; // Store messages of the current chat
  chatForm: FormGroup; // Reactive form for chat messages
  senderCheck: string = 'example@example.com'; // Assume this is the logged-in user email
  firstUserName: string = '';
  secondUserName: string = '';
  check: string = ''; // Used for comparison in the template




  @ViewChild('scrollMe', { static: false }) scrollMe: ElementRef | undefined; // Correctly using ViewChild

  constructor(
    private chatService: ChatService,
    private fb: FormBuilder
  ) {
    this.chatForm = this.fb.group({
      content: ['']  // Changed from 'replymessage' to 'content' as per the Message model
    });
  }

  ngOnInit(): void {
    this.loadAllUsers();
    this.loadChatList();
  }

  // Load all users from the server
  loadAllUsers(): void {
    this.chatService.getAllUsers().subscribe(
      (users: any) => {
        this.allUsers = users;
      },
      (error: any) => {
        console.error('Error fetching users', error);
      }
    );
  }

  // Load all chats for the current user
  loadChatList(): void {
    this.chatService.getChatByFirstUserEmailOrSecondUserEmail(this.senderCheck).subscribe(
      (chats: any) => {
        this.chatList = chats;
      },
      (error: any) => {
        console.error('Error fetching chats', error);
      }
    );
  }

  // Navigate to a chat by selecting a user
  goToChat(userName: string): void {
    this.firstUserName = this.senderCheck;
    this.secondUserName = userName;
    this.loadMessages();
  }

  // Load messages for a specific chat
  loadMessages(): void {
    this.chatService.getChatByFirstUserEmailAndSecondUserEmail(this.firstUserName, this.secondUserName).subscribe(
      (chatList: any) => {
        if (chatList && chatList.length > 0) {
          this.messageList = chatList[0].messages; // Assuming the messages are in the first chat object
        }
      },
      (error: any) => {
        console.error('Error loading messages', error);
      }
    );
  }

  // Send a new message
  sendMessage(): void {
    const message: Message = {
      content: this.chatForm.value.content, // Changed to 'content' based on the model
      senderEmail: this.senderCheck,
      time: new Date().toISOString() // You can modify this as needed
    };

    if (this.firstUserName && this.secondUserName) {
      this.chatService.updateChat(message, 1).subscribe( // Assuming chatId = 1 for now
        (updatedChat: any) => {
          this.messageList.push(message); // Add message to message list
          this.chatForm.reset();
          this.scrollToBottom();
        },
        (error: any) => {
          console.error('Error sending message', error);
        }
      );
    }
  }

  // Scroll to the bottom of the chat window after a new message
  scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollMe) {
        this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight;
      }
    }, 0);
  }

  // Handle click to load chat with specific users
  loadChatByEmail(firstUserEmail: string, secondUserEmail: string): void {
    this.chatService
      .getChatByFirstUserEmailAndSecondUserEmail(firstUserEmail, secondUserEmail)
      .subscribe((chats: Chat[]) => {
        if (chats && chats.length > 0) {
          const chat = chats[0]; // Take the first matching chat
          this.messageList = chat.messages || [];
          this.secondUserName = chat.secondUserName || '';
          this.firstUserName = chat.firstUserName || '';
        }
      });
  }



  goBack(): void {
    window.history.back();
  }
}
