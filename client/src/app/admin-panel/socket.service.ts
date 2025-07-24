import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from './store/chat/chat.state';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3030');
  }

  listen(eventName: string): Observable<ChatMessage> {
    if (!this.socket) return EMPTY;
    return new Observable(observer => {
      this.socket.on(eventName, data => {
        observer.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    if (!this.socket) return;
    this.socket.emit(eventName, data);
  }
}
