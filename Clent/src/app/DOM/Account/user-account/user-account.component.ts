import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SharedService } from '../../../Services/shared.service';
import { PasswordValidator, ParentErrorStateMatcher } from 'src/app/validators';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})

export class UserAccountComponent implements OnInit {
  invalidLogin: boolean;
  loginForm: FormGroup;
  registerForm: FormGroup;
  matching_passwords_group: FormGroup;
  parentErrorStateMatcher = new ParentErrorStateMatcher();

  account_validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Username must be at least 5 characters long' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long' },
      // { type: 'pattern', message: 'Your username must contain only numbers and letters' },
      { type: 'validUsername', message: 'Your username has already been taken' }
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' },
      { type: 'areEqual', message: 'Password mismatch' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number and one special character' }
    ]
  }

  constructor(private fb: FormBuilder,
    private service: SharedService,
    private router: Router,
    private _location: Location,
    private dialogRef: MatDialogRef<UserAccountComponent>) { }

  ngOnInit() {
    if (this.isLoginUser != null) this._location.back();
    this.createForms();
    this.loginForm = this.fb.group({
      Email: [''],
      Password: [''],
    });
  }

  onRegister(value) {
    console.log(value.matching_passwords.password);
    var val = {
      Username: value.username,
      Email: value.email,
      Password: value.matching_passwords.password
    };

    this.service.CreateUser(val).subscribe(res => {
      //this.router.navigate(['/login']);  
      const token = (<any>res).token;
      localStorage.setItem("jwt", token);
      localStorage.setItem("userId", val.Email);
      this.router.navigate(['/main']);
      console.log(res);
    }, error => {
      console.log(error.errors);
    })
  }

  resetLoginError(val: boolean) {
    this.invalidLogin = val;
  }

  onLogin(value) {
    // alert(value.Email);
    this.service.Login(value).subscribe(res => {
      const token = (<any>res).token;

      localStorage.setItem("jwt", token);
      localStorage.setItem("userId", value.Email);

      this.resetLoginError(false);
      this.router.navigate(["/main"]);
      this.dialogRef.close();

    }, error => {
      this.resetLoginError(true);
      console.log(error.errors);
    })
  }

  createForms() {
    // matching passwords validation
    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(8),
        Validators.required,
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
      ])),
      confirm_password: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });

    // user links form validations
    this.registerForm = this.fb.group({
      // username: new FormControl('', Validators.compose([
      // //  UsernameValidator.validUsername,
      //  Validators.maxLength(25),
      //  Validators.minLength(5),
      //  //Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
      //  Validators.required
      // ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      matching_passwords: this.matching_passwords_group,
      //terms: new FormControl(false, Validators.pattern('true'))
    })

  }

  get isLoginUser() {
    return localStorage.getItem("userId");
  }
  // Register(){
  //   var val={
  //     Username:this.Username,
  //     Email:this.Email,
  //     Password:this.Password
  //   };
  //   this.service.Register(val).subscribe(data=>{
  //     alert(data.toString());
  //   });
  // }

}

