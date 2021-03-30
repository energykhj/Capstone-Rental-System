import { Article } from './../ask.component';
//import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from './../../../Services/shared.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormatUtils } from 'src/app/Helpers/format-utils';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ask-detail',
  templateUrl: './ask-detail.component.html',
  styleUrls: ['./ask-detail.component.scss'],
})
export class AskDetailComponent implements OnInit {
  //dataSource: MatTableDataSource<Article>;

  userId = '';
  rowId: any;
  path: any;
  url: any;
  name: any;
  title: any;
  articles: any = [];
  filePath = environment.PhotoFileUrl;
  formatDate = FormatUtils.formatDate;

  askReplyPkg: any = {
    date: new Date(),
    title: '',
    description: '',
    userId: '',
    parentId: 0,
  };

  constructor(private route: ActivatedRoute, private service: SharedService, private location: Location) {}

  ngOnInit(): void {
    this.userId = this.service.isLoginUser;
    this.userId = this.userId.replace(/['"]+/g, '');

    this.rowId = Number(this.route.snapshot.queryParamMap.get('rowId'));
    console.log(this.rowId);
    this.loadInitAskDetail();
  }

  loadInitAskDetail() {
    this.service.getArticleWithReply(this.rowId).subscribe((data: any) => {
      console.log(data);
      this.articles = data;
      this.title = '';
      for (let el of data) {
        if (el.id === this.rowId) this.title = el.title;
      }
      // this.dataSource = new MatTableDataSource(data);
    });
  }

  requestAskReply() {
    this.askReplyPkg.userId = this.userId;
    this.askReplyPkg.parentId = this.rowId;
    this.askReplyPkg.title = this.title;
    console.log(this.askReplyPkg);
    // this.service.insertReply(this.askReplyPkg).subscribe((data: any) => {
    //   this.ngOnInit();
    // });
  }

  onBack() {
    this.location.back();
  }
}
