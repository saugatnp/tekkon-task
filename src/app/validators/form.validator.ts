import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  /**
   * Validates that the number is positive (greater than 0)
   */
  static positiveNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') return null;
      return value > 0 ? null : { positiveNumber: true };
    };
  }

  /**
   * Validates that the value is one of the allowed options
   */
  static allowedValues(allowedValues: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') return null;
      return allowedValues.includes(value) ? null : {
        allowedValues: {
          actual: value,
          allowed: allowedValues
        }
      };
    };
  }
}
