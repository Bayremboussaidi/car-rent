import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat } from '../../models/CHAT/Chat.model';
import { Message } from '../../models/CHAT/Message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:8084/api/chats'; // adapt to your backend base URL

  constructor(private http: HttpClient) {}

  getChatById(chatId: string | null): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}/${chatId}`);
  }

  getChatByFirstUserNameAndSecondUserName(first: string, second: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/search?first=${first}&second=${second}`);
  }

  getChatByFirstUserNameOrSecondUserName(user: string | null): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/user/${user}`);
  }

  createChatRoom(chat: Chat): Observable<Chat> {
    return this.http.post<Chat>(`${this.apiUrl}`, chat);
  }

  updateChat(message: Message, chatId: string): Observable<Chat> {
    return this.http.put<Chat>(`${this.apiUrl}/${chatId}/messages`, message);
  }
}
