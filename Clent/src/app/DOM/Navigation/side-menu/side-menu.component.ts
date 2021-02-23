import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/Services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  value = '';
  userDetails: any=[];
  photoUrl: string;
  userName: string="";
  @Output() sidenavClose = new EventEmitter();

  constructor(
    private router: Router,
    private service: SharedService,
  ) { this.getUser();}

  getUser(){
    const userId: string = localStorage.getItem("userId");    
    if(userId){
      this.service.GetUserInfo.subscribe(user =>{
        this.userDetails = user.details;        
        this.userName = (this.userDetails.firstName)? this.userDetails.firstName +" "+ this.userDetails.lastName : "";
        this.photoUrl = (this.userDetails.photoUrl)? environment.PhotoFileUrl+this.userDetails.photoUrl : "";
        
        // alert(this.photoUrl); 
      });
    } 
  }
  ngOnInit(): void {
  }


  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  onSearch(value){
    console.log('header');
    this.router.navigate(['/home'],{
      queryParams: {
        value: value
      }
    }).then(page => { window.location.reload();})
  }
}
