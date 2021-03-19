import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/material/dialog';
import { SharedService } from 'src/app/Services/shared.service';
import { ParentErrorStateMatcher } from 'src/app/DOM/Shared/validators';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss'],
})
export class UserAccountComponent implements OnInit {
  Menus: string[] = ['Account', 'Password'];
  selectedMenu = this.Menus[0];
  loginUser: any = {
    userName:'',
    userEmail:''
  };

  //loginUser: User;
  id: string;
  userEmail: string;
  userRole = "";
  constructor(
    private router: Router,
    private service: SharedService
  ) {
    this.id = this.service.isLoginUser;
    if (this.service.isLoginUser) {
      this.getUser();
    } else {
      this.router.navigate(['/main']);
    }
  }
  
  getUser() {
    this.id = this.id.replace(/['"]+/g, '');
    this.service.GetUserInfo.subscribe(
      (data: any) => {
        if (data.details != null) {
          this.loginUser.userName = data.details.firstName + ' ' + data.details.lastName;
          this.loginUser.userEmail = data.account.email;
        } else {
          this.loginUser.userName = '';
          this.loginUser.userEmail = data.account.email;
        }
        this.userEmail = data.account.email;
        if(data.role.name == 'Admin'){
          this.userRole = data.role.roleName;
          this.Menus.push('Admin');
        } 
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setMenu(menu){
    this.selectedMenu = menu;
  }

  ngOnInit(): void {
    
  }

}
