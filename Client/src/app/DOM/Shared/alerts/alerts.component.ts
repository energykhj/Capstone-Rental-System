import { Component, SecurityContext, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html'
})

export class AlertsComponent {
  isOpen = true;

  //type: success, info, warning, danger
  constructor(
    public dialogRef: MatDialogRef<AlertsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: string, msg: string }) { }
}
