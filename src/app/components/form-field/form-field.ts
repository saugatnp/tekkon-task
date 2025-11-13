import {Component, computed, input} from '@angular/core';
import {AbstractControl, FormControl, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-form-field',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
})
export class FormField {

  readonly label = input<string>('');
  public control = input.required<AbstractControl>();
  readonly type = input<'text' | 'textarea' | 'number'>('text');
  readonly placeholder = input<string>('');

  readonly formControl = computed((): FormControl => this.control() as FormControl);


  constructor() {

  }



}
