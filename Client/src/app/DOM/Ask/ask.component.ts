import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SharedService } from 'src/app/Services/shared.service';
import { environment } from 'src/environments/environment';
import { UserDetailsViewComponent } from 'src/app/DOM/Account/user-details-view/user-details-view.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/DOM/Shared/confirm-dialog/confirm-dialog.component';
import { EditDialogComponent } from '../Shared/edit-dialog/edit-dialog.component';

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
  content: string;

  askBoardPkg: any = {
    date: new Date(),
    title: '',
    description: '',
    userId: '',
  };

  askEditPkg: any = {
    id: 0,
    date: new Date(),
    title: '',
    description: '',
    userId: '',
    parentId: 0,
  };

  active = 1;
  displayedColumns: string[] = ['id', 'userName', 'title', 'date', 'edit'];
  dataSource: MatTableDataSource<Article>;
  expandedElement: Article | null;

  //@ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }
  @ViewChild(MatSort) sort: MatSort;

  userId = '';
  showMore: boolean;
  filePath = environment.PhotoFileUrl;
  articles: any = [];
  page = 1;
  count = 0;

  constructor(private service: SharedService, public dialog: MatDialog) {
    // Create 100 users
    //const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));
    // Assign the data to the data source for the table to render;
  }

  ngOnInit(): void {
    this.userId = this.service.isLoginUser;
    this.userId = this.userId.replace(/['"]+/g, '');

    this.askBoardPkg.title = '';
    this.askBoardPkg.description = '';
    this.content = '';
    this.loadUserItem();
  }

  loadUserItem() {
    this.service.getArticleList().subscribe((data: any) => {
      this.articles = data;
      this.dataSource = new MatTableDataSource(this.articles);
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
    this.askBoardPkg.description = this.content;
    console.log(this.askBoardPkg);
    this.service.insertArticle(this.askBoardPkg).subscribe((data: any) => {
      this.ngOnInit();
    });
  }

  onDelete(id: any) {
    this.count = 0;
    this.service.getArticleWithReply(id).subscribe((data: any) => {
      this.count = data.length - 1;
      if (this.count > 0) this.service.alert('success', 'This asked content cannot be deleted because a reply exists.');
      else {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {
            title: 'Confirm deletion',
            message: 'Want to delete the asked content?<br/> Click Yes, The asked content will be deleted',
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.service.deleteArticle(id).subscribe((data: any) => {
              this.ngOnInit();
            });
          }
        });
      }
    });
  }

  onChange(content: string) {
    this.content = content;
  }

  openBorrowerDetails(id: any) {
    const dialogRef = this.dialog.open(UserDetailsViewComponent, {
      // height: '500px',
      width: '300px',
      data: {
        dataKey: id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onEdit(id: number, content: string, title: string) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      height: '250px',
      width: '800px',
      data: {
        content: content,
      },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        this.askEditPkg.id = id;
        this.askEditPkg.userId = this.userId;
        this.askEditPkg.description = data;
        this.askEditPkg.title = title;
        this.askEditPkg.parentId = id;

        console.log(this.askEditPkg);
        this.service.updateArticle(this.askEditPkg).subscribe((data: any) => {
          this.service.alert('success', 'The content is changed.');
          this.ngOnInit();
        });
      }
    });
  }
}
