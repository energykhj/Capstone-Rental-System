import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../../Models/user';
import { AuthenticationService } from '../../Services/authentication.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  loading = false;
  currentUser: string;

  constructor(private router: Router, 
              private jwtHelper: JwtHelperService,
              private authenticationService: AuthenticationService) { }

  ngOnInit(): void {    
  }

  isUserAuthenticated(){
    this.loading = true;
    //alert(this.authenticationService.currentUserValue.password);

    const token: string = localStorage.getItem("currentUser");
    //alert(token);
    if(token && !this.jwtHelper.isTokenExpired(token)){
       const userId: string = localStorage.getItem("userId");
       this.currentUser == userId;
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
