import {Component, computed, input, signal} from '@angular/core';
import {AbstractControl, FormControl, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-form-field',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
})
export class FormField {

  readonly label = input<string>('');
  public control = input.required<AbstractControl>();
  readonly type = input<'text' | 'textarea' | 'select' | 'number' | 'toggle'>('text');
  readonly placeholder = input<string>('');
  readonly options = input<string[]>([]);
  readonly hint = input<string>('');

  readonly formControl = computed((): FormControl => this.control() as FormControl);

  // Use signals to track control state for reactivity
  private readonly controlState = signal<{
    touched: boolean;
    dirty: boolean;
    errors: any;
    value: any;
  }>({
    touched: false,
    dirty: false,
    errors: null,
    value: null
  });

  constructor() {

  }

  readonly hasError = computed((): boolean => {
    const state = this.controlState();
    // Show errors if the field has errors AND has been interacted with
    return !!(state.errors && (state.touched || state.dirty));
  });

  readonly errorMessage = computed((): string => {
    const state = this.controlState();

    if (!state.errors || !(state.touched || state.dirty)) return '';

    const errors = state.errors;
    if (errors['required']) return `${this.label()} is required`;
    if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength}`;
    if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength}`;
    if (errors['positiveNumber']) return 'Must be a positive number';

    return 'Invalid input';
  });


}
