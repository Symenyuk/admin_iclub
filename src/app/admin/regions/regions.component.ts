import {Component, OnInit, OnDestroy} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Region} from '../../models/Region';
import {Chat} from '../../models/Chat';
import {User} from '../../models/User';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {MatDialog} from '@angular/material/dialog';
import {DialogBodyComponent} from '../../dialog-body/dialog-body.component';
import {DialogStatusComponent} from '../../dialog-status/dialog-status.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss']
})
export class RegionsComponent implements OnInit, OnDestroy {
  regions: Region[];
  region: Region = {
    name: '',
    image: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  chats: Chat[];
  chat: Chat = {
    type: 'REGION',
    regionID: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  users: User[];

  file: any;
  isUploading: boolean;
  isUploaded: boolean;
  validForm: boolean;
  uploadPercent: Observable<number>;
  UploadedFileURL: Observable<string>;
  subscriptionRegion: Subscription;
  subscriptionChat: Subscription;
  subscriptionUser: Subscription;
  subscriptionImg: Subscription;
  nameRegionValid: boolean;

  blockAddRegion: boolean;
  updatedRegion: boolean;
  regionForm: FormGroup;
  submitted = false;

  tempUsers: any;
  regionID: any;
  usersThisRegion: any;
  addUserRegion: boolean;

  constructor(
    private db: FirebaseService,
    private storage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog) {
    this.validForm = false;
    this.nameRegionValid = true;
    this.blockAddRegion = false;
    this.updatedRegion = false;
    this.tempUsers = [];
    this.usersThisRegion = [];
  }

  ngOnInit() {
    this.subscriptionRegion = this.db.getRegion().subscribe(data => {
      this.regions = data;
    }, (err) => console.log('err', err));
    this.subscriptionChat = this.db.getChat().subscribe(data => {
      this.chats = data;
    }, (err) => console.log('err', err));
    this.subscriptionUser = this.db.getUser().subscribe(data => {
      this.users = data.filter(item => {
        return item.deleted === false;
      });
    }, (err) => console.log('err', err));


    this.regionForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });
  }

  validNameRegion(event) {
    this.nameRegionValid = true;
    this.subscriptionRegion = this.db.getRegion().subscribe(data => {
      let regions = data.filter(item => {
        return item.name;
      });
      for (let region of regions) {
        if (region.name === event.target.value) {
          this.nameRegionValid = false;
        }
      }
    });
  }

  openDialog(regions: Region): void {
    const dialogRef = this.matDialog.open(DialogBodyComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.db.deleteRegion(regions);
        for (let chat of this.chats) {
          if (regions.id === chat.regionID) {
            this.db.deleteChat(chat);
          }
        }
        for (let user of this.users) {
          this.db.deleteUserField(user, regions.id);
        }
      }
    });
  }

  addRegion() {
    window.scroll(0, 0);
    this.blockAddRegion = true;
    this.updatedRegion = false;
    this.region.name = '';
    this.region.image = '';
    this.region.createdAt = new Date();
    this.region.updatedAt = new Date();
    this.regionID = '';
  }

  uploadFile(event) {
    this.file = event.target.files[0];
    this.isUploading = true;
    this.isUploaded = false;

    if (this.file) {
      const dirPath = '/regions';
      const filePath = `${dirPath}/${this.file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.file);
      this.uploadPercent = task.percentageChanges();

      this.subscriptionImg = task.snapshotChanges().pipe(
        finalize(() => {
          this.UploadedFileURL = fileRef.getDownloadURL();

          this.subscriptionImg = this.UploadedFileURL.subscribe(resp => {
            this.region.image = resp;
            this.isUploading = false;
            this.isUploaded = true;
          }, error => {
            console.error(error);
          });
        })
      ).subscribe();
    }
  }

  deleteImg(downloadUrl) {
    this.storage.storage.ref(this.region.image).delete();
    // this.storage
  }


  addUsers(event, user) {
    // update region
    if (this.updatedRegion === true ) {
      if (event.checked === true) {
        for (let region of user.regions) {
          this.addUserRegion = region !== this.regionID;
        }
        if (this.addUserRegion === true) {
          user.regions.push(this.regionID);
        }
      } else if (event.checked === false) {
        for (let i = 0; i < user.regions.length; i++) {
          if (user.regions[i] === this.regionID) {

            let idx = user.regions.indexOf(this.regionID);
            if (idx !== -1) {
              user.regions.splice(idx, 1);
            }
          }
        }
      }
    }

    // create region
    if (this.updatedRegion === false) {
      if (event.checked === true) {
        this.tempUsers.push(user);
      } else {
        let ind = this.tempUsers.indexOf(user);
        if (ind > -1) {
          this.tempUsers.splice(ind, 1);
        }
      }
    }

  }


  updateRegion(region) {
    window.scroll(0, 0);
    this.blockAddRegion = true;
    this.updatedRegion = true;
    this.regionID = region.id;
    this.region.name = region.name;
    this.region.image = region.image;
    this.region.updatedAt = new Date();
    this.region.createdAt = region.createdAt;
  }


  isChecked(user) {
    return user.regions.indexOf(this.regionID) !== -1;
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
    if (this.regionForm.invalid || this.nameRegionValid === false) {
      return;
    }

    // Update region
    if (this.updatedRegion === true) {
      this.db.updateRegion(this.region, this.regionID);
      this.db.updateUserRegion(this.users);

      if (this.regionForm.status === 'VALID') {
        this.openStatusDialog('update', 'success', 'Region updated');
        this.cancelForm();
      }
    }


    // Create Region
    if (this.updatedRegion !== true) {
      this.db.addRegion(this.region);

      this.subscriptionRegion = this.db.getRegion().subscribe(data => {
        for (let region of data) {
          if (region.name === this.region.name) {
            this.regionID = region.id;
            this.chat.regionID = region.id;
            this.db.addChat(this.chat);
          }
        }
        // add regionId to selected users
        for (let i = 0; i < this.tempUsers.length; i++) {
          this.tempUsers[i].regions.push(this.regionID);
          this.db.updateUser(this.tempUsers[i]);
        }
      });

      if (this.regionForm.status === 'VALID') {
        this.openStatusDialog('create', 'success', 'Region created');
        this.cancelForm();
      }
    }
  }

  cancelForm() {
    this.submitted = false;
    this.blockAddRegion = false;
    this.regionForm.reset();
  }


  ngOnDestroy() {
    if (this.subscriptionRegion) {
      this.subscriptionRegion.unsubscribe();
    }
    if (this.subscriptionChat) {
      this.subscriptionChat.unsubscribe();
    }
    if (this.subscriptionUser) {
      this.subscriptionUser.unsubscribe();
    }
    if (this.subscriptionImg) {
      this.subscriptionImg.unsubscribe();
    }
  }

}
