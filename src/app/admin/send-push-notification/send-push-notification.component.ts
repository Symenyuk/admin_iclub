import {Component, OnInit, OnDestroy} from '@angular/core';
import {MessagingService} from '../../services/messaging.service';
import {FirebaseService} from '../../services/firebase.service';
import {Subscription} from 'rxjs/Subscription';
import {User} from '../../models/User';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DialogStatusComponent} from '../../dialog-status/dialog-status.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-send-push-notification',
  templateUrl: './send-push-notification.component.html',
  styleUrls: ['./send-push-notification.component.scss']
})
export class SendPushNotificationComponent implements OnInit, OnDestroy {
  message;
  name: string;
  tokens: any;
  push = {
    name: '',
    description: ''
  };
  subscriptionUser: Subscription;
  users: User[];
  tempUsers: any;

  pushForm: FormGroup;
  submitted = false;
  allSelected: boolean;
  indeterminate: boolean;

  constructor(
    private msgService: MessagingService,
    private firebaseService: FirebaseService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog
  ) {
    this.tempUsers = [];
    this.allSelected = false;
    this.indeterminate = false;
  }

  ngOnInit() {
    this.subscriptionUser = this.firebaseService.getUser().subscribe(user => {
      this.users = user.filter(item => {
        return item.tokens && item.deleted === false;
      });
    });

    this.pushForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
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


  toggleSelectAll(event) {
    this.allSelected = event.checked;
    this.tempUsers = [];
  }


  pushUserList(event, item) {
    if (event.checked === true) {
      for (let token of item.tokens) {
        this.tempUsers.push(token);
      }
    } else if (event.checked === false) {
      for (let token of item.tokens) {
        let index = this.tempUsers.indexOf(token);
        if (index > -1) {
          this.tempUsers.splice(index, 1);
        }
      }
    }
  }



  onSubmit() {
    this.submitted = true;
    if (this.pushForm.invalid) {
      return;
    }

    this.msgService.getPermission();
    this.msgService.receiveMessage();
    this.message = this.msgService.currentMessage;
    if (this.allSelected === true) {
      for (let item of this.users) {
        for (let token of item.tokens) {
          this.msgService.sendPushMessage(token, this.push.name, this.push.description);
        }
      }
    } else {
      for (let selectToken of this.tempUsers) {
        this.msgService.sendPushMessage(selectToken, this.push.name, this.push.description);
      }
    }

    if (this.pushForm.status === 'VALID') {
      this.openStatusDialog('push', 'success', 'Push message successfully sent');
    }

  }


  ngOnDestroy() {
    if (this.subscriptionUser) {
      this.subscriptionUser.unsubscribe();
    }
  }

}
