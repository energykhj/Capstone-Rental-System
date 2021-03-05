import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/Services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss']
})
export class MyListComponent implements OnInit {
  active = 1;
  userId = "";
  showMore: boolean;
  filePath = environment.PhotoFileUrl;
  NameFilter:string="";
  DescFilter:string="";  
  page = 1;
  notEmptyPost = true;
  notScrolly = true;
  NameListWithoutFilter:any=[];  
  userItems: any = [];

  constructor( private service: SharedService) { }

  ngOnInit(): void {
    this.userId = this.service.isLoginUser;
    this.userId = this.userId.replace(/['"]+/g, '');
    
    this.loadUserItem();
  }

  loadUserItem(){
    this.userId = "51afd4fa-7b65-47fd-b62a-a4a42ff10979";
    this.service.getUserItem(this.page, this.userId).subscribe((userItem:any)=>{
      this.userItems = userItem;
      this.showMore = false;
      this.userItems.defaultImageFile = 
        (this.userItems.defaultImageFile)? 
        environment.PhotoFileUrl + this.userItems.defaultImageFile : "";
      this.NameListWithoutFilter = userItem;
    });
  }

  onClick(){
    console.log("click");
    this.page = this.page + 1;
    this.userId = "51afd4fa-7b65-47fd-b62a-a4a42ff10979";
    this.service.getUserItem(this.page, this.userId).subscribe(
      userItem=>{
            const newList = userItem;

            if(newList.length < 8){
              this.notEmptyPost = false;
            }

            this.userItems = this.userItems.concat(newList);
            this.notScrolly = true;
      });
  }

  trimString(text, length) {
    return text.length > length ? 
           text.substring(0, length) + '...' :
           text;
  }

  FilterFn(){
    var itemNameFilter = this.NameFilter;
    var itemDescFilter = this.DescFilter;

    this.userItems = this.NameListWithoutFilter.filter(function (el:any){
      return el.name.toString().toLowerCase().includes(
        itemNameFilter.toString().trim().toLowerCase()
      )
    });
  }

}
