import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../Services/shared.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  userId: string;
  itemId: string;

  constructor(private router: Router, private service: SharedService) {
    if (this.service.isLoginUser) {
      this.userId = this.service.isLoginUser;
      this.userId = this.userId.replace(/['"]+/g, '');
    } else {
      this.router.navigate(['/main']);
    }
  }

  ngOnInit() {
    //this.itemId = "15";
  }
}
