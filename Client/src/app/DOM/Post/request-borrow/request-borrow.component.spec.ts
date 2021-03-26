import { RequestBorrowComponent } from './request-borrow.component';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import 'zone.js/dist/zone-testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { HttpClientModule, HttpHandler } from '@angular/common/http';

/* Angular Material */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from '../../../Helpers/angular-material.module';

/* Ngx Bootstrap */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

/* FormsModule */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Angular Flex Layout */
import { FlexLayoutModule } from '@angular/flex-layout';

/* Authenticate */
import { JwtModule } from '@auth0/angular-jwt';

/* Currency Input */
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';
/* Drag & Drop Files */
import { NgxFileDropModule } from 'ngx-file-drop';
import { AlertModule } from 'ngx-bootstrap/alert';

import { Router } from '@angular/router';
import { SharedService } from '../../../Services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';
import { TransactionStatusEnum, NotificationTypeEnum } from 'src/app/Helpers/enum';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

export const customCurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  allowZero: true,
  decimal: '.',
  precision: 2,
  prefix: 'CA$ ',
  suffix: '',
  thousands: ',',
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.FINANCIAL,
};

export function tokenGetter() {
  return localStorage.getItem('jwt');
}

describe('RequestBorrowComponent', () => {
  let component: RequestBorrowComponent;
  let fixture: ComponentFixture<RequestBorrowComponent>;

  const fakeActivatedRoute = {
    snapshot: {
      queryParamMap: {
        get(): string {
          return '1';
        },
      },
    },
  };

  const fakeRouter = {
    navigate(v: any): any {
      return;
    },
  };

  var fakeTransaction = {
    item: {
      id: 0,
      userId: 'userId',
      categoryId: 1,
      cateforyName: '',
      name: '',
      description: '',
      defaultImageFile: '',
      deposit: 100,
      fee: 10,
      startDate: new Date('03/01/2021'),
      endDate: new Date('03/31/2021'),
      addressId: 0,
      createdDate: new Date('03/01/2021'),
      timeStamp: new Date('03/01/2021'),
      statusId: 1,
      statasName: '',
    },
    trans: {
      id: 0,
      itemId: 0,
      borrowerId: '',
      borrowerName: '',
      startDate: new Date('03/20/2021'),
      endDate: new Date('03/21/2021'),
      requestDate: new Date('03/18/2021'),
      reason: '',
      total: 10,
      deposit: 100,
      refundDeposit: 100,
      currentStatus: 1,
      statausName: '',
    },
  };

  const userInfo = {
    details: {
      id: 'userId',
      firstName: 'Yi Phyo',
      lastName: 'Hong',
    },
  };

  const fakeItemPkg: any = {
    item: {
      id: 0,
      userId: 'userId',
      categoryId: 1,
      name: 'test item',
      description: 'test description',
      deposit: 100.0,
      fee: 10.0,
      startDate: new Date('03/01/2021'),
      endDate: new Date('03/31/2021'),
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

  var fakeTransMode = 0;

  const fakeService = {
    isLoginUser: 'usuerId',
    getTransactionByUser(val: any, status: any): Observable<any> {
      var transactions: any[] = [];
      if (fakeTransMode == 0) {
        for (var i = 0; i < status.length; i++) {
          var trans = JSON.parse(JSON.stringify(fakeTransaction)); //deep copy
          trans.item.name = 'item of status ' + status[i];
          trans.trans.currentStatus = status[i];
          transactions.push(trans);
        }
      } else if (fakeTransMode != 0) {
        for (var i = 0; i < status.length; i++) {
          if (fakeTransMode == status[i]) {
            var trans = JSON.parse(JSON.stringify(fakeTransaction)); //deep copy
            trans.item.name = 'item of status ' + fakeTransMode;
            trans.trans.currentStatus = fakeTransMode;
            transactions.push(trans);
          }
        }
      }

      //console.log(fakeTransMode);
      //console.log('getTransactionByUser:' + fakeTransMode);
      return of(transactions);
    },
    getOwnerInfo(userId) {
      //console.log('getOwnerInfo:');
      //console.log(userInfo);
      return of(userInfo);
    },
    getItem(itemId) {
      //console.log('getItem:');
      //console.log(fakeItemPkg);
      return of(fakeItemPkg);
    },
    getItemBorrowedDate(itemId) {
      //console.log('getItemBorrowedDate:');
      //console.log([fakeTransaction.trans]);
      return of([fakeTransaction.trans]);
    },
    // getOwnerDetails(userId) {
    //   console.log('getOwnerDetails:' + userInfo);
    //   return of(userInfo);
    // },
    getItemPhotos(itemId) {
      //console.log('getItemPhotos:' + [{ fileName: 'photoaddr' }]);
      return of([{ fileName: 'photoaddr' }]);
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestBorrowComponent],
      providers: [
        { provide: Router, useValue: fakeRouter },
        { provide: SharedService, useValue: fakeService },
        { provide: MatDialog, useValue: {} },
        { provide: FormBuilder },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
      ],
      imports: [
        //RouterTestingModule.withRoutes(routes),
        //HttpClientTestingModule,
        BrowserModule,
        //AppRoutingModule,
        BrowserAnimationsModule,
        AngularMaterialModule,

        ReactiveFormsModule,
        FormsModule,
        FlexLayoutModule,
        NgbModule,
        HttpClientModule,

        CarouselModule.forRoot(),
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        ButtonsModule.forRoot(),
        BsDatepickerModule.forRoot(),
        AlertModule.forRoot(),

        JwtModule.forRoot({
          config: {
            tokenGetter: tokenGetter,
            allowedDomains: ['localhost:4200'],
            disallowedRoutes: [],
          },
        }),

        NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
        NgxFileDropModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestBorrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display item data for borrowing', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain('test item');
    expect(compiled.innerHTML).toContain('test description');
    expect(compiled.innerHTML).toContain('100.00');
    expect(compiled.innerHTML).toContain('10.00');
    expect(compiled.innerHTML).toContain('3/1/2021 ~ 3/31/2021');
  });

  it('should display Preview button', () => {
    let button = fixture.debugElement.nativeElement.querySelector('button');
    expect(button.innerHTML).toContain('Preview');
  });

  it('should display reservation error if reservations exist', () => {
    component.onSubmit();
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain('Some Dates are already reserved');
  });

  it('should display preview date after click preview button', () => {
    component.itemTransactions = []; // no reservation
    component.onSubmit();
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain('Days');
    expect(compiled.innerHTML).toContain('13');
    expect(compiled.innerHTML).toContain('day(s)');
    expect(compiled.innerHTML).toContain('Total fee');
    expect(compiled.innerHTML).toContain('130.00');
    expect(compiled.innerHTML).toContain('Deposit');
    expect(compiled.innerHTML).toContain('100.00');
  });

  it('should display Borrow button after click Preview', () => {
    component.itemTransactions = []; // no reservation
    component.onSubmit();
    fixture.detectChanges();

    let button = fixture.debugElement.nativeElement.querySelector('button');
    expect(button.innerHTML).toContain('Borrow');
  });
});
