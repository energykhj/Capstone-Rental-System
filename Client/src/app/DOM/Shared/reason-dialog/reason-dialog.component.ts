import { FormGroup, FormBuilder, FormControlName } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-reason-dialog',
  templateUrl: './reason-dialog.component.html',
  styleUrls: ['./reason-dialog.component.scss'],
})
export class ReasonDialogComponent implements OnInit {
  title: string;
  reason: string;
  refundDeposit: number;
  isRefund: boolean;

  constructor(
    private fb: FormBuilder,
    private MatDialogRef: MatDialogRef<ReasonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    if (data.isRefund) {
      this.isRefund = data.isRefund;
      this.refundDeposit = data.deposit;
    } else {
      this.isRefund = false;
    }
  }

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.reason);
    if (this.isRefund) {
      this.MatDialogRef.close({ refundDeposit: this.refundDeposit, reason: this.reason });
    } else {
      this.MatDialogRef.close(this.reason);
    }
  }

  onCancel() {
    this.MatDialogRef.close();
  }
}
