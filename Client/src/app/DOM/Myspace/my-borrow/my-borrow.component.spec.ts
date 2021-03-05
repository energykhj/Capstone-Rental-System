import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBorrowComponent } from './my-borrow.component';

describe('MyBorrowComponent', () => {
  let component: MyBorrowComponent;
  let fixture: ComponentFixture<MyBorrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyBorrowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBorrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
