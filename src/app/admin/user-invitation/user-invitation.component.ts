import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Email} from '../../models/email';
import {SendMailServiceService} from '../../services/send-mail-service.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DialogStatusComponent} from '../../dialog-status/dialog-status.component';
import {MatDialog} from '@angular/material/dialog';
import {Referral} from '../../models/Referral';
import {Region} from '../../models/Region';
import {FirebaseService} from '../../services/firebase.service';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-user-invitation',
  templateUrl: './user-invitation.component.html',
  styleUrls: ['./user-invitation.component.scss']
})
export class UserInvitationComponent implements OnInit, OnDestroy {
  subscriptionMail: Subscription;
  subscriptionRegion: Subscription;
  subscriptionReferral: Subscription;
  subscriptionGetLatReferral: Subscription;

  email: Email = {
    to: '',
    subject: '',
    body: ''
  };
  referral: Referral = {
    createdAt: '',
    updatedAt: new Date(),
    regionIds: ''
  };
  regions: Region[];
  public refId: any;

  emailForm: FormGroup;
  submitted = false;
  tempRegion: any;

  constructor(
    private db: FirebaseService,
    private sendMail: SendMailServiceService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog) {
    this.tempRegion = [];
    this.refId = '';
  }

  ngOnInit() {
    this.subscriptionGetLatReferral = this.subscriptionRegion = this.db.getRegion().subscribe(data => {
      this.regions = data;
    }, (err) => console.log('err', err));
    this.emailForm = this.formBuilder.group({
      to: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      body: ['', Validators.required],
    });
  }


  pushRegionList(event, item) {
    if (event.checked === true) {
      this.tempRegion.push(item.id);
    } else if (event.checked === false) {
      let index = this.tempRegion.indexOf(item.id);
      if (index > -1) {
        this.tempRegion.splice(index, 1);
      }
    }
  }

  formDeeplink() {
    if (this.tempRegion.length > 0) {
      this.referral.createdAt = new Date();
      this.referral.regionIds = this.tempRegion;
      this.db.addReferral(this.referral);

      this.subscriptionGetLatReferral = this.db.getLastReferral()
        .map(resp => {
          this.refId = resp[0].id;
          this.email.body = this.refId;
        }).subscribe(() => {
          this.subscriptionGetLatReferral.unsubscribe();
        });
    }
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
    if (this.emailForm.invalid && this.refId) {
      return;
    }

    this.subscriptionMail = this.sendMail.sendEmail(this.email.to, this.email.subject, this.email.body).subscribe(data => {
      if (this.emailForm.status === 'VALID') {
        this.openStatusDialog('email', 'success', 'Email successfully sent'); // Email successfully sent
      }
    }, err => {
      this.openStatusDialog('email', 'error', 'Email not sent'); // Email successfully sent
    });
  }

  ngOnDestroy() {
    if (this.subscriptionGetLatReferral) {
      this.subscriptionGetLatReferral.unsubscribe();
    }
    if (this.subscriptionMail) {
      this.subscriptionMail.unsubscribe();
    }
    if (this.subscriptionRegion) {
      this.subscriptionRegion.unsubscribe();
    }
    if (this.subscriptionReferral) {
      this.subscriptionReferral.unsubscribe();
    }
  }

}
