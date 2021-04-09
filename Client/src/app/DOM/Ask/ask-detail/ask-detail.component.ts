import { Article } from './../ask.component';
//import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from './../../../Services/shared.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormatUtils } from 'src/app/Helpers/format-utils';
import { Location } from '@angular/common';
import { UserDetailsViewComponent } from 'src/app/DOM/Account/user-details-view/user-details-view.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/DOM/Shared/confirm-dialog/confirm-dialog.component';
import { EditDialogComponent } from '../../Shared/edit-dialog/edit-dialog.component';
import { NotificationTypeEnum } from 'src/app/Helpers/enum';

@Component({
  selector: 'app-ask-detail',
  templateUrl: './ask-detail.component.html',
  styleUrls: ['./ask-detail.component.scss'],
})
export class AskDetailComponent implements OnInit {
  //dataSource: MatTableDataSource<Article>;
  panelOpenState = true;

  content: string;

  userId = '';
  rowId: any;
  path: any;
  url: any;
  name: any;
  title: any;
  headContent: string;
  articles: any = [];
  filePath = environment.PhotoFileUrl;
  formatDate = FormatUtils.formatDate;

  askReplyPkg: any = {
    date: new Date(),
    title: '',
    description: '',
    userId: '',
    parentId: 0,
  };

  askReplyEditPkg: any = {
    id: 0,
    date: new Date(),
    title: '',
    description: '',
    userId: '',
    parentId: 0,
  };

  notification: any = {
    id: 0,
    fromUserId: '',
    toUserId: '',
    itemId: 0,
    notiType: NotificationTypeEnum.AskReply,
    message: '',
    sendDate: new Date(),
    isRead: false,
  };

  constructor(
    private route: ActivatedRoute,
    private service: SharedService,
    private location: Location,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userId = this.service.isLoginUser;
    this.userId = this.userId.replace(/['"]+/g, '');
    if (this.rowId === undefined) this.rowId = Number(this.route.snapshot.queryParamMap.get('rowId'));
    this.loadInitAskDetail();
    //this.content = 'Test Content'; // Ask content test
  }

  loadInitAskDetail() {
    this.service.getArticleWithReply(this.rowId).subscribe((data: any) => {
      console.log(data);
      this.articles = data;
      this.content = '';
      for (let el of data) {
        if (el.id === this.rowId) {
          this.title = el.title;
          this.headContent = el.description;
        }
      }
    });
  }

  requestAskReply() {
    this.askReplyPkg.userId = this.userId;
    this.askReplyPkg.parentId = this.rowId;
    this.askReplyPkg.title = this.title;
    this.askReplyPkg.description = this.content;
    console.log(this.askReplyPkg);
    this.service.insertReply(this.askReplyPkg).subscribe((data: any) => {
      this.sendNotification();
      this.ngOnInit();
    });
  }

  sendNotification() {
    //Send Notification
    this.notification.fromUserId = this.userId;
    this.notification.itemId = 76; // dummy itemId
    this.notification.toUserId = this.articles[0].userId; //parent userId
    this.notification.message = this.askReplyPkg.title;
    this.service.insertNotification(this.notification).subscribe((data: any) => {
      //console.log(data);
    });
  }

  onBack() {
    this.location.back();
  }

  onChange(content: string) {
    this.content = content;
  }

  onDelete(id: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm deletion',
        message: 'Want to delete the reply?<br/> Click Yes, The reply will be deleted',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.deleteReply(id).subscribe((data: any) => {
          this.ngOnInit();
        });
      }
    });
  }

  onEdit(id: number, content: string, title: string) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      height: '450px',
      width: '800px',
      data: {
        content: content,
      },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        this.askReplyEditPkg.id = id;
        this.askReplyEditPkg.userId = this.userId;
        this.askReplyEditPkg.description = data;
        this.askReplyEditPkg.title = title;
        this.askReplyEditPkg.parentId = this.rowId;

        console.log(this.askReplyEditPkg);
        this.service.updateReply(this.askReplyEditPkg).subscribe((data: any) => {
          this.service.alert('success', 'The content is changed.');
          this.ngOnInit();
        });
      }
    });
  }

  openBorrowerDetails(id: any) {
    const dialogRef = this.dialog.open(UserDetailsViewComponent, {
      width: '300px',
      data: {
        dataKey: id,
        isLender: false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
