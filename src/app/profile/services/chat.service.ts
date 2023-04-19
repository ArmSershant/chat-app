import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  private url = 'http://localhost:5000';

  constructor() {
    this.socket = io(this.url, {
      transports: ['websocket', 'polling', 'flashsocket'],
      withCredentials: true,
    });
  }

  sendMessage(data: any): void {
    console.log('sending...', data);
    console.log('Message has been sent');
    this.socket.emit('message', data);
  }

  getMessages(sender: number, receiver: number): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.emit('get messages', { sender, receiver });
      this.socket.on('got messages', (messages: any[]) => {
        console.log('Received messages from the server:', messages);
        observer.next(messages);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  getMessage(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('new message', (data) => {
        console.log('taking new message from the server:', data),
          observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
}
