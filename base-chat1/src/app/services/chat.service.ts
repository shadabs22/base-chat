import { Injectable } from '@angular/core';
// import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';

import { ChatMessage } from '../models/chat-message.model';

@Injectable()
export class ChatService {
  user: firebase.User;
  // chatMessages: FirebaseListObservable<ChatMessage[]>;
  chatMessages: AngularFireList<any>;
  chatMessage: ChatMessage;
  userName: Observable<string>;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
    ) {
        this.afAuth.authState.subscribe(auth => {
          if (auth !== undefined && auth !== null) {
            this.user = auth;
          }

          // this.getUser().subscribe(a => {
          //   this.userName = a.displayName;
          // });

          // this.userName = this.getUser().displayName;
          // this.getUser().valueChanges().subscribe(a => {
          //   this.userName = a.displayName;
          // });
          console.log('Get user: ' + this.getUser().displayName);
        });
    }

  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path);
  }

  getUsers() {
    const path = '/users';
    return this.db.list(path);
  }

  sendMessage(msg: string) {
    const timestamp = this.getTimeStamp();
    const email = this.user.email;
    this.chatMessages = this.getMessages();
    this.chatMessages.push({
      message: msg,
      timeSent: timestamp,
      userName: this.userName,
      email: email });
  }

  // getMessages(): FirebaseListObservable<ChatMessage[]> {
    // query to create our message feed binding
    // console.log(this.db.list('messages'));
    // return this.db.list('messages');
    // return this.db.list('messages', {
    //   query: {
    //     limitToLast: 25,
    //     orderByKey: true
    //   }
    // });
  // }

  getMessages() {
    return this.db.list('messages');
  }

  getTimeStamp() {
    const now = new Date();
    const date = now.getUTCFullYear() + '/' +
                 (now.getUTCMonth() + 1) + '/' +
                 now.getUTCDate();
    const time = now.getUTCHours() + ':' +
                 now.getUTCMinutes() + ':' +
                 now.getUTCSeconds();

    return (date + ' ' + time);
  }
}
