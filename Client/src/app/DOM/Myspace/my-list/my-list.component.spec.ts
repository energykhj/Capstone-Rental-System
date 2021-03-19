import 'zone.js/dist/zone-testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from './../../../Services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { MyListComponent } from './my-list.component';
import { SharedService } from '../../../Services/shared.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

let userId = '51afd4fa-7b65-47fd-b62a-a4a42ff10979';

describe('MyListComponent', () => {
  let component: MyListComponent;
  let fixture: ComponentFixture<MyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyListComponent],
      providers: [
        { provide: AuthService },
        { provide: MatDialog, useValue: {} },
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        { provide: SharedService },
        JwtHelperService,
      ],
      imports: [HttpClientModule, NgbModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyListComponent);
    component = fixture.componentInstance;
    component.userItems.item = {
      name: 'Bike',
      defaultImageFile: '11b5bd7e-24fb-4d69-b035-f3feccbaca50',
      deposit: 50,
      fee: 2,
    };

    component.requestItems.item = {
      name: 'Bike',
      defaultImageFile: '11b5bd7e-24fb-4d69-b035-f3feccbaca50',
      deposit: 50,
      fee: 2,
      statusId: 1,
    };

    component.requestItems.item = {
      name: 'Bike',
      defaultImageFile: '11b5bd7e-24fb-4d69-b035-f3feccbaca50',
      deposit: 60,
      fee: 3,
      statusId: 1,
    };

    component.processingItems.item = {
      name: 'Bike',
      defaultImageFile: '11b5bd7e-24fb-4d69-b035-f3feccbaca50',
      deposit: 50,
      fee: 1,
      statusId: 2,
    };

    component.returnItems.item = {
      name: 'Bike',
      defaultImageFile: '11b5bd7e-24fb-4d69-b035-f3feccbaca50',
      deposit: 70,
      fee: 2,
      statusId: 6,
    };

    component.completedItems.item = {
      name: 'Bike',
      defaultImageFile: '11b5bd7e-24fb-4d69-b035-f3feccbaca50',
      deposit: 100,
      fee: 3,
      statusId: 7,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct My Items values', () => {
    expect(component.userItems.item.name).toEqual('Bike');
    expect(component.userItems.item.defaultImageFile).toEqual('11b5bd7e-24fb-4d69-b035-f3feccbaca50');
    expect(component.userItems.item.deposit).toEqual(50);
    expect(component.userItems.item.fee).toEqual(2);
  });

  it('should have the correct Request values', () => {
    expect(component.requestItems.item.name).toEqual('Bike');
    expect(component.requestItems.item.defaultImageFile).toEqual('11b5bd7e-24fb-4d69-b035-f3feccbaca50');
    expect(component.requestItems.item.deposit).toEqual(60);
    expect(component.requestItems.item.fee).toEqual(3);
    expect(component.requestItems.item.statusId).toEqual(1);
  });

  it('should have the correct Processing Items values', () => {
    expect(component.processingItems.item.name).toEqual('Bike');
    expect(component.processingItems.item.defaultImageFile).toEqual('11b5bd7e-24fb-4d69-b035-f3feccbaca50');
    expect(component.processingItems.item.deposit).toEqual(50);
    expect(component.processingItems.item.fee).toEqual(1);
    expect(component.processingItems.item.statusId).toEqual(2);
  });

  it('should have the correct Request Return values', () => {
    expect(component.returnItems.item.name).toEqual('Bike');
    expect(component.returnItems.item.defaultImageFile).toEqual('11b5bd7e-24fb-4d69-b035-f3feccbaca50');
    expect(component.returnItems.item.deposit).toEqual(70);
    expect(component.returnItems.item.fee).toEqual(2);
    expect(component.returnItems.item.statusId).toEqual(6);
  });

  it('should have the correct Completed Return values', () => {
    expect(component.completedItems.item.name).toEqual('Bike');
    expect(component.completedItems.item.defaultImageFile).toEqual('11b5bd7e-24fb-4d69-b035-f3feccbaca50');
    expect(component.completedItems.item.deposit).toEqual(100);
    expect(component.completedItems.item.fee).toEqual(3);
    expect(component.completedItems.item.statusId).toEqual(7);
  });
});
