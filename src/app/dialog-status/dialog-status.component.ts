import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-status',
  templateUrl: './dialog-status.component.html',
  styleUrls: ['./dialog-status.component.scss']
})
export class DialogStatusComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogStatusComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    // console.log(this.data);
  }

  close() {
    this.dialogRef.close();
  }

}
