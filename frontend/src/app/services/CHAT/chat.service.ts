// src/app/services/chat/chat.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat } from '../../models/CHAT/Chat.model';
import { Message } from '../../models/CHAT/Message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:8084/api/chats'; // Make sure the port matches your Spring Boot server

  constructor(private http: HttpClient) {}

  // Get a chat by its ID
  getChatById(chatId: string | null): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}/${chatId}`);
  }

  // Get chat by both usernames
  getChatByFirstUserNameAndSecondUserName(first: string, second: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/getChatByFirstUserNameAndSecondUserName?firstUserName=${first}&secondUserName=${second}`);
  }

  // Get chat by either first or second username
  getChatByFirstUserNameOrSecondUserName(user: string | null): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/getChatByFirstUserNameOrSecondUserName/${user}`);
  }

  // Create a new chat room
  createChatRoom(chat: Chat): Observable<Chat> {
    return this.http.post<Chat>(`${this.apiUrl}/add`, chat);
  }

  // Add a message to a chat
  updateChat(message: Message, chatId: string): Observable<Chat> {
    return this.http.put<Chat>(`${this.apiUrl}/message/${chatId}`, message);
  }

  // Optional: Get all chats
  getAllChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/all`);
  }
}
