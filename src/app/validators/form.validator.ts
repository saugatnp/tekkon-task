import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static positiveNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = control.value;
      if (v === null || v === undefined || v === '') return null;
      return v > 0 ? null : { positiveNumber: true };
    };
  }

  static allowedValues(values: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = control.value;
      if (v === null || v === undefined || v === '') return null;
      return values.includes(v) ? null : { allowedValues: { actual: v, allowed: values } };
    };
  }
}