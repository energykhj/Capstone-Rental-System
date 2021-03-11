import { FormGroup, FormBuilder, FormControlName } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-reason',
  templateUrl: './reason.component.html',
  styleUrls: ['./reason.component.scss'],
})
export class ReasonComponent implements OnInit {
  title: string;
  reason: string;

  constructor(
    private fb: FormBuilder,
    private MatDialogRef: MatDialogRef<ReasonComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
  }

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.reason);
    this.MatDialogRef.close(this.reason);
  }

  onCancel() {
    this.MatDialogRef.close();
  }
}
