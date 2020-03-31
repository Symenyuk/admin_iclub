import {Injectable} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private storageDirPath = '';
  file: File;
  url = '';
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  dataUpload: any;


  constructor(private afStorage: AngularFireStorage) {
  }

  // handleFiles(path, event) {
    // this.file = event.target.files[0];
    // this.basePath = path;
    // this.uploadFile();
  // }

  // method to upload file at firebase storage
  async uploadFile(path, event) {
    this.file = event.target.files[0];
    if (this.file) {
      this.storageDirPath = path;
      const filePath = `${this.storageDirPath}/${this.file.name}`;    // path at which image will be stored in the firebase storage
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, this.file);    // upload task (await ...)

      // this.uploadPercent = task.percentageChanges();
      // console.log('uploadPercent', this.uploadPercent);


      task.snapshotChanges().pipe(
        finalize(() => this.downloadURL = fileRef.getDownloadURL())
      ).subscribe(
        result => {
          this.dataUpload = result;
        },
        err => {
          console.log('error');
        }
      );
    } else {
      // console.log('Please select an image');
    }
  }
}
