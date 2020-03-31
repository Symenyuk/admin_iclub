import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import 'rxjs/add/operator/map';

// models
import {Chat} from '../models/Chat';
import {User} from '../models/User';
import {Meetup} from '../models/Meetup';
import {Region} from '../models/Region';
import {Referral} from '../models/Referral';
import {Message} from '../models/Message';
import {AngularFireDatabase, AngularFireObject} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  chatCollection: AngularFirestoreCollection<Chat>;
  userCollection: AngularFirestoreCollection<User>;
  meetupCollection: AngularFirestoreCollection<Meetup>;
  regionCollection: AngularFirestoreCollection<Region>;
  referralCollection: AngularFirestoreCollection<Referral>;
  referralCollectionLast: AngularFirestoreCollection<Referral>;
  messageCollection: AngularFirestoreCollection<Message>;

  chats: Observable<Chat[]>;
  users: Observable<User[]>;
  meetups: Observable<Meetup[]>;
  regions: Observable<Region[]>;
  referrals: Observable<Referral[]>;
  referralsLast: Observable<Referral[]>;
  messages: Observable<Message[]>;

  chatDoc: AngularFirestoreDocument<Chat>;
  userDoc: AngularFirestoreDocument<User>;
  meetupDoc: AngularFirestoreDocument<Meetup>;
  regionDoc: AngularFirestoreDocument<Region>;
  referralDoc: AngularFirestoreDocument<Referral>;
  messageDoc: AngularFirestoreDocument<Message>;

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      const user = firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  constructor(public afs: AngularFirestore) {
    this.chatCollection = this.afs.collection('Chat', ref => ref);
    this.userCollection = this.afs.collection('User', ref => ref);
    this.meetupCollection = this.afs.collection('Meetup', ref => ref);
    this.regionCollection = this.afs.collection('Region', ref => ref);
    this.referralCollection = this.afs.collection('Referral', ref => ref);
    this.messageCollection = this.afs.collection('Message', ref => ref);

    this.referralCollectionLast = this.afs.collection('Referral', ref => ref.orderBy('createdAt').limitToLast(1));
    // this.referralCollectionId = this.afs.collection('Referral').doc().valueChanges();
    // getObjectById(id) {
    //   return this.afs.collection('collectionName').doc(id).valueChanges()
    // }

    // examples
    // this items = this.db.collection('items').snapshotChanges()
    //   .pipe(
    //     // custom RxJS Operator
    //     this.perf.trace('itemQuery')
    //   );

    // examples ID FIELD
    // getItems() {
    //   const ref = this.db.collection('items');
    //   return ref.valueChanges({ idField: 'id' });
    // }

    // examples collection group queries
    // groupItems() {
    //   conts query = this.db.collectionGroup('items',
    //     (ref) => reg.where('foo', '>', 'bar')
    //     );
    // }


    this.users = this.userCollection.snapshotChanges().map(changes => { // *
      return changes.map(a => {
        const data = a.payload.doc.data() as User;
        data.id = a.payload.doc.id;
        return data;
      });
    });

    this.chats = this.chatCollection.snapshotChanges().map(changes => { // *
      return changes.map(a => {
        const data = a.payload.doc.data() as Chat;
        data.id = a.payload.doc.id;
        return data;
      });
    });

    // this.meetups = this.meetupCollection.snapshotChanges().pipe(
    //   map(actions => actions.map(a => {
    //     const data = a.payload.doc.data() as Meetup;
    //     const id = a.payload.doc.id;
    //     return {id, data};
    //   }))
    // );
    this.meetups = this.meetupCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Meetup;
        data.id = a.payload.doc.id;
        return data;
      });
    });


    this.regions = this.regionCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Region;
        data.id = a.payload.doc.id;
        return data;
      });
    });

    this.referrals = this.referralCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Referral;
        data.id = a.payload.doc.id;
        return data;
      });
    });
    this.referralsLast = this.referralCollectionLast.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Referral;
        data.id = a.payload.doc.id;
        return data;
      });
    });
    this.messages = this.messageCollection.snapshotChanges().map(changes => { // *
      return changes.map(a => {
        const data = a.payload.doc.data() as Message;
        data.id = a.payload.doc.id;
        return data;
      });
    });
  }

  updateCurrentUser(value) {
    return new Promise<any>((resolve, reject) => {
      const user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: value.name,
        photoURL: user.photoURL
      }).then(res => {
        resolve(res);
      }, err => reject(err));
    });
  }

  // ================ CHAT ================
  getChat() {
    return this.chats;
  }

  addChat(chat: Chat) {
    this.chatCollection.add(chat).then(() => {
      // console.log('Success');
    }).catch(err => {
      console.log('error');
    });
  }

  updateChat(chat: Chat, chatId) {
    // console.log(chatId);
    // this.chatDoc = this.afs.doc(`Chat/${chat}${chatId}`);
    // this.chatDoc.update(chat);
    // let temp = this.afs.collection('Chat').doc(chatId);
    this.chatCollection.doc(chatId).update(chat);
  }

  deleteChat(chat: Chat) {
    this.chatDoc = this.afs.doc(`Chat/${chat.id}`);
    this.chatDoc.delete();
  }

  // ================ USER ================
  getUser() {
    return this.users;
  }

  addUser(user: User) {
    this.userCollection.add(user).then(() => {
      // console.log('Success');
    }).catch(err => {
      console.log('error');
    });
  }

  deleteUser(user: User) {
    this.userDoc = this.afs.doc(`User/${user.id}`);
    this.userDoc.delete().then(() => {
      // console.log('Document successfully deleted!');
    }).catch((error) => {
      console.error('Error removing document: ', error);
    });
  }

  deleteUserField(user: User, idRegionDelete) {
    this.userDoc = this.afs.doc(`User/${user.id}`);
    let regions = user.regions;
    for (let i = 0; i < regions.length; i++) {

      if (idRegionDelete === regions[i]) {
        let index = regions.indexOf(regions[i]);
        if (index > -1) {
          regions.splice(index, 1);
        }

        this.userDoc.update({
          regions
        }).then(() => {
          // console.log('success');
        }).catch(err => {
          console.log('err', err);
        });

      }
    }
  }


  updateUser(user: User) {
    this.userDoc = this.afs.doc(`User/${user.id}`);
    this.userDoc.update(user);
  }

  updateUserDescription(user: User) {
    let descript = user.description;
    this.userCollection
      .doc()
      .update({descript});
  }
  updateUserRegion(users) {
    for (let i = 0; i < users.length; i++) {
      let regions = users[i].regions;
      this.userCollection
        .doc(users[i].id)
        .update({regions});
    }
  }


  // ================ MEETING ================
  getMeetup() {
    return this.meetups;
  }

  addMeetup(meetup: Meetup) {
    this.meetupCollection.add(meetup).then(() => {
      // console.log('Success');
    }).catch(err => {
      console.log('error');
    });
  }

  updateMeetup(meetup: Meetup, meetupId) {
    // this.meetupDoc = this.afs.doc(`Meetup/${meetup.id}`);
    // this.meetupDoc.update(meetup);
    this.meetupCollection.doc(meetupId).update(meetup);
  }

  deleteMeetup(meetup: Meetup) {
    this.meetupDoc = this.afs.doc(`Meetup/${meetup.id}`);
    this.meetupDoc.delete();
  }

  // ================ REGION ================
  getRegion() {
    return this.regions;
  }

  addRegion(region: Region) {
    this.regionCollection.add(region).then(() => {
      // console.log('Success');
    }).catch(err => {
      console.log('error');
    });
  }

  updateRegion(region: Region, regionId) {
    // this.regionDoc = this.afs.doc(`Region/${region.id}`);
    // this.regionDoc.update(region);
    this.regionCollection
      .doc(regionId)
      .update(region);
  }

  deleteRegion(region: Region) {
    this.regionDoc = this.afs.doc(`Region/${region.id}`);
    this.regionDoc.delete();
  }


  // ================ REFERRAL  ================
  getReferral() {
    return this.referrals;
  }

  getLastReferral() {
    return this.referralsLast;
  }

  addReferral(referral: Referral) {
    this.referralCollection.add(referral).then(() => {
      // console.log('Success');
    }).catch(err => {
      console.log('error');
    });
  }

  deleteReferral(referral: Referral) {
    this.referralDoc = this.afs.doc(`Referral/${referral.id}`);
    this.referralDoc.delete();
  }

  // ================ MESSAGE ================
  getMessage() {
    return this.messages;
  }

  addMessage(message: Message) {
    this.messageCollection.add(message).then(() => {
      // console.log('Success');
    }).catch(err => {
      console.log('error');
    });
  }

  deleteMessage(message: Message) {
    this.messageDoc = this.afs.doc(`Message/${message.id}`);
    this.messageDoc.delete();
  }


}
