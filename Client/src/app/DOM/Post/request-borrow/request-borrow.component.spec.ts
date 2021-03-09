import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestBorrowComponent } from './request-borrow.component';

describe('RequestBorrowComponent', () => {
  let component: RequestBorrowComponent;
  let fixture: ComponentFixture<RequestBorrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestBorrowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestBorrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
