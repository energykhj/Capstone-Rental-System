import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import 'zone.js/dist/zone-testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

/* DOM Components */
//import { AppRoutingModule } from '../../../app-routing.module';
//import { PostComponent } from '../../../DOM/post/post.component';
import { AddEditPostComponent } from '../../../DOM/post/add-edit-post/add-edit-post.component';

/* Angular Material */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from '../../../DOM/Shared/angular-material.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/* Ngx Bootstrap */
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
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
import { AuthService } from '../../../Services/auth.service';
import { UserAccountComponent } from '../../../DOM/Account/user-account/user-account.component';
import { AvatarComponent } from '../../../Helpers/avatar/avatar.component';
import { UserDetailsComponent } from '../../../DOM/Account/user-details/user-details.component';
import { AskComponent } from '../../../DOM/ask/ask.component';
import { PostCardComponent } from '../../../DOM/post/post-card/post-card.component';
import { MapsComponent } from '../../..//DOM/Navigation/maps/maps.component';
//import { UserdetailsComponent } from './Dom/Accont/userdetails/userdetails.component';

/* Currency Input */
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";
/* Drag & Drop Files */
import { NgxFileDropModule } from 'ngx-file-drop';
import { AlertsComponent } from '../../../DOM/Shared/alerts/alerts.component';
import { AlertModule } from 'ngx-bootstrap/alert';

import { Component, HostListener, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { SharedService } from '../../../Services/shared.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { DateValidator, ParentErrorStateMatcher} from 'src/app/validators';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ".",
  precision: 2,
  prefix: "CA$ ",
  suffix: "",
  thousands: ",",
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};

export function tokenGetter(){
  return localStorage.getItem("jwt");
}

describe('AddEditPostComponent', () => {
  let component: AddEditPostComponent;
  let fixture: ComponentFixture<AddEditPostComponent>;
  //let httpMock: HttpTestingController;

  const fakeActivatedRoute = {
    snapshot: {
      queryParamMap: {
            get(): string {
                return null;// "32";
            },
        },
    },
  };

  const fakeRouter = {
    navigate(v: any): any {
      return;
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditPostComponent ],
      providers: [ 
        {provide: FormBuilder},
        {provide: Router, useValue: fakeRouter},
        {provide: ActivatedRoute, useValue: fakeActivatedRoute},
        {provide: SharedService},
        {provide: MatDialog, useValue: {}},
        {provide: DomSanitizer},
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
            allowedDomains: ["localhost:4200"],
            disallowedRoutes: []
          }
        }),
    
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
        NgxFileDropModule,
      ],
      schemas:      [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    //console.log("Trying to wait after the test");
    //setTimeout(() => { }, 1000);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Form Rendering: FormControl
  it('should render input 12 elements', () => {
    const compiled = fixture.debugElement.nativeElement;
    const categoryIdInput = compiled.querySelector('select[formControlName="categoryId"]');
    const nameInput = compiled.querySelector('input[formControlName="name"]');
    const descriptionInput = compiled.querySelector('textarea[formControlName="description"]');

    const depositInput = compiled.querySelector('input[formControlName="deposit"]');
    const feeInput = compiled.querySelector('input[formControlName="fee"]');
    const startDateInput = compiled.querySelector('input[formControlName="startDate"]');
    const endDateInput = compiled.querySelector('input[formControlName="endDate"]');

    const address1Input = compiled.querySelector('input[formControlName="address1"]');
    const address2Input = compiled.querySelector('input[formControlName="address2"]');
    const cityInput = compiled.querySelector('input[formControlName="city"]');
    const provinceIdInput = compiled.querySelector('select[formControlName="provinceId"]');
    const postalCodeInput = compiled.querySelector('input[formControlName="postalCode"]');

    expect(categoryIdInput).toBeTruthy();
    expect(nameInput).toBeTruthy();
    expect(descriptionInput).toBeTruthy();

    expect(depositInput).toBeTruthy();
    expect(feeInput).toBeTruthy();
    expect(startDateInput).toBeTruthy();
    expect(endDateInput).toBeTruthy();

    expect(address1Input).toBeTruthy();
    expect(address2Input).toBeTruthy();
    expect(cityInput).toBeTruthy();
    expect(provinceIdInput).toBeTruthy();
    expect(postalCodeInput).toBeTruthy();
  });

  // Form Validity
  it('should test form validity (12 inputs)', () => {
    component.basicInfo.get("name").setValue(null);
    
    expect(component.addItemForm.controls.basicInfo.valid).toBeFalsy();

    component.basicInfo.get("categoryId").setValue(1);
    component.basicInfo.get("name").setValue("name");
    component.basicInfo.get("description").setValue("description");

    component.priceInfo.get("deposit").setValue(10);
    component.priceInfo.get("fee").setValue(1);
    component.priceInfo.get("startDate").setValue(new Date());
    component.priceInfo.get("endDate").setValue(new Date());

    component.addressInfo.get("address1").setValue("address1");
    component.addressInfo.get("address2").setValue("address2");
    component.addressInfo.get("city").setValue("city");
    component.addressInfo.get("provinceId").setValue(1);
    component.addressInfo.get("postalCode").setValue("N2V2W3");

    expect(component.addItemForm.controls.basicInfo.valid).toBeTruthy();
  })


  // Input Validity: required
  it('should test input validity (12 inputs)', () => {
    component.basicInfo.get("categoryId").setValue(null);
    component.basicInfo.get("name").setValue(null);
    component.basicInfo.get("description").setValue(null);

    component.priceInfo.get("deposit").setValue(null);
    component.priceInfo.get("fee").setValue(null);
    component.priceInfo.get("startDate").setValue(null);
    component.priceInfo.get("endDate").setValue(null);

    component.addressInfo.get("address1").setValue(null);
    component.addressInfo.get("address2").setValue(null);
    component.addressInfo.get("city").setValue(null);
    component.addressInfo.get("provinceId").setValue(null);
    component.addressInfo.get("postalCode").setValue(null);

    expect(component.basicInfo.get("categoryId").valid).toBeFalsy();
    expect(component.basicInfo.get("name").valid).toBeFalsy();
    expect(component.basicInfo.get("description").valid).toBeFalsy();

    expect(component.priceInfo.get("deposit").valid).toBeFalsy();
    expect(component.priceInfo.get("fee").valid).toBeFalsy();
    expect(component.priceInfo.get("startDate").valid).toBeFalsy();
    expect(component.priceInfo.get("endDate").valid).toBeFalsy();

    expect(component.addressInfo.get("address1").valid).toBeFalsy();
    expect(component.addressInfo.get("address2").valid).toBeTruthy(); //Nullable
    expect(component.addressInfo.get("city").valid).toBeFalsy();
    expect(component.addressInfo.get("provinceId").valid).toBeFalsy();
    expect(component.addressInfo.get("postalCode").valid).toBeFalsy();

    component.basicInfo.get("categoryId").setValue(1);
    component.basicInfo.get("name").setValue("name");
    component.basicInfo.get("description").setValue("description");

    component.priceInfo.get("deposit").setValue(10);
    component.priceInfo.get("fee").setValue(1);
    component.priceInfo.get("startDate").setValue(new Date());
    component.priceInfo.get("endDate").setValue(new Date());

    component.addressInfo.get("address1").setValue("address1");
    component.addressInfo.get("address2").setValue("address2");
    component.addressInfo.get("city").setValue("city");
    component.addressInfo.get("provinceId").setValue(1);
    component.addressInfo.get("postalCode").setValue("N2V2W3");

    expect(component.basicInfo.get("categoryId").valid).toBeTruthy();
    expect(component.basicInfo.get("name").valid).toBeTruthy();
    expect(component.basicInfo.get("description").valid).toBeTruthy();

    expect(component.priceInfo.get("deposit").valid).toBeTruthy();
    expect(component.priceInfo.get("fee").valid).toBeTruthy();
    expect(component.priceInfo.get("startDate").valid).toBeTruthy();
    expect(component.priceInfo.get("endDate").valid).toBeTruthy();

    expect(component.addressInfo.get("address1").valid).toBeTruthy();
    expect(component.addressInfo.get("address2").valid).toBeTruthy();
    expect(component.addressInfo.get("city").valid).toBeTruthy();
    expect(component.addressInfo.get("provinceId").valid).toBeTruthy();
    expect(component.addressInfo.get("postalCode").valid).toBeTruthy();
  })

  // Input Errors
  it('should test input errors (12 inputs)', () => {
    component.basicInfo.get("categoryId").setValue(null);
    component.basicInfo.get("name").setValue(null);
    component.basicInfo.get("description").setValue(null);

    component.priceInfo.get("deposit").setValue(null);
    component.priceInfo.get("fee").setValue(null);
    component.priceInfo.get("startDate").setValue(null);
    component.priceInfo.get("endDate").setValue(null);

    component.addressInfo.get("address1").setValue(null);
    component.addressInfo.get("address2").setValue(null);
    component.addressInfo.get("city").setValue(null);
    component.addressInfo.get("provinceId").setValue(null);
    component.addressInfo.get("postalCode").setValue(null);

    const categoryIdInput = component.basicInfo.get("categoryId");
    const nameInput = component.basicInfo.get("name");
    const descriptionInput = component.basicInfo.get("description");

    const depositInput = component.priceInfo.get("deposit");
    const feeInput = component.priceInfo.get("fee");
    const startDateInput = component.priceInfo.get("startDate");
    const endDateInput = component.priceInfo.get("endDate");

    const address1Input = component.addressInfo.get("address1");
    const address2Input = component.addressInfo.get("address2");
    const cityInput = component.addressInfo.get("city");
    const provinceIdInput = component.addressInfo.get("provinceId");
    const postalCodeInput = component.addressInfo.get("postalCode");

    expect(categoryIdInput.errors.required).toBeTruthy();
    expect(nameInput.errors.required).toBeTruthy();
    expect(descriptionInput.errors.required).toBeTruthy();

    expect(depositInput.errors.required).toBeTruthy();
    expect(feeInput.errors.required).toBeTruthy();
    expect(startDateInput.errors.required).toBeTruthy();
    expect(endDateInput.errors.required).toBeTruthy();

    expect(address1Input.errors.required).toBeTruthy();
    //expect(address2Input.errors.required).toBeFalsy(); //Nullable
    expect(cityInput.errors.required).toBeTruthy();
    expect(provinceIdInput.errors.required).toBeTruthy();
    expect(postalCodeInput.errors.required).toBeTruthy();

    categoryIdInput.setValue(1);
    nameInput.setValue("name");
    descriptionInput.setValue("description");

    depositInput.setValue(10);
    feeInput.setValue(1);
    startDateInput.setValue(new Date());
    endDateInput.setValue(new Date());

    address1Input.setValue("address1");
    address2Input.setValue("address2");
    cityInput.setValue("city");
    provinceIdInput.setValue(1);
    postalCodeInput.setValue("N2V2W3");

    expect(categoryIdInput.errors).toBeNull();
    expect(nameInput.errors).toBeNull();
    expect(descriptionInput.errors).toBeNull();

    expect(depositInput.errors).toBeNull();
    expect(feeInput.errors).toBeNull();
    expect(startDateInput.errors).toBeNull();
    expect(endDateInput.errors).toBeNull();

    expect(address1Input.errors).toBeNull();
    expect(address2Input.errors).toBeNull();
    expect(cityInput.errors).toBeNull();
    expect(provinceIdInput.errors).toBeNull();
    expect(postalCodeInput.errors).toBeNull();
  });

  // Postal Code Validity
  it('should test postal code validity', () => {
    component.addressInfo.get("postalCode").setValue("123456");
    expect(component.addressInfo.get("postalCode").valid).toBeFalsy();

    component.addressInfo.get("postalCode").setValue("Z2Z2Z2");
    expect(component.addressInfo.get("postalCode").valid).toBeFalsy();

    component.addressInfo.get("postalCode").setValue("N2V2W3");
    expect(component.addressInfo.get("postalCode").valid).toBeTruthy();

    component.addressInfo.get("postalCode").setValue("N2V 2W3");
    expect(component.addressInfo.get("postalCode").valid).toBeTruthy();
  })

  //Start / End Date Validity
  it('should start date less than or equal end date', () => {
    component.priceInfo.get("startDate").setValue(new Date("2021-02-02"));
    component.priceInfo.get("endDate").setValue(new Date("2021-02-01"));
    expect(component.priceInfo.errors.dateOrder).toBeTruthy();

    component.priceInfo.get("startDate").setValue(new Date("2021-02-01"));
    component.priceInfo.get("endDate").setValue(new Date("2021-02-02"));
    expect(component.priceInfo.errors).toBeNull();

    component.priceInfo.get("startDate").setValue(new Date("2021-02-01"));
    component.priceInfo.get("endDate").setValue(new Date("2021-02-01"));
    expect(component.priceInfo.errors).toBeNull();
  })

  // it('load itemId', () => {
  //   //component.itemId = "2";
  //   //component.userId = "8f92e1b8-3a09-4b84-b1d8-d019f7c94987";
  //   //component.itemPkg.item.name = "Test";
  //   component.basicInfo.get("name").setValue('Karma Test');
    
  //   //fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
  //   //tick();
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.innerHTML).toContain("2");
  //   //expect(component.userId).toEqual("8f92e1b8-3a09-4b84-b1d8-d019f7c94987");
  //   console.log(component.userId);
  //   console.log(component.itemPkg.item.userId);
  //   console.log(component.itemPkg.address.userId);
  //   console.log(component.itemPkg.item.categoryId);
  // });

  // it('testing form the proper way', fakeAsync(() => {
  //   let name: string = 'Karma Test';
  //   component.basicInfo.get("name").setValue(name);
  //   // This first detectChanges is necessary to properly set up the form
  //   fixture.detectChanges();

  //   // Tick needs to be called in order for form controls to be registered properly.
  //   tick();
    
  //   //component.onSubmit();
  //   fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);

  //   //expect(component.submitted).toEqual(false);
  //   expect(component.basicInfo.get("name").value).toEqual(name);
  // }));
});
