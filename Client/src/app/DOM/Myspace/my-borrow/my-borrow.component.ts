import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/Services/shared.service';
import { environment } from 'src/environments/environment';
import { TransactionStatusEnum, NotificationTypeEnum } from 'src/app/Helpers/enum';
import { FormatUtils } from 'src/app/Helpers/format-utils';
import { MatDialog } from '@angular/material/dialog';
import { UserDetailsViewComponent } from 'src/app/DOM/Account/user-details-view/user-details-view.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/DOM/Shared/confirm-dialog/confirm-dialog.component';
import { ReasonComponent } from '../my-list/reason/reason.component';
import { DateValidator } from 'src/app/DOM/Shared/validators/date.validator';

@Component({
  selector: 'app-my-borrow',
  templateUrl: './my-borrow.component.html',
  styleUrls: ['./my-borrow.component.scss'],
})
export class MyBorrowComponent implements OnInit {
  active = 0;
  showMore: boolean;
  userId: string = '';

  requestItemPkgs: any[];
  filteredRequestItemPkgs: any[];
  borrowingItemPkgs: any[];
  filteredBorrowingItemPkgs: any[];
  compledtedItemPkgs: any[];
  filteredCompledtedItemPkgs: any[];

  NameFilter: string = '';
  currentDate: Date = new Date();
  ownerNames = {};
  notEmptyPost = true;

  tranDetails = {
    id: 0,
    transactionId: 0,
    statusId: 1,
    statusName: '',
    reason: '',
    date: new Date(),
  };

  notification: any = {
    id: 0,
    fromUserId: '',
    toUserId: '',
    itemId: 0,
    notiType: NotificationTypeEnum.RequestReturn,
    message: '',
    sendDate: new Date(),
    isRead: false,
  };

  statusText: string[] = [
    '',
    'Wait Confirmation',
    'Request Confirmed',
    'Request Rejected',
    'Canceled By Lender',
    'Canceled By Borrower',
    'Wait Return Confirmation',
    'Return Completed',
  ];

  formatDate = FormatUtils.formatDate;
  formatCurrency = FormatUtils.formatCurrency;
  dateDiffInDays = FormatUtils.dateDiffInDays;

  constructor(private service: SharedService, public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.userId = this.service.isLoginUser;
    this.userId = this.userId.replace(/['"]+/g, '');
    //this.service.getUserItem(8, this.userId).subscribe((userItem) => {});
    this.loadTransaction();
  }

  loadTransaction() {
    this.service.getTransactionByUser(this.userId, [TransactionStatusEnum.Request]).subscribe((transItemPkgs: any) => {
      this.requestItemPkgs = transItemPkgs;
      if (transItemPkgs.length < 8) {
        this.notEmptyPost = false;
      }
      this.showMore = false;

      this.requestItemPkgs.forEach((transItemPkg) => {
        transItemPkg.item.defaultImageFile = transItemPkg.item.defaultImageFile
          ? environment.PhotoFileUrl + transItemPkg.item.defaultImageFile
          : environment.PhotoFileUrl + 'noImage.png';
        this.getOwnerNames(transItemPkg.item.userId);
      });
      // this.requestItemPkgs.sort((a, b) => {
      //   return b.trans.id - a.trans.id;
      // });
      this.filteredRequestItemPkgs = this.requestItemPkgs;
    });

    this.service
      .getTransactionByUser(this.userId, [TransactionStatusEnum.Confirmed, TransactionStatusEnum.RequestReturn])
      .subscribe((transItemPkgs: any) => {
        this.borrowingItemPkgs = transItemPkgs;
        if (transItemPkgs.length < 8) {
          this.notEmptyPost = false;
        }
        this.showMore = false;

        this.borrowingItemPkgs.forEach((transItemPkg) => {
          transItemPkg.item.defaultImageFile = transItemPkg.item.defaultImageFile
            ? environment.PhotoFileUrl + transItemPkg.item.defaultImageFile
            : environment.PhotoFileUrl + 'noImage.png';
          this.getOwnerNames(transItemPkg.item.userId);
        });
        // this.borrowingItemPkgs.sort((a, b) => {
        //   return b.trans.id - a.trans.id;
        // });
        this.filteredBorrowingItemPkgs = this.borrowingItemPkgs;
      });

    this.service
      .getTransactionByUser(this.userId, [
        TransactionStatusEnum.CanceledByBorrower,
        TransactionStatusEnum.CanceledByLender,
        TransactionStatusEnum.Rejected,
        TransactionStatusEnum.ReturnComplete,
      ])
      .subscribe((transItemPkgs: any) => {
        this.compledtedItemPkgs = transItemPkgs;
        if (transItemPkgs.length < 8) {
          this.notEmptyPost = false;
        }
        this.showMore = false;

        this.compledtedItemPkgs.forEach((transItemPkg) => {
          transItemPkg.item.defaultImageFile = transItemPkg.item.defaultImageFile
            ? environment.PhotoFileUrl + transItemPkg.item.defaultImageFile
            : environment.PhotoFileUrl + 'noImage.png';
          this.getOwnerNames(transItemPkg.item.userId);
        });
        // this.compledtedItemPkgs.sort((a, b) => {
        //   return b.trans.id - a.trans.id;
        // });
        this.filteredCompledtedItemPkgs = this.compledtedItemPkgs;
      });
  }

  getOwnerNames(userId) {
    var existKey = false;

    if (this.ownerNames != undefined) {
      const keys = Object.keys(this.ownerNames);
      keys.forEach((key) => {
        if (key == userId) existKey = true;
      });
    }

    if (existKey == false) {
      this.service.GetOwnerInfo(userId).subscribe(
        (data: any) => {
          if (data.details != null) {
            var name = data.details.firstName + ' ' + data.details.lastName;
            this.ownerNames[userId] = name;
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  trimString(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  Filter(tabNum) {
    var itemNameFilter = this.NameFilter;
    //var itemDescFilter = this.DescFilter;

    switch (tabNum) {
      case 0:
        this.filteredRequestItemPkgs = this.requestItemPkgs.filter(function (el: any) {
          return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
        });
      case 1:
        this.filteredBorrowingItemPkgs = this.borrowingItemPkgs.filter(function (el: any) {
          return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
        });
      case 2:
        this.filteredCompledtedItemPkgs = this.compledtedItemPkgs.filter(function (el: any) {
          return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
        });
    }
  }

  onNavChange() {
    this.NameFilter = '';
    this.Filter(this.active);
    //this.ngOnInit();
  }

  openOwnerDetails(id: any) {
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

  onCancelRequest(transactionId) {
    const dialogRef = this.dialog.open(ReasonComponent, {
      height: '300px',
      width: '400px',
      data: {
        title: 'Cancel Request',
      },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        this.tranDetails.transactionId = transactionId;
        this.tranDetails.statusId = TransactionStatusEnum.CanceledByBorrower;
        this.tranDetails.reason = data;
        this.service.putTransactionDetail(this.tranDetails).subscribe((data: any) => {
          this.ngOnInit();
        });
      }
    });
  }

  onCancelReservation(transactionId) {
    // TODO: Check start date (-1)
    const dialogRef = this.dialog.open(ReasonComponent, {
      height: '300px',
      width: '400px',
      data: {
        title: 'Cancel Reservation',
      },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        this.tranDetails.transactionId = transactionId;
        this.tranDetails.statusId = TransactionStatusEnum.CanceledByBorrower;
        this.tranDetails.reason = data;
        this.service.putTransactionDetail(this.tranDetails).subscribe((data: any) => {
          this.ngOnInit();
        });
      }
    });
  }

  onRequestReturn(transactionId) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Request Return',
        message: 'Want to complete the return?<br/> Click Yes, a message is sent to owner',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Send Request Return
        this.tranDetails.transactionId = transactionId;
        this.tranDetails.statusId = TransactionStatusEnum.RequestReturn;
        this.service.putTransactionDetail(this.tranDetails).subscribe((data: any) => {
          //console.log(data);
          this.loadTransaction();
          this.service.Alert('success', 'Requested Return');
          //this.router.navigate(['/home']);

          //Send Notification
          this.notification.fromUserId = this.userId;
          this.notification.itemId = this.borrowingItemPkgs.find((el) => {
            return el.trans.id == this.tranDetails.transactionId;
          }).item.id;
          this.notification.toUserId = this.borrowingItemPkgs.find((el) => {
            return el.trans.id == this.tranDetails.transactionId;
          }).item.userId;
          this.service.insertNotification(this.notification).subscribe((data: any) => {
            console.log(data);
          });

          this.ngOnInit();
        });
      }
    });
  }

  checkRequestReturn(statusId) {
    // TODO: check available date
    if (statusId == TransactionStatusEnum.RequestReturn) {
      return true;
    } else {
      return false;
    }
  }

  checkCancelBorrow(borrowingItemPkg) {
    if (borrowingItemPkg.trans.currentStatus == TransactionStatusEnum.RequestReturn) {
      return false;
    } else {
      if (borrowingItemPkg.trans.startDate)
        if (DateValidator.compareDateWithoutForm(new Date(), borrowingItemPkg.trans.startDate) == 1) {
          return true;
        } else {
          return false;
        }
    }
  }
  onLoadMore() {}
}
