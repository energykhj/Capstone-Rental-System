import 'zone.js/dist/zone-testing';
import { AuthService } from './../../../Services/auth.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostCardComponent } from './post-card.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, Input } from '@angular/core';


describe('PostCardComponent', () => {
  let component: PostCardComponent;
  let fixture: ComponentFixture<PostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostCardComponent ],
      imports:[RouterTestingModule.withRoutes([]),
               HttpClientTestingModule],
      providers: [{provide: AuthService},
                  {provide: MatDialog, useValue: {}}],
      schemas:      [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCardComponent);
    component = fixture.componentInstance;
    component.property = {name:'Bike', defaultImageFile:'0457e040-445c-4bcb-b201-6123335b2e62.jpg', deposit:50, fee: 2};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should have the correct property values', () =>{
    //component.property={name:'Bike',defaultImageFile:'bike.jpg', deposit: 50, fee: 2};
    expect(component.property.name).toEqual('Bike');
    expect(component.property.defaultImageFile).toEqual('0457e040-445c-4bcb-b201-6123335b2e62.jpg');
    expect(component.property.deposit).toEqual(50);
    expect(component.property.fee).toEqual(2);
  })

});
