import { HomeComponent } from './../../Main/home/home.component';
import { MapsComponent } from '../../Navigation/maps/maps.component';
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
  value = '';
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
    //this.dialog.open(UserAccountComponent);
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

          //alert(this.userAccount.email);
          this.getNotificationCount();
        },
        (error) => {}
      );
    }
  }

  openMaps() {
    const dialogRef = this.dialog.open(MapsComponent, {
      width: '650px',
      height: '600px',
    });
  }

  // logout(){
  //   localStorage.removeItem("jwt");
  //   localStorage.removeItem("userId");
  //   this.router.navigate(["/home"]);
  // }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };

  public changeName(name: string): void {
    this.userName = name;
  }

  onSearch(value) {
    console.log('header');
    this.router
      .navigate(['/home'], {
        queryParams: {
          value: value,
        },
      })
      .then((page) => {
        window.location.reload();
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

  onKeyDown(event, value) {
    if (event.keyCode === 13) {
      this.onSearch(value);
    }
  }
}
