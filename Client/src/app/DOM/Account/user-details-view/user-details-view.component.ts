import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/Services/shared.service';
import { environment } from 'src/environments/environment';
import { FormatUtils } from 'src/app/Helpers/format-utils';

@Component({
  selector: 'app-user-details-view',
  templateUrl: './user-details-view.component.html',
  styleUrls: ['./user-details-view.component.scss'],
})
export class UserDetailsViewComponent implements OnInit {
  PhotoFileName: string = '';
  PhotoFilePath: string = '';
  currentRate: number = 0;
  historyCount: number = 0;
  isLoading: boolean = true;
  isLender: boolean = false;

  ownerDetails: any = {
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    photourl: '',
    phone: '',
    statusId: 0,
  };

  formatDate = FormatUtils.formatDate;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service: SharedService) {}

  ngOnInit(): void {
    //console.log(this.data.dataKey);
    this.isLender = this.data.isLender;
    this.service.getOwnerInfo(this.data.dataKey).subscribe(
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
    if (this.isLender == true) {
      this.service.getOwnerRateAndItems(this.data.dataKey).subscribe((data: any) => {
        this.historyCount = data[0];
        this.currentRate = data[1];
        this.isLoading = false;
      });
    }
  }
}
