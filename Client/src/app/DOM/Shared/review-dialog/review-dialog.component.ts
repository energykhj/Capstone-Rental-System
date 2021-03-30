import { FormGroup, FormBuilder, FormControlName } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.scss'],
})
export class ReviewDialogComponent implements OnInit {
  title: string;
  itemName: string;
  itemRate: number;
  reviewTitle: string;
  review: string;

  canDelete: boolean = false;

  constructor(
    private fb: FormBuilder,
    private MatDialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.itemName = data.itemName;
    this.itemRate = data.itemRate;
    this.reviewTitle = data.reviewTitle;
    this.review = data.review;
    this.canDelete = data.canDelete;
  }

  ngOnInit(): void {}

  onSubmit() {
    this.MatDialogRef.close({
      itemRate: this.itemRate,
      reviewTitle: this.reviewTitle,
      review: this.review,
      isDelete: false,
    });
  }

  onDelete() {
    this.MatDialogRef.close({
      isDelete: true,
    });
  }

  onCancel() {
    this.MatDialogRef.close();
  }
}
