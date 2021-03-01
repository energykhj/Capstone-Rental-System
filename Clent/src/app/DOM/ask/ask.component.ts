import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { SharedService } from 'src/app/Services/shared.service';
import { environment } from 'src/environments/environment';

export interface Article {
  id: number;
  userId: string;
  date: any;
  title: string;
  description: string;
  userName: string;
  email: string;  
  phone: string;
  photoUrl: string;
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
  displayedColumns : string[] = ['id', 'userName', 'title', 'date'];  
  dataSource: MatTableDataSource<Article>;
  expandedElement: Article | null;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  userId = "";
  showMore: boolean;
  filePath = environment.PhotoFileUrl;
  articles: any = [];  
  page = 1;

  constructor(private service: SharedService) {
   // Create 100 users
   //const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

   // Assign the data to the data source for the table to render
   this.loadUserItem();
  }

  loadUserItem(){
    this.service.getAllBoardArticles().subscribe((data:any)=>{
      this.articles = data;
      this.dataSource = new MatTableDataSource(data);
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
