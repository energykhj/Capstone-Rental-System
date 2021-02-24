import 'zone.js/dist/zone-testing';
import { AuthService } from './../../../Services/auth.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { Component, Input } from '@angular/core';

@Component({selector: 'app-post-card',template:''})
class PostCardComponent{
    @Input() property : any;
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent,
                      PostCardComponent ],
      imports:[RouterTestingModule.withRoutes([]),
               HttpClientTestingModule],
      providers: [{provide: AuthService},
                  {provide: MatDialog, useValue: {}},
                  { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
                  JwtHelperService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    component.properties=[{name:'',defaultImageFile:'', deposit: 0, fee: 0}];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct properties values', () =>{
    component.properties={name:'Bike',defaultImageFile:'0457e040-445c-4bcb-b201-6123335b2e62.jpg', deposit: 50, fee: 2};
    expect(component.properties.name).toEqual('Bike');
    expect(component.properties.defaultImageFile).toEqual('0457e040-445c-4bcb-b201-6123335b2e62.jpg');
    expect(component.properties.deposit).toEqual(50);
    expect(component.properties.fee).toEqual(2);
  })


});
