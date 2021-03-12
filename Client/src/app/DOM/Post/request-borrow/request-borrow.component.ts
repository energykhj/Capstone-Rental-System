import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DateValidator } from 'src/app/DOM/Shared/validators/date.validator';
import { ParentErrorStateMatcher } from 'src/app/DOM/Shared/validators';
import { environment } from 'src/environments/environment';
import { DetailComponent } from 'src/app/DOM/Main/detail/detail.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/Services/shared.service';
import { UserDetailsViewComponent } from 'src/app/DOM/Account/user-details-view/user-details-view.component';
import { TransactionStatusEnum } from 'src/app/Helpers/enum';
import { FormatUtils } from 'src/app/Helpers/format-utils';
@Component({
  selector: 'app-request-borrow',
  templateUrl: './request-borrow.component.html',
  styleUrls: ['./request-borrow.component.scss'],
})
export class RequestBorrowComponent implements OnInit {
  parentErrorStateMatcher = new ParentErrorStateMatcher();

  @Input() public itemId: string;
  borrowItemForm: FormGroup;
  isPreview: boolean;
  isSubmitPressed: boolean;

  itemDefaultPhotoUrl: any;
  noImagePhotoUrl: string = environment.PhotoFileUrl + 'noImage.png';
  userId: string;
  diffDays: number = 0;
  showMore: boolean;
  maxTextViewLen: number = 50;

  formatDate = FormatUtils.formatDate;
  formatCurrency = FormatUtils.formatCurrency;

  ownerDetails: any = {
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    photourl: '',
    phone: '',
    statusId: 0,
  };

  itemPkg: any = {
    item: {
      id: 0,
      userId: '',
      categoryId: 1,
      name: '',
      description: '',
      deposit: 0.0,
      fee: 0.0,
      startDate: new Date(),
      endDate: new Date(),
      //addressId: 0,
    },
    address: {
      id: 0,
      userId: '',
      isDefault: false,
      address1: '',
      address2: '',
      city: '',
      provinceId: 1,
      postalCode: '',
    },
  };

  transactionPkg: any = {
    trans: {
      id: 0,
      itemId: 0,
      borrowerId: '',
      borrowerName: '',
      startDate: new Date(),
      endDate: new Date(),
      requestDate: new Date(),
      refundDeposit: 0,
      currentStatus: TransactionStatusEnum.Request,
      statusName: '',
      total: 0,
      deposit: 0,
    },
    tranDetails: {
      id: 0,
      transactionId: 0,
      statusId: 1,
      statusName: '',
      reason: '',
      date: new Date(),
    },
  };

  validation_messages = {
    startDate: [{ type: 'required', message: 'Start Date is required' }],
    endDate: [
      { type: 'required', message: 'End Date is required' },
      { type: 'dateOrder', message: 'End Date should be greater than or equal Start Date' },
    ],
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private service: SharedService
  ) {
    this.isPreview = false;
    this.isSubmitPressed = false;
    this.showMore = false;

    if (this.service.isLoginUser) {
      this.userId = this.service.isLoginUser;
      this.userId = this.userId.replace(/['"]+/g, '');
    } else {
      this.router.navigate(['/main']);
    }
  }

  ngOnInit(): void {
    this.itemId = this.route.snapshot.queryParamMap.get('itemId');
    this.createBorrowItemForm();
    this.setFormData();

    if (this.itemId != null) {
      this.loadItemPkg(this.itemId);
      this.loadDefaultPhotoAddr(this.itemId);
    }
  }

  createBorrowItemForm() {
    this.borrowItemForm = this.fb.group({
      //      priceInfo: this.fb.group({
      borrowInfo: new FormGroup(
        {
          startDate: new FormControl('', Validators.required),
          endDate: new FormControl('', Validators.required),
        },

        (formGroup: FormGroup) => {
          var ret = DateValidator.compareDate(formGroup, 'startDate', 'endDate');
          return ret;
        }
      ),
    });
  }

  get borrowInfo() {
    return this.borrowItemForm.controls.borrowInfo as FormGroup;
  }

  getFormData() {
    this.transactionPkg.trans.startDate = this.borrowInfo.get('startDate').value;
    this.transactionPkg.trans.endDate = this.borrowInfo.get('endDate').value;
  }

  setFormData() {
    this.borrowInfo.get('startDate').setValue(this.transactionPkg.trans.startDate);
    this.borrowInfo.get('endDate').setValue(this.transactionPkg.trans.endDate);
  }

  loadItemPkg(itemId: string) {
    this.service.getItem(itemId).subscribe((data: any) => {
      this.itemPkg = {
        item: data.item,
        address: data.address,
      };

      this.itemPkg.item.startDate = new Date(data.item.startDate);
      this.itemPkg.item.endDate = new Date(data.item.endDate);

      this.transactionPkg.trans.startDate = this.itemPkg.item.startDate;
      this.transactionPkg.trans.endDate = this.itemPkg.item.endDate;

      if (this.itemPkg.item.userId) {
        this.getOwnerDetails();
      }

      this.setFormData();
    });
  }

  loadDefaultPhotoAddr(itemId: string) {
    this.service.getItemPhotos(itemId).subscribe(
      (data) => {
        data.forEach((element) => {
          this.itemDefaultPhotoUrl = environment.PhotoFileUrl + element.fileName;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getOwnerDetails() {
    this.service.GetOwnerInfo(this.itemPkg.item.userId).subscribe(
      (data: any) => {
        if (data.details != null) {
          this.ownerDetails = data.details;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

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

  openOwnerDetails(id: any) {
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

  onSubmit() {
    this.isSubmitPressed = true;

    if (this.borrowInfo.invalid) {
      return;
    }

    // TODO: Check other reservations of same item
    // 1. ItemId -> reserved [{start,end}, {start,end},..]

    this.transactionPkg.trans.itemId = parseInt(this.itemId);
    this.transactionPkg.trans.borrowerId = this.userId;
    this.transactionPkg.trans.deposit = this.itemPkg.item.deposit;
    this.transactionPkg.trans.currentStatus = 1;
    this.getFormData();

    this.diffDays =
      FormatUtils.dateDiffInDays(this.transactionPkg.trans.startDate, this.transactionPkg.trans.endDate) + 1;

    this.transactionPkg.trans.total = this.diffDays * this.itemPkg.item.fee;

    this.isPreview = true;
  }

  onBorrow() {
    if (this.borrowInfo.invalid == false) {
      this.service.insertTransaction(this.transactionPkg).subscribe((data: any) => {
        console.log(data);
        this.service.Alert('success', 'Send Request Borrow');
        //this.router.navigate(['/main']);
      });
    }
  }

  onCancel() {
    this.isPreview = false;
    this.showMore = false;
  }

  trimString(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }
}
