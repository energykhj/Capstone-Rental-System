import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/Services/shared.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/DOM/Account/login/login.component';
import { HeaderComponent } from 'src/app/DOM/Navigation/header/header.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();

  search = '';
  userAccount: any = [];
  userDetails: any = [];
  photoUrl: string;
  userName: string = '';
  selectedCity: string = HeaderComponent.ALL_CITIES;
  selectedCategoryId = 0;
  cityList: any = [];
  categoryList: any = [];
  notificationCount = 0;
  subscription: Subscription;

  constructor(private router: Router, private service: SharedService, public dialog: MatDialog) {
    this.getUser();
    // subscribe Notification Message Count
    this.subscription = this.service.getNotificationCount().subscribe((count) => {
      if (count) {
        this.notificationCount = count;
      } else {
        this.notificationCount = 0;
      }
    });
  }

  getUser() {
    const userId: string = localStorage.getItem('userId');
    if (userId) {
      this.service.getUserInfo.subscribe((user) => {
        this.userAccount = user.account;
        this.userDetails = user.details;
        this.userName = this.userDetails.firstName ? this.userDetails.firstName + ' ' + this.userDetails.lastName : '';
        this.photoUrl = this.userDetails.photoUrl ? environment.PhotoFileUrl + this.userDetails.photoUrl : '';

        // alert(this.photoUrl);
        this.getNotificationCount();
      });
    }
  }

  ngOnInit(): void {
    this.getCityList();
    this.getCategoryList();
  }

  getCityList() {
    this.cityList = [HeaderComponent.ALL_CITIES];
    this.service.getCityOfAddress().subscribe((data) => {
      for (var i = 0; i < data.length; i++) {
        this.cityList.push(data[i]);
      }
    });
  }

  getCategoryList() {
    this.categoryList = [{ categoryId: 0, name: HeaderComponent.ALL_CATEGORIES, item: [] }];
    this.service.getCategories().subscribe((data: any) => {
      for (var i = 0; i < data.length; i++) {
        this.categoryList.push(data[i]);
      }
    });
  }

  getNotificationCount() {
    var startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    var startDateStr = startDate.toUTCString();
    this.service.getNotification(this.userAccount.id, startDateStr).subscribe((notifications: any) => {
      var filterdNotification = notifications.filter((el) => {
        return el.toUserId == this.userAccount.id;
      });
      //this.notificationCount = filterdNotification.length;
      this.service.sendNotificationCount(filterdNotification.length);
    });
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  };

  public onLogInAndSideClose = () => {
    this.dialog.open(LoginComponent);
    this.sidenavClose.emit();
  };

  public onLogOutAndSideClose = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userId');
    localStorage.removeItem('currentUser');
    this.sidenavClose.emit();
  };

  onSearch(search, selectedCity, selectedCategoryId) {
    var queryParams;

    if (selectedCity == HeaderComponent.ALL_CITIES) {
      queryParams = {
        search: search,
        city: '',
        categoryId: selectedCategoryId,
      };
    } else {
      queryParams = {
        search: search,
        city: selectedCity,
        categoryId: selectedCategoryId,
      };
    }
    this.router
      .navigate(['/home'], {
        queryParams: queryParams,
      })
      .then(() => {
        this.service.sendNotificationReloadHome();
        this.sidenavClose.emit();
      });
  }
}
