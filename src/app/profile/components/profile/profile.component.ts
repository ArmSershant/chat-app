import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { User } from 'src/app/Auth/models/user.model';
import { Store } from '@ngrx/store';
import { IState } from 'src/app/store/state/state';
import {
  selectUser,
  selectUsers,
} from 'src/app/store/userStore/user.selectors';
import {
  getFetchedUser,
  getFetchedUsers,
} from 'src/app/store/userStore/user.actions';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  public messageText!: string;
  public messageArray$!: Observable<any[]>;
  public messageArray!: any[];
  public email!: string;
  public currentUser$ = this.store.select(selectUser);
  public currentUser!: User;
  public selectedUser: any;
  public userList$ = this.store.select(selectUsers);
  public userList: User[] = [];
  private socket = io('http://localhost:5000');

  constructor(private chatService: ChatService, private store: Store<IState>) {
    this.userList$.subscribe((users: User[]) => (this.userList = users));
    this.currentUser$.subscribe((user: User) => (this.currentUser = user));
    this.messageArray$?.subscribe((data: any) => (this.messageArray = data));
  }

  ngOnInit(): void {
    this.socket = io('http://localhost:5000', {
      withCredentials: true,
    });
    this.store.dispatch(getFetchedUsers());
    this.store.dispatch(getFetchedUser());
    this.socket.on('connect', () => {
      console.log('Connected to the server');
    });
  }

  selectUserHandler(email: string): void {
    this.selectedUser = this.userList.find(
      (user: User) => user.email === email,
      (this.messageArray = [])
    );
    console.log('getting all messagess...');
    let sender = this.currentUser.id;
    let receiver = this.selectedUser.id;
    this.chatService.getMessages(sender, receiver).subscribe((messages) => {
      this.messageArray.push(messages);
    });
    this.chatService.getMessage().subscribe((data) => {
      console.log('got new message: ', data);
      console.log('adding to the messageArray...');
      this.messageArray.push(data);
    });
    this.socket.emit('get messages', { sender, receiver });
    this.socket.on('got messages', (messages: any[]) => {
      if (!!messages) {
        this.messageArray = [...messages];
      }
    });
  }

  sendMessage(): void {
    this.chatService.sendMessage({
      message: this.messageText,
      user: this.currentUser.name,
      senderId: this.currentUser.id,
      receiverId: this.selectedUser.id,
    });
    this.messageText = '';
  }
}
