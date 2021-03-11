import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/Services/shared.service';
import { environment } from 'src/environments/environment';
import { TransactionStatusEnum } from 'src/app/Helpers/enum';
import { FormatUtils } from 'src/app/Helpers/format-utils';

@Component({
  selector: 'app-my-borrow',
  templateUrl: './my-borrow.component.html',
  styleUrls: ['./my-borrow.component.scss'],
})
export class MyBorrowComponent implements OnInit {
  active = 1;
  showMore: boolean;
  userId: string = '';
  filePath = environment.PhotoFileUrl + 'd82ace94-4987-4b1e-8283-8c5dbb2ca927.jpg';
  filePath1 = environment.PhotoFileUrl + '04a0db75-8e40-4a54-a728-59c4e8c5ec7a.jpg';
  requestItemPkgs: any[];
  filteredRequestItemPkgs: any[];
  borrowingItemPkgs: any[];
  filteredBorrowingItemPkgs: any[];
  compledtedItemPkgs: any[];
  filteredCompledtedItemPkgs: any[];
  NameFilter: string = '';
  currentDate: Date = new Date();
  ownerNames = {};

  formatDate = FormatUtils.formatDate;
  formatCurrency = FormatUtils.formatCurrency;
  dateDiffInDays = FormatUtils.dateDiffInDays;

  constructor(private service: SharedService) {}

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
        //this.notEmptyPost2 = false;
      }
      this.showMore = false;

      this.requestItemPkgs.forEach((transItemPkg) => {
        transItemPkg.item.defaultImageFile = transItemPkg.item.defaultImageFile
          ? environment.PhotoFileUrl + transItemPkg.item.defaultImageFile
          : '';
        this.getOwnerNames(transItemPkg.item.userId);
      });
      this.filteredRequestItemPkgs = this.requestItemPkgs;
    });

    this.service
      .getTransactionByUser(this.userId, [TransactionStatusEnum.Confirmed, TransactionStatusEnum.RequestReturn])
      .subscribe((transItemPkgs: any) => {
        this.borrowingItemPkgs = transItemPkgs;
        if (transItemPkgs.length < 8) {
          //this.notEmptyPost2 = false;
        }
        this.showMore = false;

        this.borrowingItemPkgs.forEach((transItemPkg) => {
          transItemPkg.item.defaultImageFile = transItemPkg.item.defaultImageFile
            ? environment.PhotoFileUrl + transItemPkg.item.defaultImageFile
            : '';
          this.getOwnerNames(transItemPkg.item.userId);
        });
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
          //this.notEmptyPost2 = false;
        }
        this.showMore = false;

        this.compledtedItemPkgs.forEach((transItemPkg) => {
          transItemPkg.item.defaultImageFile = transItemPkg.item.defaultImageFile
            ? environment.PhotoFileUrl + transItemPkg.item.defaultImageFile
            : '';
          this.getOwnerNames(transItemPkg.item.userId);
        });
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
  }
}
