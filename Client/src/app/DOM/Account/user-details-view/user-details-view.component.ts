import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/Services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-details-view',
  templateUrl: './user-details-view.component.html',
  styleUrls: ['./user-details-view.component.scss'],
})
export class UserDetailsViewComponent implements OnInit {
  PhotoFileName: string = '';
  PhotoFilePath: string = '';
  currentRate: number = 4;

  ownerDetails: {
    id: '';
    email: '';
    firstName: '';
    lastName: '';
    photourl: '';
    phone: '';
    statusId: 0;
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service: SharedService) {}

  ngOnInit(): void {
    console.log(this.data.dataKey);
    this.service.GetOwnerInfo(this.data.dataKey).subscribe(
      (data: any) => {
        if (data.details != null) {
          this.ownerDetails = data.details;
          this.PhotoFileName = data.details.photoUrl;
          if (this.PhotoFileName == '') {
            this.PhotoFileName = 'anonymous.jpg';
          }
          this.PhotoFilePath = environment.PhotoFileUrl + this.PhotoFileName;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
