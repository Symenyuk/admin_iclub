import {Injectable} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs/Observable';
import {finalize} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private storageDirPath = '';
  file: File;
  url = '';
  downloadURL: Observable<string>;
  dataUpload: any;


  constructor(private afStorage: AngularFireStorage) {
  }

  // method to upload file at firebase storage
  async uploadFile(path, event) {
    this.file = event.target.files[0];
    if (this.file) {
      this.storageDirPath = path;
      const filePath = `${this.storageDirPath}/${this.file.name}`;    // path at which image will be stored in the firebase storage
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, this.file);    // upload task (await ...)

      task.snapshotChanges().pipe(
        finalize(() => this.downloadURL = fileRef.getDownloadURL())
      ).subscribe(
        result => {
          this.dataUpload = result;
        },
        err => {
          console.log('error', err);
        }
      );
    }
  }
}
