import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SharedService } from 'src/app/Services/shared.service';
import { environment } from 'src/environments/environment';

export interface Article {
  date: any;
  description: string;
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  parentId: number;
  phone: string;
  photoUrl: string;
  title: string;
  userId: string;
  userName: string;
}

@Component({
  selector: 'app-ask',
  templateUrl: './ask.component.html',
  styleUrls: ['./ask.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AskComponent implements AfterViewInit {
  askTitle: string;
  askDescription: string;

  askBoardPkg: any = {
    date: new Date(),
    title: '',
    description: '',
    userId: '',
  };

  active = 1;
  displayedColumns: string[] = ['id', 'userName', 'title', 'date', 'edit'];
  dataSource: MatTableDataSource<Article>;
  expandedElement: Article | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  userId = '';
  showMore: boolean;
  filePath = environment.PhotoFileUrl;
  articles: any = [];
  page = 1;

  constructor(private service: SharedService) {
    // Create 100 users
    //const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));
    // Assign the data to the data source for the table to render;
  }

  ngOnInit(): void {
    this.userId = this.service.isLoginUser;
    this.userId = this.userId.replace(/['"]+/g, '');

    this.loadUserItem();
  }

  loadUserItem() {
    this.service.getArticleList().subscribe((data: any) => {
      this.articles = data;
      console.log(this.articles);
      this.dataSource = new MatTableDataSource(this.articles);
      console.log(this.dataSource);
      console.log(this.dataSource.paginator);
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

  requestAsk() {
    this.askBoardPkg.userId = this.userId;
    console.log(this.askBoardPkg);
    // this.service.insertArticle(this.askBoardPkg).subscribe((data: any) => {
    //   this.ngOnInit();
    // });
  }

  onDelete(id: any) {
    this.service.deleteArticle(id).subscribe((data: any) => {
      this.ngOnInit();
    });
  }
}
