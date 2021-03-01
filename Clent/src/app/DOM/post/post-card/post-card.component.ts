import { DetailComponent } from './../../Main/detail/detail.component';
import { Component, Input, OnInit } from '@angular/core';
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit {
  @Input() property: any;
  PhotoFilePath: string = '';

  constructor(public dialog: MatDialog, private router: Router) {
    this.PhotoFilePath = environment.PhotoFileUrl;
  }

  ngOnInit(): void {}

  openDetail(id: any) {
    const dialogRef = this.dialog.open(DetailComponent, {
      // height: '500px',
      width: '600px',
      data: {
        dataKey: id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onclickDetails(id: any) {
    this.router.navigate(['/post'], {
      queryParams: {
        itemId: id,
      },
    });
  }
}
