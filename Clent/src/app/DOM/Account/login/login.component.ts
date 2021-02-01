import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../../Services/shared.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  invalidLogin: boolean;
  loginForm:FormGroup;
  constructor(private router: Router, 
              private fb: FormBuilder, 
              private service:SharedService,
              public dialog: MatDialog,
              private dialogRef: MatDialogRef<LoginComponent>) { }

  onLogin(value){
   // alert(value.Email);
    this.service.Login(value).subscribe(res=>{
      const token = (<any>res).token;
      
      localStorage.setItem("jwt", token);
      localStorage.setItem("userId", value.Email);

      this.resetLoginError(false);
      this.router.navigate(["/main"]);      
      this.dialogRef.close();
      }, error => {
        this.resetLoginError(true);
        //alert(error.error);
        console.log(error.errors);
      })
  }

  resetLoginError(val: boolean) {
    this.invalidLogin = val;
  }

  get isLoginUser(){
      return localStorage.getItem("userId");
  }

  ngOnInit(): void {    
    this.loginForm = this.fb.group({
      Email: [''],
      Password: [''],
    });
  }

  openLogin() {
    this.dialog.closeAll();
    this.dialog.open(RegisterComponent);
  }
}
