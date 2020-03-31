import {Component, OnInit, OnDestroy} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Chat} from '../../models/Chat';
import {User} from '../../models/User';
import {Message} from '../../models/Message';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {MessagingService} from '../../services/messaging.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogBodyComponent} from '../../dialog-body/dialog-body.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogStatusComponent} from '../../dialog-status/dialog-status.component';

@Component({
  selector: 'app-create-group-chat',
  templateUrl: './create-group-chat.component.html',
  styleUrls: ['./create-group-chat.component.scss']
})
export class CreateGroupChatComponent implements OnInit, OnDestroy {
  user: User[];
  userIsToken: any;

  listChatUser: {};

  chats: Chat[];
  chat: Chat = {
    name: '',
    image: '',
    type: 'GROUP',
    userIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  messages: Message[];

  file: any;
  isUploading: boolean;
  isUploaded: boolean;

  uploadPercent: Observable<number>;
  UploadedFileURL: Observable<string>;

  tempUserId: any;
  tempUserToken: any;
  subscriptionUser: Subscription;
  subscriptionChat: Subscription;
  subscriptionMessage: Subscription;
  subscriptionImage: Subscription;
  message;
  validForm: boolean;

  blockAddChat: boolean;
  updatedChat: boolean;
  groupChatForm: FormGroup;
  submitted = false;
  updateChatId: any;

  constructor(
    private db: FirebaseService,
    private storage: AngularFireStorage,
    private msgService: MessagingService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog
  ) {
    this.listChatUser = {};
    this.validForm = false;
    this.tempUserId = [];
    this.tempUserToken = [];
    this.blockAddChat = false;
    this.updatedChat = false;
  }

  ngOnInit() {
    this.subscriptionUser = this.db.getUser().subscribe(user => {
      this.user = user.filter(item => {
        return item.deleted === false;
      });
      this.userIsToken = user.filter(item => {
        return item.tokens && item.deleted === false;
      });
    });
    this.subscriptionChat = this.db.getChat().subscribe(data => {
      this.chats = data.filter(item => {
        return item.type === 'GROUP';
      });
    });
    this.subscriptionMessage = this.db.getMessage().subscribe(data => {
      this.message = data;
    });


    this.groupChatForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });

  }

  openDialog(chat: Chat): void {
    const dialogRef = this.matDialog.open(DialogBodyComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.db.deleteChat(chat);
        for (let message of this.message) {
          if (chat.id === message.chatID) {
            this.db.deleteMessage(message);
          }
        }
      }
    });
  }


  addChat() {
    window.scroll(0, 0);
    this.blockAddChat = true;
    this.updatedChat = false;
    this.chat.name = '';
    this.chat.image = '';
    this.chat.createdAt = new Date();
    this.chat.updatedAt = new Date();
    this.chat.userIds = [];
  }

  uploadFile(event) {
    this.file = event.target.files[0];
    this.isUploading = true;
    this.isUploaded = false;

    if (this.file) {
      const dirPath = '/chat';
      const filePath = `${dirPath}/${this.file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.file);
      this.uploadPercent = task.percentageChanges();

      this.subscriptionImage = task.snapshotChanges().pipe(
        finalize(() => {
          this.UploadedFileURL = fileRef.getDownloadURL();

          this.UploadedFileURL.subscribe(resp => {
            this.chat.image = resp;
            this.isUploading = false;
            this.isUploaded = true;
          }, error => {
            console.error(error);
          });

        })
      ).subscribe();
    }
  }

  addUsers(event, item) {
    if (event.checked === true) {
      // console.log(item);
      // this.tempUserId['' + item.id] = true; // *
      this.tempUserId.push(item.id);
      // console.log(this.tempUserId);
      if (item.tokens) {
        for (let token of item.tokens) {
          this.tempUserToken.push(token);
        }
      }
    } else if (event.checked === false) {
      // delete this.tempUserId['' + item.id];
      let ind = this.tempUserId.indexOf(item.id);
      if (ind > -1) {
        this.tempUserId.splice(ind, 1);
      }

      if (item.tokens) {
        for (let token of item.tokens) {
          let index = this.tempUserToken.indexOf(token);
          if (index > -1) {
            this.tempUserToken.splice(index, 1);
          }
        }
      }
    }
  }


  updateChat(chat) {
    window.scroll(0, 0);
    this.blockAddChat = true;
    this.updatedChat = true;

    this.updateChatId = chat.id;
    this.chat.name = chat.name;
    this.chat.image = chat.image;
    this.chat.createdAt = chat.createdAt;
    this.chat.updatedAt = new Date();
    this.chat.userIds = chat.userIds;
    this.tempUserId = chat.userIds;
  }

  isChecked(item) {
    return this.chat.userIds.indexOf(item) !== -1;
    // return ~this.chat.userIds.indexOf(item);
  }

  openStatusDialog(event, status, text): void {
    this.matDialog.open(DialogStatusComponent, {
      width: '350px',
      data: {
        ev: event,
        stat: status,
        txt: text
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.groupChatForm.invalid) {
      return;
    }

    // Update group chat
    if (this.updatedChat === true) {
      this.chat.userIds = this.tempUserId;
      // console.log(this.chat);
      this.db.updateChat(this.chat, this.updateChatId);
      if (this.groupChatForm.status === 'VALID') {
        this.openStatusDialog('update', 'success', 'Group chat updated');
        this.cancelForm();
      }
    }

    if (this.updatedChat !== true) {
      this.chat.userIds = this.tempUserId;
      this.db.addChat(this.chat);

      this.msgService.getPermission();
      this.msgService.receiveMessage();
      this.message = this.msgService.currentMessage;

      for (let token of this.tempUserToken) {
        // console.log(token);
        this.msgService.sendPushMessage(token, 'iClub', 'You were added to chat ' + this.chat.name);
      }

      if (this.groupChatForm.status === 'VALID') {
        this.openStatusDialog('create', 'success', 'Group chat created');
        this.cancelForm();
      }
    }

  }


  cancelForm() {
    this.submitted = false;
    this.blockAddChat = false;
    this.groupChatForm.reset();
  }

  ngOnDestroy() {
    if (this.subscriptionImage) {
      this.subscriptionImage.unsubscribe();
    }
    if (this.subscriptionUser) {
      this.subscriptionUser.unsubscribe();
    }
    if (this.subscriptionChat) {
      this.subscriptionChat.unsubscribe();
    }
    if (this.subscriptionMessage) {
      this.subscriptionMessage.unsubscribe();
    }
  }

}
