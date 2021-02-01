import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../Services/shared.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  post: any;
  constructor( private service:SharedService) {}
  WeatherList:any=[];

  ngOnInit(): void {
    this.service.GetWeather().subscribe(res => {
      this.WeatherList = res;
    }, error => {
      console.log(error.error);
      alert(error.error);
    })

  }


}
