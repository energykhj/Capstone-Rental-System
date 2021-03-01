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
      declarations: [PostCardComponent],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      providers: [{ provide: AuthService }, { provide: MatDialog, useValue: {} }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCardComponent);
    component = fixture.componentInstance;
    component.property = {
      name: 'Bike',
      defaultImageFile: '11b5bd7e-24fb-4d69-b035-f3feccbaca50',
      deposit: 50,
      fee: 2,
    };
    component.PhotoFilePath = 'http://localhost:57183/api/Lookup/GetPhoto/';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct property values', () => {
    expect(component.PhotoFilePath).toEqual('http://localhost:57183/api/Lookup/GetPhoto/');
    expect(component.property.name).toEqual('Bike');
    expect(component.property.defaultImageFile).toEqual('11b5bd7e-24fb-4d69-b035-f3feccbaca50');
    expect(component.property.deposit).toEqual(50);
    expect(component.property.fee).toEqual(2);
  });

  it('should set image item path as expected', () => {
    const ele = fixture.debugElement.nativeElement.querySelectorAll('img');
    expect(ele[0]['src']).toContain('http://localhost:57183/api/Lookup/GetPhoto/11b5bd7e-24fb-4d69-b035-f3feccbaca50');
  });
});
