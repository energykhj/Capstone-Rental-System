import { FormControl, FormGroup, NgForm, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class DateOrderValidator {
  // Inspired on: http://plnkr.co/edit/Zcbg2T3tOxYmhxs7vaAm?p=preview
  static checkDateOrder(formGroup: FormGroup, sDate: string, eDate: string) {
    if (formGroup.controls != null && formGroup.controls[eDate].value != null){
      let s = new Date(formGroup.controls[sDate].value);
      let e = new Date(formGroup.controls[eDate].value);
      if (s.getDate() > e.getDate()) {
        return {
          dateOrder: true
        };
      }
      return {};
    }
    return {};
  }
}