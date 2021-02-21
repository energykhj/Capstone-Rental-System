import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPostComponent } from './add-edit-post.component';

describe('AddEditPostComponent', () => {
  let component: AddEditPostComponent;
  let fixture: ComponentFixture<AddEditPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
