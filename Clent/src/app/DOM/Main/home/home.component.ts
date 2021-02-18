import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SharedService } from 'src/app/Services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { DetailComponent } from '../detail/detail.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  currentUser: any;
  id: any;
  constructor(private router: Router, 
              private jwtHelper: JwtHelperService,
              private service: SharedService,
              public dialog: MatDialog) { }

  openDetail() {
    const dialogRef = this.dialog.open(DetailComponent, {
      // height: '500px',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  isUserAuthenticated(){
    const token: string = localStorage.getItem("jwt");    
    this.id = "5aab855c-c644-45c7-b798-159b1f78d640";//localStorage.getItem("id");
    if(token && !this.jwtHelper.isTokenExpired(token)){
        return true;
    }
    else
      return false;
  }
  ngOnInit(): void {
  }


}
