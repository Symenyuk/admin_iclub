import {Component, OnInit, OnDestroy} from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {Subscription} from 'rxjs/Subscription';
import {Referral} from '../models/Referral';
import {User} from '../models/User';
import {Router, ActivatedRoute} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit, OnDestroy {
  deviceInfo = null;
  isMobile = null;
  isTablet = null;
  isDesktopDevice = null;
  referrals: Referral[];
  users: User[];
  subscriptionReferral: Subscription;
  subscriptionUser: Subscription;
  id: any;
  exist: string;
  noExist: boolean;
  loader: boolean;
  playMarket: string;
  appStore: string;
  registLink: string;
  sanitizedUrl;

  constructor(
    private db: FirebaseService,
    private router: Router,
    private route: ActivatedRoute, private deviceService: DeviceDetectorService, private sanitizer: DomSanitizer) {
    this.epicFunction();
    this.exist = 'load';
    this.noExist = false;
    this.loader = true;
    this.playMarket = '#';
    this.appStore = 'https://apps.apple.com/us/app/iclub/id1492796007?ls=1';

  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();
    if ((this.isMobile === true || this.isTablet === true) && this.deviceInfo.os === 'Android') {
      // TODO
    }
    if ((this.isMobile === true || this.isTablet === true) && this.deviceInfo.os === 'iOS') {
      // window.location.href = 'https://apps.apple.com/us/app/iclub/id1492796007?ls=1';
      // window.location.href = this.registLink;
    }
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.registLink = 'appiclub://invite?ref=' + this.id;
    window.location.href = this.registLink;
    if (this.subscriptionReferral) {
      this.subscriptionReferral.unsubscribe();
    }
    this.subscriptionUser = this.db.getUser().subscribe(users => {
      this.users = users;
    });
    this.subscriptionReferral = this.db.getReferral().subscribe(data => {
        this.referrals = data;
        for (let ref = 0; ref < this.referrals.length; ref++) {
          if (this.referrals[ref].id === this.id) {
            this.exist = 'success';
            this.loader = false;
          } else {
            this.noExist = true;
            this.loader = false;
          }
        }
      },
      err => console.log('err', err)
    );
  }

  getRegistLink(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.registLink);
  }

  goToAppStore() {
    window.location.href = 'https://apps.apple.com/us/app/iclub/id1492796007?ls=1';
  }

  ngOnDestroy() {
    if (this.subscriptionReferral) {
      this.subscriptionReferral.unsubscribe();
    }
  }

}
