import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private readonly uri: string = 'http://localhost:3030';

  constructor() {
    this.socket = io(this.uri, {
      withCredentials: true,
      transports: ['websocket']
    });
  }

  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}