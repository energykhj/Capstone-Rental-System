import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/Services/shared.service';
import { environment } from 'src/environments/environment';

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
  NameFilter: string = '';
  DescFilter: string = '';
  page1 = 1;
  page2 = 1;
  page3 = 1;
  page4 = 1;
  notEmptyPost1 = true;
  notScrolly1 = true;
  notEmptyPost2 = true;
  notScrolly2 = true;
  notEmptyPost3 = true;
  notScrolly3 = true;
  notEmptyPost4 = true;
  notScrolly4 = true;
  NameListWithoutFilter: any = [];
  userItems: any = [];
  requestItems: any = [];
  returnItems: any = [];
  completedItems: any = [];

  constructor(private service: SharedService) {}

  ngOnInit(): void {
    this.userId = this.service.isLoginUser;
    this.userId = this.userId.replace(/['"]+/g, '');

    this.loadUserItem();
  }

  loadUserItem() {
    // this.userId = "51afd4fa-7b65-47fd-b62a-a4a42ff10979";
    this.service.getUserItem(this.page1, this.userId).subscribe((userItem: any) => {
      this.userItems = userItem;
      this.showMore = false;
      this.userItems.defaultImageFile = this.userItems.defaultImageFile
        ? environment.PhotoFileUrl + this.userItems.defaultImageFile
        : '';
      this.NameListWithoutFilter = userItem;
    });

    this.service.getUserItem(this.page2, this.userId).subscribe((requestItem: any) => {
      this.requestItems = requestItem;
      this.showMore = false;
      this.requestItems.defaultImageFile = this.requestItems.defaultImageFile
        ? environment.PhotoFileUrl + this.requestItems.defaultImageFile
        : '';
      this.NameListWithoutFilter = requestItem;
    });

    this.service.getUserItem(this.page3, this.userId).subscribe((returnItem: any) => {
      this.returnItems = returnItem;
      this.showMore = false;
      this.returnItems.defaultImageFile = this.returnItems.defaultImageFile
        ? environment.PhotoFileUrl + this.returnItems.defaultImageFile
        : '';
      this.NameListWithoutFilter = returnItem;
    });

    this.service.getUserItem(this.page4, this.userId).subscribe((completedItem: any) => {
      this.completedItems = completedItem;
      this.showMore = false;
      this.completedItems.defaultImageFile = this.completedItems.defaultImageFile
        ? environment.PhotoFileUrl + this.completedItems.defaultImageFile
        : '';
      this.NameListWithoutFilter = completedItem;
    });
  }

  onClick1() {
    console.log('click1');
    this.page1 = this.page1 + 1;
    //  this.userId = '51afd4fa-7b65-47fd-b62a-a4a42ff10979';
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
    console.log('click2');
    this.page2 = this.page2 + 1;
    //  this.userId = '51afd4fa-7b65-47fd-b62a-a4a42ff10979';
    this.service.getUserItem(this.page2, this.userId).subscribe((requestItem) => {
      const requestList = requestItem;

      if (requestList.length < 8) {
        this.notEmptyPost2 = false;
      }

      this.requestItems = this.userItems.concat(requestList);
      this.notScrolly2 = true;
    });
  }

  onClick3() {
    console.log('click3');
    this.page3 = this.page3 + 1;
    //  this.userId = '51afd4fa-7b65-47fd-b62a-a4a42ff10979';
    this.service.getUserItem(this.page3, this.userId).subscribe((returnItem) => {
      const returnList = returnItem;

      if (returnList.length < 8) {
        this.notEmptyPost3 = false;
      }

      this.returnItems = this.returnItems.concat(returnList);
      this.notScrolly3 = true;
    });
  }

  onClick4() {
    console.log('click4');
    this.page4 = this.page4 + 1;
    //  this.userId = '51afd4fa-7b65-47fd-b62a-a4a42ff10979';
    this.service.getUserItem(this.page4, this.userId).subscribe((completedItem) => {
      const completedList = completedItem;

      if (completedList.length < 8) {
        this.notEmptyPost4 = false;
      }

      this.completedItems = this.completedItems.concat(completedList);
      this.notScrolly4 = true;
    });
  }

  trimString(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  FilterFn1() {
    var itemNameFilter = this.NameFilter;
    var itemDescFilter = this.DescFilter;

    this.userItems = this.NameListWithoutFilter.filter(function (el: any) {
      return el.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }

  FilterFn2() {
    var itemNameFilter = this.NameFilter;
    var itemDescFilter = this.DescFilter;

    this.requestItems = this.NameListWithoutFilter.filter(function (el: any) {
      return el.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }

  FilterFn3() {
    var itemNameFilter = this.NameFilter;
    var itemDescFilter = this.DescFilter;

    this.returnItems = this.NameListWithoutFilter.filter(function (el: any) {
      return el.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }

  FilterFn4() {
    var itemNameFilter = this.NameFilter;
    var itemDescFilter = this.DescFilter;

    this.completedItems = this.NameListWithoutFilter.filter(function (el: any) {
      return el.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }
}
