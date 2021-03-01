import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/Services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-borrow',
  templateUrl: './my-borrow.component.html',
  styleUrls: ['./my-borrow.component.scss']
})
export class MyBorrowComponent implements OnInit {

  active = 1;
  userid = "";
  filePath = environment.PhotoFileUrl + "d82ace94-4987-4b1e-8283-8c5dbb2ca927.jpg";
  filePath1 = environment.PhotoFileUrl + "04a0db75-8e40-4a54-a728-59c4e8c5ec7a.jpg";

  constructor( private service: SharedService) { }

  ngOnInit(): void {
    this.userid = this.service.isLoginUser;
    this.userid = this.userid.replace(/['"]+/g, '');
    this.service.getUserItem(8, this.userid).subscribe(userItem => {

    })
  } 
}
