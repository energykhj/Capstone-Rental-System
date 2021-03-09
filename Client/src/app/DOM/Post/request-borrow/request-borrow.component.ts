import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DateValidator } from 'src/app/DOM/Shared/validators/date.validator';
import { ParentErrorStateMatcher } from 'src/app/DOM/Shared/validators';
import { environment, customCurrencyMaskConfig } from 'src/environments/environment';
import { DetailComponent } from 'src/app/DOM/Main/detail/detail.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/Services/shared.service';
import { UserDetailsViewComponent } from 'src/app/DOM/Account/user-details-view/user-details-view.component';

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
  currencyPrefix: string = customCurrencyMaskConfig.prefix;
  currencyPrecision: number = customCurrencyMaskConfig.precision;

  itemDefaultPhotoUrl: any;
  noImagePhotoUrl: string = environment.PhotoFileUrl + 'noImage.png';
  userId: string;
  diffDays: number = 0;
  showMore: boolean;
  maxTextViewLen: number = 50;

  ownerDetails: {
    id: '';
    email: '';
    firstName: '';
    lastName: '';
    photourl: '';
    phone: '';
    statusId: 0;
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
    id: 0,
    itemId: 0,
    borrowerId: '',
    startDate: new Date(),
    endDate: new Date(),
    refundDeposit: 0,
    statusId: 1, //1 = Request
    total: 0,
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
    this.createborrowItemForm();
    this.setFormData();

    if (this.itemId != null) {
      this.loadItemPkg(this.itemId);
      this.loadDefaultPhotoAddr(this.itemId);
    }
  }

  createborrowItemForm() {
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
    this.transactionPkg.startDate = this.borrowInfo.get('startDate').value;
    this.transactionPkg.endDate = this.borrowInfo.get('endDate').value;
  }

  setFormData() {
    this.borrowInfo.get('startDate').setValue(this.transactionPkg.startDate);
    this.borrowInfo.get('endDate').setValue(this.transactionPkg.endDate);
  }

  loadItemPkg(itemId: string) {
    this.service.getItem(itemId).subscribe((data: any) => {
      this.itemPkg = {
        item: data.item,
        address: data.address,
      };

      this.itemPkg.item.startDate = new Date(data.item.startDate);
      this.itemPkg.item.endDate = new Date(data.item.endDate);

      this.transactionPkg.startDate = this.itemPkg.item.startDate;
      this.transactionPkg.endDate = this.itemPkg.item.endDate;

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

  // a and b are javascript Date objects
  dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
  }

  onSubmit() {
    this.isSubmitPressed = true;

    if (this.borrowInfo.invalid) {
      return;
    }

    // TODO: Check other reservations of same item

    this.transactionPkg.itemId = this.itemId;
    this.transactionPkg.borrowerId = this.userId;
    this.transactionPkg.refundDeposit = this.itemPkg.item.deposit;
    this.transactionPkg.statusId = 1;
    this.getFormData();

    var date1 = new Date(this.transactionPkg.startDate);
    var date2 = new Date(this.transactionPkg.endDate);
    this.diffDays = this.dateDiffInDays(date1, date2) + 1;

    this.transactionPkg.total = this.diffDays * this.itemPkg.item.fee;

    this.isPreview = true;
  }

  onBorrow() {
    if (this.borrowItemForm.invalid) {
      return;
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
