import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserAccountComponent } from '../../Account/user-account/user-account.component';
import { UserDetailsComponent } from '../../Account/user-details/user-details.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  users =[];
  userName: string="";
  @Output() public sidenavToggle = new EventEmitter();

  constructor(public dialog: MatDialog,
    private router: Router) { 
      this.users.push({name: "Brad Pitt", photo: "/assets/shiba1.jpg"});
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
      this.userName =  userId;
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