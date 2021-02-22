import { Component, Input, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SharedService } from 'src/app/Services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { DetailComponent } from '../detail/detail.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: any;
  id: any;

  properties:any=[];
  page = 1;
  value = "t";
  notEmptyPost = true;
  notScrolly = true;

  constructor(private router: Router, 
              private jwtHelper: JwtHelperService,
              private service: SharedService,
              private route: ActivatedRoute,
              public dialog: MatDialog) { }

  isUserAuthenticated(){
    const token: string = localStorage.getItem("jwt");    
    this.id = "5aab855c-c644-45c7-b798-159b1f78d640";//localStorage.getItem("id");
    if(token && !this.jwtHelper.isTokenExpired(token)){
        return true;
    }
    else
      return false;
  }
  ngOnInit(): void {
    const value = this.route.snapshot.queryParamMap.get('value');
    console.log(this.value+'onInit');
    this.loadInitPost();  
  }

  loadInitPost(){
  this.service.GetSearchedItemAndDefaultPhoto(this.value, this.page).subscribe(
      data=>{
            this.properties=data;
            console.log(data);
      }, error => {
        console.log(error);
      }
    )
  }

  onClick(){
    console.log("click");
    this.page = this.page + 1;

    this.service.GetSearchedItemAndDefaultPhoto(this.value, this.page).subscribe(
      data=>{
            const newList = data;

            if(newList.length < 6){
              this.notEmptyPost = false;
            }

            this.properties = this.properties.concat(newList);
            this.notScrolly = true;
      });
  }
}





