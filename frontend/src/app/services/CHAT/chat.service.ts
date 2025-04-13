import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat } from '../../models/CHAT/Chat.model';
import { Message } from '../../models/CHAT/Message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:8084/api/chats';

  constructor(private http: HttpClient) {}

  getChatById(chatId: string | null): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}/${chatId}`);
  }

  getChatByFirstUserEmailAndSecondUserEmail(first: string, second: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/getChatByFirstUserEmailAndSecondUserEmail?firstUserEmail=${first}&secondUserEmail=${second}`);
  }

  getChatByFirstUserEmailOrSecondUserEmail(email: string | null): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/getChatByFirstUserEmailOrSecondUserEmail/${email}`);
  }

  createChatRoom(chat: Chat): Observable<Chat> {
    return this.http.post<Chat>(`${this.apiUrl}/add`, chat);
  }

  updateChat(message: Message, chatId: string): Observable<Chat> {
    return this.http.put<Chat>(`${this.apiUrl}/message/${chatId}`, message);
  }

  getAllChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/all`);
  }


  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8084/api/chats/allUSERS');
  }
}
