import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFireMessaging} from '@angular/fire/messaging';
// import * as firebase from 'firebase';
import * as firebase from 'firebase/app';
import '@firebase/messaging';

import {BehaviorSubject} from 'rxjs';
import 'rxjs/add/operator/take';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'key=AAAAeoyh_p4:APA91bEhFSZmyLQBuZj3AiHC4CqgI2ItIphfzYXcTwIq0OGG9mwNRBTFwYs7GUz6uM123rKe-u8DY8eNbd3OTyeLJCFaJv1mh7aDstQyAPrrnXpmhKGniJdWk9qBb7IbUodBnsv6gRRt'
  })
};

@Injectable()
export class MessagingService {

  messaging = firebase.messaging();
  currentMessage = new BehaviorSubject(null);

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging,
    private afs: AngularFirestore,
    private http: HttpClient
  ) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    );
  }

  // requestPermission() {
  //   this.angularFireMessaging.requestToken.subscribe(
  //     (token) => {
  //       console.log(token);
  //     },
  //     (err) => {
  //       console.error('Unable to get permission to notify.', err);
  //     }
  //   );
  // }

  sendPushMessage(to: string, title: string, text: string) {
    const url = 'https://fcm.googleapis.com/fcm/send';
    const body = {
      'notification': {
        'title': title,
        'body': text,
      },
      'to': to
    };
    this.http.post(url, body, httpOptions).map(response => {
      return response;
    }).subscribe(data => {
      // console.log('data', data);
    });
  }


  // 1. UPDATE TOKEN
  // private updateToken(token) {
  //   this.afAuth.authState.take(1).subscribe(user => {
  //     if (!user) {
  //       return;
  //     }
  //
  //     const data = {[user.uid]: token};
  //     this.db.object('fcmTokens/').update(data); // TODO
  //     // this.tokenDoc = this.afs.doc(`User/${token.id}`); // TODO
  //     // this.tokenDoc.update(token); // TODO
  //   });
  // }

  // 2. GET PERMISSION
  getPermission() {
    // this.angularFireMessaging.requestPermission.subscribe(
    //   () => {
    //     console.log('Permission granted');
    //   },
    //   (error) => {
    //     console.log('getPermission', error);
    //   }
    // );
    // Notification.requestPermission() // this.messaging.requestPermission
    this.messaging.requestPermission()
      .then(() => {
        // console.log('Notification permission granted.');
        return this.messaging.getToken();
      })
      .then(token => {
        // console.log('get permission-> updateToken TODO -  FCM Token:', token);
        // this.updateToken(token);
      })
      .catch((err) => {
        console.log('Unable to get permission to notify.', err);
      });
  }

  // 3. RECEIVE MESSAGE
  // receiveMessage() {
  //   this.angularFireMessaging.messages.subscribe(
  //     (payload) => {
  //       console.log('new message received. ', payload);
  //       this.currentMessage.next(payload);
  //     });
  // }

  receiveMessage() {
    this.messaging.onMessage((payload) => {
      // console.log('Message received. ', payload);
      this.currentMessage.next(payload);
    });
  }


}
