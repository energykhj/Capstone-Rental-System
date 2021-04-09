import { Component, Input, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SharedService } from 'src/app/Services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { DetailComponent } from '../detail/detail.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  currentUser: any;
  id: any;

  properties: any = [];
  page = 1;
  search = '';
  city = '';
  notEmptyPost = true;
  notScrolly = true;
  isSearched = false;

  subscription: Subscription;

  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private service: SharedService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    // subscribe reload home page
    this.subscription = this.service.getNotificationReloadHome().subscribe((data) => {
      this.ngOnInit();
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  isUserAuthenticated() {
    const token: string = localStorage.getItem('jwt');
    this.id = '5aab855c-c644-45c7-b798-159b1f78d640'; //localStorage.getItem("id");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    } else return false;
  }

  ngOnInit(): void {
    this.page = 1;
    this.notEmptyPost = true;
    this.isSearched = false;

    this.search = this.route.snapshot.queryParamMap.get('search');
    this.city = this.route.snapshot.queryParamMap.get('city');
    if (this.search === null || this.search === '') {
      this.search = 'null';
    }
    if (this.city === null || this.city === '') {
      this.city = 'null';
    }
    if (this.search != 'null' || this.city != 'null') {
      this.isSearched = true;
    }
    //console.log(this.search + 'onInit');
    this.loadInitPost();
  }

  loadInitPost() {
    this.service.getSearchedItemAndDefaultPhoto(this.page, this.search, this.city).subscribe(
      (data) => {
        this.properties = data;
        if (this.properties.length < 8) {
          this.notEmptyPost = false;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onClick() {
    console.log('click');
    this.page = this.page + 1;

    this.service.getSearchedItemAndDefaultPhoto(this.page, this.search, this.city).subscribe((data) => {
      const newList = data;

      if (newList.length < 8) {
        this.notEmptyPost = false;
      }

      this.properties = this.properties.concat(newList);
      this.notScrolly = true;
    });
  }
}
