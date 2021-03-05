import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../DOM/Account/login/login.component';

@Injectable()
export class AuthService implements CanActivate {

  constructor(private router: Router, 
    private jwtHelper: JwtHelperService,
    public dialog: MatDialog) {   }

  canActivate(){
    const token = localStorage.getItem("jwt");

    if(token && !this.jwtHelper.isTokenExpired(token)){
      return true;
    }  
   
    this.dialog.open(LoginComponent);
    // this.router.navigate(["/login"]);
    return false;
  }

}
