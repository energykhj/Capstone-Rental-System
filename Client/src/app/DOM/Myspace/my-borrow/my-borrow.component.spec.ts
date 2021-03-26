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
import { MyBorrowComponent } from './my-borrow.component';

describe('MyBorrowComponent', () => {
  let component: MyBorrowComponent;
  let fixture: ComponentFixture<MyBorrowComponent>;

  const fakeActivatedRoute = {
    snapshot: {
      queryParamMap: {
        get(): string {
          return null; // "32";
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
      userId: '',
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
      firstName: 'Yi Phyo',
      lastName: 'Hong',
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
      return of(transactions);
    },
    getOwnerInfo(userId) {
      return of(userInfo);
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyBorrowComponent],
      providers: [
        { provide: Router, useValue: fakeRouter },
        { provide: SharedService, useValue: fakeService },
        { provide: MatDialog, useValue: {} },
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
    fixture = TestBed.createComponent(MyBorrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create a component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain item of Request status in Requested Tab', () => {
    fakeTransMode = TransactionStatusEnum.Request;
    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain('item of status 1');
  });

  it('should contain item of Confirmed status in Borrowing Tab', () => {
    fakeTransMode = TransactionStatusEnum.Confirmed;
    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain('item of status 2');
  });

  it('should contain item of RequestReturn status in Borrowing Tab', () => {
    fakeTransMode = TransactionStatusEnum.RequestReturn;
    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain('item of status 6');
  });

  it('should contain item of Rejected status in Completed Tab', () => {
    fakeTransMode = TransactionStatusEnum.Rejected;
    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain('item of status 3');
  });

  it('should contain item of CanceledByLender status in Completed Tab', () => {
    fakeTransMode = TransactionStatusEnum.CanceledByLender;
    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain('item of status 4');
  });

  it('should contain item of CanceledByBorrower status in Completed Tab', () => {
    fakeTransMode = TransactionStatusEnum.CanceledByBorrower;
    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain('item of status 5');
  });

  it('should contain item of ReturnComplete status in Completed Tab', () => {
    fakeTransMode = TransactionStatusEnum.ReturnComplete;
    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain('item of status 7');
  });

  it('should display Owner Name, Request/Start/End Dates, Deposit, Total Fee in Requested Tab', () => {
    fakeTransMode = TransactionStatusEnum.Request;
    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain('Borrow from');
    expect(compiled.innerHTML).toContain('Yi Phyo Hong');
    expect(compiled.innerHTML).toContain('Request date:');
    expect(compiled.innerHTML).toContain('3/18/2021');
    expect(compiled.innerHTML).toContain('When:');
    expect(compiled.innerHTML).toContain('3/20/2021 ~ 3/21/2021');
    expect(compiled.innerHTML).toContain('Deposit:');
    expect(compiled.innerHTML).toContain('100.00');
    expect(compiled.innerHTML).toContain('Total Fee:');
    expect(compiled.innerHTML).toContain('10.00');
  });

  it('should display Owner Name, Request/Start/End Dates, Deposit, Total Fee in Borrowing Tab', () => {
    fakeTransMode = TransactionStatusEnum.Confirmed;
    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain('Borrow from');
    expect(compiled.innerHTML).toContain('Yi Phyo Hong');
    expect(compiled.innerHTML).toContain('Request date:');
    expect(compiled.innerHTML).toContain('3/18/2021');
    expect(compiled.innerHTML).toContain('When:');
    expect(compiled.innerHTML).toContain('3/20/2021 ~ 3/21/2021');
  });

  it('should display Owner Name, Request/Start/End Dates, Deposit, Total Fee in Completed Tab', () => {
    fakeTransMode = TransactionStatusEnum.ReturnComplete;
    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain('Borrow from');
    expect(compiled.innerHTML).toContain('Yi Phyo Hong');
    expect(compiled.innerHTML).toContain('Request date:');
    expect(compiled.innerHTML).toContain('3/18/2021');
    expect(compiled.innerHTML).toContain('When:');
    expect(compiled.innerHTML).toContain('3/20/2021 ~ 3/21/2021');
  });

  it('item of Request status should contain Cancel Request button', () => {
    fakeTransMode = TransactionStatusEnum.Request;
    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain('Cancel Request');
  });

  it('item of Confirmed status should contain Cancel Borrow and Request Return button', () => {
    fakeTransMode = TransactionStatusEnum.Confirmed;
    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain('Cancel Borrow');
    expect(compiled.innerHTML).toContain('Request Return');
  });

  it('item of RequestReturn status should not contain Cancel Borrow and Request Return button', () => {
    fakeTransMode = TransactionStatusEnum.RequestReturn;
    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).not.toContain('Cancel Borrow');
    expect(compiled.innerHTML).not.toContain('Request Return');
  });

  it('Cancel Request Button method should be called', fakeAsync(() => {
    fakeTransMode = TransactionStatusEnum.Request;
    component.ngOnInit();
    fixture.detectChanges();

    spyOn(component, 'onCancelRequest');

    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    tick();

    fixture.whenStable().then(() => {
      expect(component.onCancelRequest).toHaveBeenCalled();
    });
  }));

  it('Cancel Borrow Button method should be called', fakeAsync(() => {
    fakeTransMode = TransactionStatusEnum.Confirmed;
    component.ngOnInit();
    fixture.detectChanges();

    spyOn(component, 'onCancelReservation');

    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    tick();

    fixture.whenStable().then(() => {
      expect(component.onCancelReservation).toHaveBeenCalled();
    });
  }));

  it('Request Return Button method should be called', fakeAsync(() => {
    fakeTransMode = TransactionStatusEnum.Confirmed;
    component.ngOnInit();
    fixture.detectChanges();

    spyOn(component, 'onRequestReturn');

    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    tick();

    fixture.whenStable().then(() => {
      expect(component.onRequestReturn).toHaveBeenCalled();
    });
  }));
});
