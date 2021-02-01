import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HeaderComponent } from '../Navigation/header/header.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private router: Router, 
              private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {    
  }

  isUserAuthenticated(){
    const token: string = localStorage.getItem("jwt");
    if(token && !this.jwtHelper.isTokenExpired(token)){
      // const userId: string = localStorage.getItem("userId");
      // this.service.GetUser(userId).subscribe(res =>{
        //   console.log(res.userId);
        // }, error => {
          //   console.log(error);
          // });
          
      // const userId: string = localStorage.getItem("userId");
      // console.log("test");
      return true;
    }
    else
      return false;
  }

  logOut(){
    localStorage.removeItem("jwt");
  }
}
