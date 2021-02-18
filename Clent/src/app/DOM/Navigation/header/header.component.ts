import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserAccountComponent } from '../../Account/user-account/user-account.component';
import { UserDetailsComponent } from '../../Account/user-details/user-details.component';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/Services/shared.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  options: FormGroup;
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto');

  userDetails: any=[];
  userAccount: any=[];
  address: any=[];
  photoUrl: string;
  userName: string="";
  @Output() public sidenavToggle = new EventEmitter();
  
  constructor(public dialog: MatDialog,
    private router: Router,
    private service: SharedService,
    fb: FormBuilder) { 
      this.options = fb.group({
        hideRequired: this.hideRequiredControl,
        floatLabel: this.floatLabelControl,
      });
    }

  openLogin() {
    this.dialog.open(UserAccountComponent);
  }

  openLoginModal() {
    this.dialog.open(UserAccountComponent);
  }

  openUserDetails() {
    this.dialog.open(UserDetailsComponent);
  }

  ngOnInit(): void {
    const userId: string = localStorage.getItem("userId");    
    if(userId){
      this.service.GetUserInfo.subscribe(user =>{
        this.userAccount = user.account;
        this.userDetails = user.details;
        this.address = user.addresses;
        this.userName = user.account.email;
        
        this.userName = (this.userDetails.firstName)? this.userDetails.firstName +" "+ this.userDetails.lastName : "";
        this.photoUrl = (this.userDetails.photoUrl)? this.service.PhotoUrl+this.userDetails.photoUrl : "";
        
         //alert(this.userAccount.email); 
      });
    } 
  }

  // logout(){
  //   localStorage.removeItem("jwt");    
  //   localStorage.removeItem("userId");    
  //   this.router.navigate(["/main"]);
  // }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
   }

   public changeName(name: string): void {
    this.userName = name;
  }  
}