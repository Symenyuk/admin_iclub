import {Component, OnInit, OnDestroy} from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {AuthService} from '../services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FirebaseUserModel} from '../models/user.model';
import { Router } from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-dashboard',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;
  section: string;
  // userListAdmin: any;
  // chartListAdmin: any;
  // regionListAdmin: any;
  // meetingListAdmin: any;
  //
  // subscriptionUserAdmin: Subscription;
  // subscriptionChatAdmin: Subscription;
  // subscriptionRegionAdmin: Subscription;
  // subscriptionMeetingAdmin: Subscription;

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private fb: FormBuilder
  ) {
    // this.section = 'admin';
  }

  ngOnInit(): void {
    // if (this.subscriptionUserAdmin) {
    //   this.subscriptionUserAdmin.unsubscribe();
    // }
    // if (this.subscriptionChatAdmin) {
    //   this.subscriptionChatAdmin.unsubscribe();
    // }
    // if (this.subscriptionRegionAdmin) {
    //   this.subscriptionRegionAdmin.unsubscribe();
    // }
    // if (this.subscriptionMeetingAdmin) {
    //   this.subscriptionMeetingAdmin.unsubscribe();
    // }


    this.route.data.subscribe(routeData => {
      const data = routeData['data'];
      if (data) {
        this.user = data;
        this.createForm(this.user.name);
      }
    });

    // this.subscriptionUserAdmin = this.firebaseService.getUser().subscribe(data => {
    //   this.userListAdmin = data;
    // });
    // this.subscriptionChatAdmin = this.firebaseService.getChat().subscribe(data => {
    //   this.chartListAdmin = data;
    // });
    // this.subscriptionRegionAdmin = this.firebaseService.getRegion().subscribe(data => {
    //   this.regionListAdmin = data;
    // });
    // this.subscriptionMeetingAdmin = this.firebaseService.getMeetup().subscribe(data => {
    //   this.meetingListAdmin = data;
    // });

    const arr = this.router.url.split('/');
    this.section = arr[2];

    if (this.section === undefined) {
      this.section = 'admin';
    }
  }


  createForm(name) {
    this.profileForm = this.fb.group({
      name: [name, Validators.required]
    });
  }

  save(value) {
    this.firebaseService.updateCurrentUser(value)
      .then(res => {
        // console.log(res);
      }, err => console.log(err));
  }

  logout() {
    this.authService.doLogout()
      .then((res) => {
        this.router.navigate(['/']);
        // this.location.back();
      }, (error) => {
        console.log('Logout error', error);
      });
  }

  setSection(section) {
    this.section = section;
  }


  ngOnDestroy() {
    // if (this.subscriptionUserAdmin) {
    //   this.subscriptionUserAdmin.unsubscribe();
    // }
    // if (this.subscriptionChatAdmin) {
    //   this.subscriptionChatAdmin.unsubscribe();
    // }
    // if (this.subscriptionRegionAdmin) {
    //   this.subscriptionRegionAdmin.unsubscribe();
    // }
    // if (this.subscriptionMeetingAdmin) {
    //   this.subscriptionMeetingAdmin.unsubscribe();
    // }
  }

}
