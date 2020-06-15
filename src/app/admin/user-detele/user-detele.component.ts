import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {User} from '../../models/User';
import {Region} from '../../models/Region';
import {Subscription} from 'rxjs/Subscription';
import {MatDialog} from '@angular/material/dialog';
import {DialogBodyComponent} from '../../dialog-body/dialog-body.component';

@Component({
  selector: 'app-user-detele',
  templateUrl: './user-detele.component.html',
  styleUrls: ['./user-detele.component.scss']
})
export class UserDeteleComponent implements OnInit, AfterViewInit, OnDestroy {
  users: User[];

  regions: Region[];
  subscriptionUser: Subscription;
  subscriptionRegion: Subscription;
  userEdit: any;

  constructor(
    private db: FirebaseService,
    private matDialog: MatDialog) {
    this.userEdit = {name: null};
  }

  ngOnInit() {
    this.subscriptionUser = this.db.getUser().subscribe(users => {
      this.subscriptionRegion = this.db.getRegion().subscribe(regions => {
        this.regions = regions;
        this.users = users;
        for (let i = 0; i < this.users.length; i++) {
          for (let y = 0; y < this.users[i].regions.length; y++) {
            for (let r = 0; r < this.regions.length; r++) {
              if (this.users[i].regions[y] === this.regions[r].id) {
                this.users[i].regions[y] = this.regions[r].name;
              }
            }
          }
        }
      }, err => console.log('err', err));
    }, err => console.log('err', err));

  }

  ngAfterViewInit() {

  }

  openDialog(user: User): void {
    const dialogRef = this.matDialog.open(DialogBodyComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        user.deleted = true;
        user.deletedAt = new Date();
        this.db.updateUser(user);
      }
    });
  }


  activateUser($event, user) {
    user.deleted = false;
    user.updatedAt = new Date();
    this.db.updateUser(user);
  }

  updateUser(event, user) {
    this.userEdit = user;
  }

  closeUpdate(event, user) {
    this.userEdit = {};
    user.event = false;
  }

  updateDescriptUser(user) {
    this.db.updateUser(user);
  }


  ngOnDestroy() {
    if (this.subscriptionRegion) {
      this.subscriptionRegion.unsubscribe();
    }
    if (this.subscriptionUser) {
      this.subscriptionUser.unsubscribe();
    }
  }

}
