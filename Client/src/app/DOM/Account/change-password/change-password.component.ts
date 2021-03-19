import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../../Services/authentication.service';
import { PasswordValidator, ParentErrorStateMatcher } from 'src/app/DOM/Shared/validators';
import { SharedService } from 'src/app/Services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  @Input()
  public userEmail: string;
  
  passwordForm: FormGroup;
  matching_passwords_group: FormGroup;
  parentErrorStateMatcher = new ParentErrorStateMatcher();

  password_validation_messages = {   
    current_password: [
      { type: 'required', message: 'Currernt password is required' },
    ],
    confirm_password: [
      { type: 'required', message: 'Confirm password is required' },
      { type: 'areEqual', message: 'Password mismatch' },
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' },
      {
        type: 'pattern',
        message:
          'Your password must contain at least one uppercase, one lowercase, and one number and one special character',
      },
    ],
  };
  // constructor(private fb: FormBuilder, private http:HttpClient) { }
  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private service: SharedService
  ) {}

  ngOnInit() {
    this.createForms();
  }

  onSubmitPasswordChange(value) {
    var val = {      
      Email: this.userEmail,
      Password: value.current_password,
      NewPassword: value.matching_passwords.password,
    };

    this.authenticationService.ChangePassword(val).subscribe(
      (res) => {
        this.router.navigate(['/main']);
        window.location.reload();
        this.service.Alert('success', 'successfully updated!!');
      },
      (error) => {
        console.log(error.error);
        if(error.error == 'PasswordMismatch')
          this.service.Alert('danger', 'Current password is wrong');
      }
    );
  }

  createForms() {
    // matching passwords validation
    this.matching_passwords_group = new FormGroup(
      {
        password: new FormControl(
          '',
          Validators.compose([
            Validators.minLength(8),
            Validators.required,
            Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'),
          ])
        ),
        confirm_password: new FormControl('', Validators.required),
      },
      (formGroup: FormGroup) => {
        return PasswordValidator.areEqual(formGroup);
      }
    );

    // user links form validations
    this.passwordForm = this.fb.group({
      current_password: new FormControl('', Validators.required ),
      matching_passwords: this.matching_passwords_group,
    });
  }

}
