import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { AuthenticationService } from '../../../Services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  invalidLogin: boolean;
  loginForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<LoginComponent>,
    private authenticationService: AuthenticationService) {
    // if (this.authenticationService.currentUserValue) {
    //   this.router.navigate(['/main']);
    // }
  }
  
  onLogin(value) {    
    this.submitted = true;
    this.authenticationService.Login(value.Email, value.Password).subscribe(res => {
      this.resetLoginError(false);
      this.router.navigate(["/home"]);
      this.loading = false;
      this.dialogRef.close();
    }, error => {
      this.resetLoginError(true);
      console.log(error.errors);
    })
  }

//   onLogin(value) {
//     alert(value.Email);
   
//    this.submitted = true;

//    // this.service.Login(value).subscribe(res => {
//    this.authenticationService.Login(value).subscribe(res => {
//      const token = (<any>res).token;

//      localStorage.setItem("jwt", token);
//      localStorage.setItem("userId", value.Email);

//      this.resetLoginError(false);
//      this.router.navigate(["/main"]);
//      this.dialogRef.close();
//    }, error => {
//      this.resetLoginError(true);
//      //alert(error.error);
//      console.log(error.errors);
//    })
//  }

  resetLoginError(val: boolean) {
    this.invalidLogin = val;
  }

  get isLoginUser() {
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
