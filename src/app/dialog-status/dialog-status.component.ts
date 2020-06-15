import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-status',
  templateUrl: './dialog-status.component.html',
  styleUrls: ['./dialog-status.component.scss']
})
export class DialogStatusComponent {

  constructor(public dialogRef: MatDialogRef<DialogStatusComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  close() {
    this.dialogRef.close();
  }

}
