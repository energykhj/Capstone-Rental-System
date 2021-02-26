import { FormControl, FormGroup, NgForm, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class DateValidator {
  // Inspired on: http://plnkr.co/edit/Zcbg2T3tOxYmhxs7vaAm?p=preview
  static compareDate(formGroup: FormGroup, sDate: string, eDate: string) {
    if (formGroup.controls != null && formGroup.controls[eDate].value != null){
      let start = new Date(formGroup.controls[sDate].value);
      let end = new Date(formGroup.controls[eDate].value);
      if ((start > end) && (start.getDate() != end.getDate())) {
        return {
          dateOrder: true
        };
      }
    }
    return {};
  }
}