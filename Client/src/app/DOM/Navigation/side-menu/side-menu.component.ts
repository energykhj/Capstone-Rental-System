import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/Services/shared.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/DOM/Account/login/login.component';
import { HeaderComponent } from 'src/app/DOM/Navigation/header/header.component';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();

  search = '';
  userDetails: any = [];
  photoUrl: string;
  userName: string = '';
  selectedCity: string = HeaderComponent.ALL_CITIES;
  cityList: any = [];

  constructor(private router: Router, private service: SharedService, public dialog: MatDialog) {
    this.getUser();
  }

  getUser() {
    const userId: string = localStorage.getItem('userId');
    if (userId) {
      this.service.getUserInfo.subscribe((user) => {
        this.userDetails = user.details;
        this.userName = this.userDetails.firstName ? this.userDetails.firstName + ' ' + this.userDetails.lastName : '';
        this.photoUrl = this.userDetails.photoUrl ? environment.PhotoFileUrl + this.userDetails.photoUrl : '';

        // alert(this.photoUrl);
      });
    }
  }
  ngOnInit(): void {
    this.getCityList();
  }

  getCityList() {
    this.cityList = [];
    this.service.getCityOfAddress().subscribe((data) => {
      for (var i = 0; i < data.length; i++) {
        this.cityList.push(data[i]);
      }
      this.cityList.push(HeaderComponent.ALL_CITIES);
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
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
    this.sidenavClose.emit();
  };

  onSearch(search, selectedCity) {
    var queryParams;

    if (selectedCity == HeaderComponent.ALL_CITIES) {
      queryParams = {
        search: search,
        city: '',
      };
    } else {
      queryParams = {
        search: search,
        city: selectedCity,
      };
    }
    this.router
      .navigate(['/home'], {
        queryParams: queryParams,
      })
      .then(() => {
        window.location.reload();
      });
  }
}
