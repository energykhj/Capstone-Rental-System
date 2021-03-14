import 'zone.js/dist/zone-testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from './../../../Services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { MyListComponent } from './my-list.component';

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
        JwtHelperService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
