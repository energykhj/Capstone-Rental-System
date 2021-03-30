import { FormGroup, FormBuilder, FormControlName } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
})
export class EditDialogComponent implements OnInit {
  content: string;

  constructor(
    private fb: FormBuilder,
    private MatDialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.content = data.content;
  }

  ngOnInit(): void {}

  onChange(content: string) {
    this.content = content;
  }

  onSubmit() {
    console.log(this.content);
    this.MatDialogRef.close(this.content);
  }

  onCancel() {
    this.MatDialogRef.close();
  }
}
