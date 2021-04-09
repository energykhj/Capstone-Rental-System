import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { ReviewDialogComponent } from './review-dialog.component';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import 'zone.js/dist/zone-testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AngularMaterialModule } from '../../../Helpers/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ReviewDialogComponent', () => {
  let component: ReviewDialogComponent;
  let fixture: ComponentFixture<ReviewDialogComponent>;

  const fakeMatDialogData = {
    title: 'Write a Review',
    itemName: 'Bicycle',
    itemRate: 3,
    reviewTitle: 'Bicycle Review',
    review: 'Bicycle is Good',
    canDelete: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: fakeMatDialogData },
        { provide: MatDialogRef, useValue: {} },
        { provide: FormBuilder },
      ],
      imports: [BrowserModule, BrowserAnimationsModule, AngularMaterialModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display injected title', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain('Write a Review');
  });

  it('should display injected item name', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain('Bicycle');
  });

  it('should display inputted item rating', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    let input = fixture.debugElement.query(By.css('#rating')).nativeElement;
    input.value = 3;
    input.dispatchEvent(new Event('input'));
    tick();

    expect(component.itemRate).toEqual(3);
  }));

  it('should display inputted review title', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    let input = fixture.debugElement.query(By.css('#reviewTitle')).nativeElement;
    input.value = 'Bicycle Review';
    input.dispatchEvent(new Event('input'));
    tick();

    expect(component.reviewTitle).toEqual('Bicycle Review');
  }));

  it('should display inputted review text', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    let input = fixture.debugElement.query(By.css('#review')).nativeElement;
    input.value = 'Bicycle is Good';
    input.dispatchEvent(new Event('textarea'));
    tick();

    expect(component.review).toEqual('Bicycle is Good');
  }));

  it('should display Save button', () => {
    let buttonArray = [];
    let buttons = fixture.debugElement.nativeElement.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      buttonArray.push(buttons[i].innerHTML);
    }
    expect(buttonArray).toContain('Save');
  });

  it('should display Cancel button', () => {
    let buttonArray = [];
    let buttons = fixture.debugElement.nativeElement.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      buttonArray.push(buttons[i].innerHTML);
    }
    expect(buttonArray).toContain('Cancel');
  });

  it('should display delete button if delete flag was injected', () => {
    let buttonArray = [];
    let buttons = fixture.debugElement.nativeElement.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      buttonArray.push(buttons[i].innerHTML);
    }
    expect(buttonArray).toContain('Delete');
  });

  it('should not display delete button if delete flag was not injected', () => {
    component.canDelete = false;
    fixture.detectChanges();

    let buttonArray = [];
    let buttons = fixture.debugElement.nativeElement.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      buttonArray.push(buttons[i].innerHTML);
    }
    expect(buttonArray).not.toContain('Delete');
  });
});
