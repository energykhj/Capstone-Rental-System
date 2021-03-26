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
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide = true;
  invalidLogin: boolean;
  loginForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<LoginComponent>,
    private authenticationService: AuthenticationService
  ) {
    // if (this.authenticationService.currentUserValue) {
    //   this.router.navigate(['/home']);
    // }
  }

  onLogin(value) {
    this.submitted = true;
    this.authenticationService.Login(value.Email, value.Password).subscribe(
      (res) => {
        this.resetLoginError(false);
        this.router.navigate(['/home']);
        this.loading = false;
        this.dialogRef.close();
        window.location.reload();
      },
      (error) => {
        this.resetLoginError(true);
        console.log(error.errors);
      }
    );
  }

  resetLoginError(val: boolean) {
    this.invalidLogin = val;
  }

  get isLoginUser() {
    return localStorage.getItem('userId');
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

  onKeyDown(event, value) {
    if (event.keyCode === 13) {
      this.onLogin(value);
    }
  }
}
