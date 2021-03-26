import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/Services/shared.service';
import { ConfirmDialogComponent } from 'src/app/DOM/Shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
})
export class NotificationListComponent implements OnInit {
  userId = '';
  notifications: any = [];

  constructor(private service: SharedService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.userId = this.service.isLoginUser;
    this.userId = this.userId.replace(/['"]+/g, '');
    this.loadNotification();
  }

  loadNotification() {
    var startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    var startDateStr = startDate.toUTCString();
    this.service.getNotification(this.userId, startDateStr).subscribe((notifications: any) => {
      var filterdNotification = notifications.filter((el) => {
        return el.toUserId == this.userId;
      });
      this.notifications = filterdNotification;
      // Set Noti count badge
      this.service.sendNotificationCount(this.notifications.length);
    });
  }

  onCheck(noti: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Notification Message',
        message: `${noti.type} ${noti.itemTitle} from ${noti.fromUserName} `,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.updateNotificationStatus(noti.id).subscribe((data: any) => {
          console.log(data);
          this.ngOnInit();
        });
      }
    });
  }
}
