import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SharedService } from 'src/app/Services/shared.service';
import { User } from '../../Models/user';
import { AuthenticationService } from '../../Services/authentication.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  currentUser: any;
  id: any;
  constructor(private router: Router, 
              private jwtHelper: JwtHelperService,
              private service: SharedService) { }

  ngOnInit(): void {    
  }
 
  isUserAuthenticated(){
    //alert(this.authenticationService.currentUserValue.password);

    const token: string = localStorage.getItem("jwt");    
    this.id = "8f83d00a-becb-4efe-b93f-24861b15d6ac";//localStorage.getItem("id");
    if(token && !this.jwtHelper.isTokenExpired(token)){
      // this.service.GetUser(this.id).subscribe(data=>{

      // });
      //console.log("Main-isUserAuthenticated: " + this.id.replace('"', ''));

      // this.ser.GetUser(this.id).subscribe(res => {
      //   this.currentUser = res;      
      // }, error => {
        //console.log(error.error);
        //alert("this: " + error.error);
     // })

      
        return true;
    }
    else
      return false;
  }

  logOut(){
    localStorage.removeItem("jwt");
  }
}
