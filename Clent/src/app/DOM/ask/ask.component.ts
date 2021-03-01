import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { SharedService } from 'src/app/Services/shared.service';
import { environment } from 'src/environments/environment';

export interface UserData {
  id: number;
  name: string;
  category: string;
  Title: string;
  link: string;
  description: string;
}

@Component({
  selector: 'app-ask',
  templateUrl: './ask.component.html',
  styleUrls: ['./ask.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AskComponent implements AfterViewInit{
  active = 1;

  displayedColumns : string[] = ['#', 'name', 'Title', 'Link'];  
  dataSource: MatTableDataSource<UserData>;
  expandedElement: UserData | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  userId = "";
  showMore: boolean;
  filePath = environment.PhotoFileUrl;
  userItems: any = [];  
  page = 1;

  constructor(private service: SharedService) {
   // Create 100 users
   //const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

   // Assign the data to the data source for the table to render
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

        this.dataSource = new MatTableDataSource(userItem);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  
}

/** Builds and returns a new User. */
// function createNewUser(id: number): UserData {
//   const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
//       NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

//   return {
//     id: id,
//     name: name,
//     Title: title,
//     Link: Link
//   };
// }
