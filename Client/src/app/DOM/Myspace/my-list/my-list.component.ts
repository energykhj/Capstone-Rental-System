import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/Services/shared.service';
import { environment } from 'src/environments/environment';
import { UserDetailsViewComponent } from 'src/app/DOM/Account/user-details-view/user-details-view.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TransactionStatusEnum } from 'src/app/Helpers/enum';
import { ReasonComponent } from './reason/reason.component';
import { FormatUtils } from 'src/app/Helpers/format-utils';
import { ConfirmDialogComponent } from 'src/app/DOM/Shared/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss'],
})
export class MyListComponent implements OnInit {
  active = 1;
  userId = '';
  showMore: boolean;
  filePath = environment.PhotoFileUrl;
  NameFilter1: string = '';
  NameFilter2: string = '';
  NameFilter3: string = '';
  NameFilter4: string = '';
  NameFilter5: string = '';
  DescFilter: string = '';
  page1 = 1;
  page2 = 1;
  page3 = 1;
  page4 = 1;
  page5 = 1;
  notEmptyPost1 = true;
  notScrolly1 = true;
  notEmptyPost2 = true;
  notScrolly2 = true;
  notEmptyPost3 = true;
  notScrolly3 = true;
  notEmptyPost4 = true;
  notScrolly4 = true;
  notEmptyPost5 = true;
  notScrolly5 = true;
  NameListWithoutFilter1: any = [];
  NameListWithoutFilter2: any = [];
  NameListWithoutFilter3: any = [];
  NameListWithoutFilter4: any = [];
  NameListWithoutFilter5: any = [];
  userItems: any = [];
  requestItems: any = [];
  processingItems: any = [];
  returnItems: any = [];
  completedItems: any = [];
  noti: any = [];
  requestStatus: any = [TransactionStatusEnum.Request];
  processingStatus: any = [TransactionStatusEnum.Confirmed];
  returnStatus: any = [TransactionStatusEnum.RequestReturn];
  completedStatus: any = [
    TransactionStatusEnum.Rejected,
    TransactionStatusEnum.CanceledByBorrower,
    TransactionStatusEnum.CanceledByLender,
    TransactionStatusEnum.ReturnComplete,
  ];

  transDetailPkg: any = {
    id: 0,
    transactionId: 0,
    statusId: 0,
    statusName: '',
    reason: '',
    date: new Date(),
  };

  currentDate: Date = new Date();

  formatDate = FormatUtils.formatDate;
  formatCurrency = FormatUtils.formatCurrency;
  dateDiffInDays = FormatUtils.dateDiffInDays;

  constructor(private service: SharedService, public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.userId = this.service.isLoginUser;
    this.userId = this.userId.replace(/['"]+/g, '');

    this.loadUserItem();
  }

  loadUserItem() {
    this.service.getUserItem(this.page1, this.userId).subscribe((userItem: any) => {
      this.userItems = userItem;
      if (userItem.length < 8) {
        this.notEmptyPost1 = false;
      }
      this.showMore = false;
      this.userItems.forEach((userItem) => {
        userItem.item.defaultImageFile = userItem.item.defaultImageFile
          ? userItem.item.defaultImageFile
          : 'noImage.png';
      });
      this.NameListWithoutFilter1 = userItem;
    });

    this.service.GetItemByStatus(this.userId, this.requestStatus).subscribe((requestItem: any) => {
      this.requestItems = requestItem;
      console.log(requestItem);
      if (requestItem.length < 8) {
        this.notEmptyPost2 = false;
      }
      this.showMore = false;
      this.requestItems.forEach((requestItem) => {
        requestItem.item.defaultImageFile = requestItem.item.defaultImageFile
          ? requestItem.item.defaultImageFile
          : 'noImage.png';
      });

      this.NameListWithoutFilter2 = requestItem;
    });

    this.service.GetItemByStatus(this.userId, this.processingStatus).subscribe((processingItem: any) => {
      this.processingItems = processingItem;
      if (processingItem.length < 8) {
        this.notEmptyPost3 = false;
      }
      this.showMore = false;
      this.processingItems.forEach((processingItem) => {
        processingItem.item.defaultImageFile = processingItem.item.defaultImageFile
          ? processingItem.item.defaultImageFile
          : 'noImage.png';
      });
      this.NameListWithoutFilter3 = processingItem;
    });

    this.service.GetItemByStatus(this.userId, this.returnStatus).subscribe((returnItem: any) => {
      this.returnItems = returnItem;
      if (returnItem.length < 8) {
        this.notEmptyPost4 = false;
      }
      this.showMore = false;
      this.returnItems.forEach((returnItem) => {
        returnItem.item.defaultImageFile = returnItem.item.defaultImageFile
          ? returnItem.item.defaultImageFile
          : 'noImage.png';
      });
      this.NameListWithoutFilter4 = returnItem;
    });

    this.service.GetItemByStatus(this.userId, this.completedStatus).subscribe((completedItem: any) => {
      this.completedItems = completedItem;
      if (completedItem.length < 8) {
        this.notEmptyPost5 = false;
      }
      this.showMore = false;
      this.completedItems.forEach((completedItem) => {
        completedItem.item.defaultImageFile = completedItem.item.defaultImageFile
          ? completedItem.item.defaultImageFile
          : 'noImage.png';
      });
      this.NameListWithoutFilter5 = completedItem;
    });

    var startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    var startDateStr = startDate.toUTCString();
    this.service.getNotification(this.userId, startDateStr).subscribe((notifications: any) => {
      var filterdNotification = notifications.filter((el) => {
        return el.toUserId == this.userId;
      });
      this.noti = filterdNotification;
    });
  }

  onClick1() {
    this.page1 = this.page1 + 1;
    this.service.getUserItem(this.page1, this.userId).subscribe((userItem) => {
      const newList = userItem;

      if (newList.length < 8) {
        this.notEmptyPost1 = false;
      }

      this.userItems = this.userItems.concat(newList);
      this.notScrolly1 = true;
    });
  }

  onClick2() {
    this.page2 = this.page2 + 1;
    this.service.GetItemByStatus(this.userId, this.requestStatus).subscribe((requestItem) => {
      const requestList = requestItem;

      if (requestList.length < 8) {
        this.notEmptyPost2 = false;
      }

      this.requestItems = this.userItems.concat(requestList);
      this.notScrolly2 = true;
    });
  }

  onClick3() {
    this.page3 = this.page3 + 1;
    this.service.GetItemByStatus(this.userId, this.processingStatus).subscribe((processingItem) => {
      const processingList = processingItem;

      if (processingList.length < 8) {
        this.notEmptyPost3 = false;
      }

      this.processingItems = this.userItems.concat(processingList);
      this.notScrolly3 = true;
    });
  }

  onClick4() {
    this.page4 = this.page4 + 1;
    this.service.GetItemByStatus(this.userId, this.returnStatus).subscribe((returnItem) => {
      const returnList = returnItem;

      if (returnList.length < 8) {
        this.notEmptyPost4 = false;
      }

      this.returnItems = this.returnItems.concat(returnList);
      this.notScrolly4 = true;
    });
  }

  onClick5() {
    this.page5 = this.page5 + 1;
    this.service.GetItemByStatus(this.userId, this.completedStatus).subscribe((completedItem) => {
      const completedList = completedItem;

      if (completedList.length < 8) {
        this.notEmptyPost5 = false;
      }

      this.completedItems = this.completedItems.concat(completedList);
      this.notScrolly5 = true;
    });
  }

  trimString(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  FilterFn1() {
    var itemNameFilter = this.NameFilter1;
    var itemDescFilter = this.DescFilter;

    this.userItems = this.NameListWithoutFilter1.filter(function (el: any) {
      return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }

  FilterFn2() {
    var itemNameFilter = this.NameFilter2;
    var itemDescFilter = this.DescFilter;

    this.requestItems = this.NameListWithoutFilter2.filter(function (el: any) {
      return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }

  FilterFn3() {
    var itemNameFilter = this.NameFilter3;
    var itemDescFilter = this.DescFilter;

    this.processingItems = this.NameListWithoutFilter3.filter(function (el: any) {
      return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }

  FilterFn4() {
    var itemNameFilter = this.NameFilter4;
    var itemDescFilter = this.DescFilter;

    this.returnItems = this.NameListWithoutFilter4.filter(function (el: any) {
      return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }

  FilterFn5() {
    var itemNameFilter = this.NameFilter5;
    var itemDescFilter = this.DescFilter;

    this.completedItems = this.NameListWithoutFilter5.filter(function (el: any) {
      return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }

  openBorrowerDetails(id: any) {
    const dialogRef = this.dialog.open(UserDetailsViewComponent, {
      // height: '500px',
      width: '300px',
      data: {
        dataKey: id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  confirmBorrow(transId: any) {
    this.transDetailPkg.transactionId = transId;
    this.transDetailPkg.statusId = TransactionStatusEnum.Confirmed;

    this.service.putTransactionDetail(this.transDetailPkg).subscribe((data: any) => {
      console.log(data.status);
      this.ngOnInit();
    });
  }

  rejectBorrow(transId: any) {
    this.transDetailPkg.transactionId = transId;
    this.transDetailPkg.statusId = TransactionStatusEnum.Rejected;

    this.rejectAndCancel('Rejection');
  }

  rejectAndCancel(text: any) {
    const dialogRef = this.dialog.open(ReasonComponent, {
      height: '300px',
      width: '400px',
      data: {
        title: text,
      },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        this.transDetailPkg.reason = data;
        this.service.putTransactionDetail(this.transDetailPkg).subscribe((data: any) => {
          this.ngOnInit();
        });
      }
    });
  }

  cancelBorrow(transId: any) {
    this.transDetailPkg.transactionId = transId;
    this.transDetailPkg.statusId = TransactionStatusEnum.CanceledByLender;

    this.rejectAndCancel('Cancellation');
  }

  returnComplete(transId: any) {
    this.transDetailPkg.transactionId = transId;
    this.transDetailPkg.statusId = TransactionStatusEnum.ReturnComplete;

    this.service.putTransactionDetail(this.transDetailPkg).subscribe((data: any) => {
      console.log(data.status);
      this.ngOnInit();
    });
  }

  onCheck(id: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Message',
        message: 'Did you check the message?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.updateNotificationStatus(id).subscribe((data: any) => {
          console.log(data);
          //this.ngOnInit();
          window.location.reload();
        });
      }
    });
  }
}
