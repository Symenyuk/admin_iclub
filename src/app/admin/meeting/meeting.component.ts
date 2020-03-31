import {Component, OnInit, OnDestroy} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Meetup} from '../../models/Meetup';
import {User} from '../../models/User';
import {MessagingService} from '../../services/messaging.service';
import {Subscription} from 'rxjs/Subscription';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {DialogBodyComponent} from '../../dialog-body/dialog-body.component';
import {DialogStatusComponent} from '../../dialog-status/dialog-status.component';
import {Region} from '../../models/Region';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit, OnDestroy {
  user: User[];
  meetups: Meetup[];
  regions: Region[];
  meetup: Meetup = {
    name: '',
    description: '',
    address: '',
    addressUrl: '',
    startDate: '',
    endDate: '',
    regionID: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  meetupStartTime: any;
  meetupEndTime: any;
  message;
  tokens: any;
  subscriptionUser: Subscription;
  subscriptionMeetup: Subscription;
  subscriptionRegion: Subscription;
  userIsToken: any;
  meetingForm: FormGroup;
  submitted = false;
  blockAddMeeting: boolean;
  upadateMeeting: boolean;
  usersTokens: any;
  meetingId: any;

  constructor(
    private db: FirebaseService,
    private msgService: MessagingService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog) {
    this.blockAddMeeting = false;
    this.upadateMeeting = false;
    this.usersTokens = [];
  }

  ngOnInit() {
    this.subscriptionUser = this.db.getUser().subscribe(user => {
      this.userIsToken = user.filter(item => {
        return item.tokens && item.deleted === false;
      });
    });
    this.subscriptionMeetup = this.db.getMeetup().subscribe(data => {
      this.meetups = data;
    });
    this.subscriptionRegion = this.db.getRegion().subscribe(data => {
      this.regions = data;
    });

    this.meetingForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      addressUrl: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
    });

  }

  openDialog(meetup: Meetup): void {
    const dialogRef = this.matDialog.open(DialogBodyComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.db.deleteMeetup(meetup);
      }
    });
  }

  addMeeting() {
    window.scroll(0, 0);
    this.blockAddMeeting = true;
    this.upadateMeeting = false;
  }

  setStartDate(event) {
    this.meetup.startDate = event.value;
    this.meetupStartTime = null;
  }

  setEndDate(event) {
    this.meetup.endDate = event.value;
    this.meetupEndTime = null;
  }

  setStartTime() {
    this.meetup.startDate.setHours(this.meetupStartTime);
  }

  setEndTime() {
    this.meetup.endDate.setHours(this.meetupEndTime);
  }

  regionChange(event) {
    this.meetup.regionID = event.value;
  }


  updateMeetup(event, meetup) {
    window.scroll(0, 0);
    this.upadateMeeting = true;
    this.blockAddMeeting = true;

    this.meetingId = meetup.id;
    this.meetup.createdAt = meetup.createdAt;
    this.meetup.updatedAt = new Date();
    this.meetup.name = meetup.name;
    this.meetup.description = meetup.description;
    this.meetup.address = meetup.address;
    this.meetup.addressUrl = meetup.addressUrl;
    this.meetup.startDate = new Date(meetup.startDate.seconds * 1000);
    this.meetupStartTime = new Date(meetup.startDate.seconds * 1000).getHours();
    this.meetup.endDate = new Date(meetup.endDate.seconds * 1000);
    this.meetupEndTime = new Date(meetup.endDate.seconds * 1000).getHours();
    this.meetup.regionID = meetup.regionID;
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
    if (this.meetingForm.invalid) {
      return;
    }

    // Update meeting
    if (this.upadateMeeting === true) {
      this.db.updateMeetup(this.meetup, this.meetingId);
      if (this.meetingForm.status === 'VALID') {
        this.openStatusDialog('update', 'success', 'Meeting updated');
        this.cancelForm();
      }
    }

    // Create meeting
    // send push-message (all users)
    if (this.upadateMeeting !== true) {
      this.db.addMeetup(this.meetup);

      this.msgService.getPermission();
      this.msgService.receiveMessage();
      this.message = this.msgService.currentMessage;
      for (let user of this.userIsToken) {
        for (let token of user.tokens) {
          this.msgService.sendPushMessage(token, 'iClub', 'Next ' + this.meetup.address + ' event is on ' + this.meetup.startDate);
        }
      }

      if (this.meetingForm.status === 'VALID') {
        this.openStatusDialog('create', 'success', 'Meeting created');
        this.cancelForm();
      }
    }

  }

  cancelForm() {
    this.submitted = false;
    this.blockAddMeeting = false;
    this.meetingForm.reset();
  }


  ngOnDestroy() {
    if (this.subscriptionMeetup) {
      this.subscriptionMeetup.unsubscribe();
    }
    if (this.subscriptionUser) {
      this.subscriptionUser.unsubscribe();
    }
    if (this.subscriptionRegion) {
      this.subscriptionRegion.unsubscribe();
    }
  }
}
