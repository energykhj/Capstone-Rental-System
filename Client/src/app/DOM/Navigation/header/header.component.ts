import { HomeComponent } from './../../Main/home/home.component';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserAccountComponent } from '../../Account/user-account/user-account.component';
import { UserDetailsComponent } from '../../Account/user-details/user-details.component';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/Services/shared.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { LoginComponent } from '../../Account/login/login.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();

  public static ALL_CITIES: string = 'All Cities';
  public static ALL_CATEGORIES: string = 'All Categories';

  search = '';
  searchValue: any;
  options: FormGroup;
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto');

  userDetails: any = [];
  userAccount: any = [];
  address: any = [];
  photoUrl: string;
  userName: string = '';
  borrowCount = 1;

  notificationCount = 0;
  subscription: Subscription;

  selectedCity: string = HeaderComponent.ALL_CITIES;
  selectedCategoryId = 0;

  cityList: any = [];
  categoryList: any = [];

  constructor(public dialog: MatDialog, private router: Router, private service: SharedService, fb: FormBuilder) {
    this.options = fb.group({
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
    });

    // subscribe Notification Message Count
    this.subscription = this.service.getNotificationCount().subscribe((count) => {
      if (count) {
        this.notificationCount = count;
      } else {
        this.notificationCount = 0;
      }
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  openLogin() {
    this.dialog.open(LoginComponent);
  }

  openLoginModal() {
    this.dialog.open(UserAccountComponent);
  }

  openUserDetails() {
    this.dialog.open(UserDetailsComponent);
  }

  ngOnInit(): void {
    const userId: string = localStorage.getItem('userId');
    if (userId) {
      this.service.getUserInfo.subscribe(
        (user) => {
          this.userAccount = user.account;
          this.userDetails = user.details;
          this.address = user.addresses;
          this.userName = user.account.email;

          this.userName = this.userDetails.firstName
            ? this.userDetails.firstName + ' ' + this.userDetails.lastName
            : '';
          this.photoUrl = this.userDetails.photoUrl ? environment.PhotoFileUrl + this.userDetails.photoUrl : '';

          this.getNotificationCount();
        },
        (error) => {}
      );
    }
    this.getCityList();
    this.getCategoryList();
  }

  getCityList() {
    this.cityList = [HeaderComponent.ALL_CITIES];
    this.service.getCityOfAddress().subscribe((data) => {
      for (var i = 0; i < data.length; i++) {
        this.cityList.push(data[i]);
      }
      //this.cityList.push(HeaderComponent.ALL_CITIES);
    });
  }

  getCategoryList() {
    this.categoryList = [{ categoryId: 0, name: HeaderComponent.ALL_CATEGORIES, item: [] }];
    this.service.getCategories().subscribe((data: any) => {
      for (var i = 0; i < data.length; i++) {
        this.categoryList.push(data[i]);
      }
    });
    //this.categoryList.push({ categoryId: 0, name: HeaderComponent.ALL_CATEGORIES, item: [] });
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };

  public changeName(name: string): void {
    this.userName = name;
  }

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

  onKeyDown(event, search, selectedCity, selectedCategoryId) {
    if (event.keyCode === 13) {
      //return
      this.onSearch(search, selectedCity, selectedCategoryId);
    }
  }
}
