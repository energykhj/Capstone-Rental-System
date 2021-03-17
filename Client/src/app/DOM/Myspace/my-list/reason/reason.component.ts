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
  refundDeposit: number;
  isRefund: boolean;

  constructor(
    private fb: FormBuilder,
    private MatDialogRef: MatDialogRef<ReasonComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    if (data.isRefund) {
      this.isRefund = data.isRefund;
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
