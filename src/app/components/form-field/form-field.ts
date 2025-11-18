import {Component, computed, DestroyRef, effect, inject, input, signal} from '@angular/core';
import {AbstractControl, FormControl, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
  private destroyRef = inject(DestroyRef);

  readonly label = input<string>('');
  public control = input.required<AbstractControl>();
  readonly type = input<'text' | 'textarea' | 'select' | 'number' | 'toggle'>('text');
  readonly required = input<boolean>(false);
  readonly options = input<string[]>([]);
  readonly placeholder = input<string>('');
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
    // Subscribe to control changes and update state signal
    effect((onCleanup) => {
      const ctrl = this.control();
      if (ctrl) {
        // Initial state
        this.updateControlState();

        // Subscribe to status and value changes with proper cleanup
        const statusSub = ctrl.statusChanges
          .subscribe(() => this.updateControlState());

        const valueSub = ctrl.valueChanges
          .subscribe(() => this.updateControlState());

        // Cleanup subscriptions when effect re-runs
        onCleanup(() => {
          statusSub.unsubscribe();
          valueSub.unsubscribe();
        });
      }
    });
  }

  private updateControlState(): void {
    console.log('Updating control state');
    const ctrl = this.control();
    this.controlState.set({
      touched: ctrl.touched,
      dirty: ctrl.dirty,
      errors: ctrl.errors,
      value: ctrl.value
    });
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
    if (errors['allowedValues']) {
      const allowed = errors['allowedValues'].allowed.join(', ');
      return `Must be one of: ${allowed}`;
    }

    return 'Invalid input';
  });
}
