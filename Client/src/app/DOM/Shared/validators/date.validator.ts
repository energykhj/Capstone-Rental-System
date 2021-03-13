import { FormControl, FormGroup, NgForm, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class DateValidator {
  // Inspired on: http://plnkr.co/edit/Zcbg2T3tOxYmhxs7vaAm?p=preview
  static compareDate(formGroup: FormGroup, sDate: string, eDate: string) {
    if (formGroup.controls != null && formGroup.controls[eDate].value != null) {
      let start = new Date(formGroup.controls[sDate].value);
      let end = new Date(formGroup.controls[eDate].value);
      if (
        start > end &&
        !(
          start.getDate() == end.getDate() &&
          start.getMonth() == end.getMonth() &&
          start.getFullYear() == end.getFullYear()
        )
      ) {
        return {
          dateOrder: true,
        };
      }
    }
    return {};
  }

  // 0: sDate == eDate
  // 1: sDate < eDate
  // -1: sDate > eDate
  static compareDateWithoutForm(sDate, eDate) {
    let start = new Date(sDate);
    let end = new Date(eDate);
    if (
      start.getDate() == end.getDate() &&
      start.getMonth() == end.getMonth() &&
      start.getFullYear() == end.getFullYear()
    ) {
      return 0;
    } else if (start > end) {
      return -1;
    } else if (start < end) {
      return 1;
    }
    return 0;
  }
}
