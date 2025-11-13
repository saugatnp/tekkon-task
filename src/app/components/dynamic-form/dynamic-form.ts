import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, input, output} from '@angular/core';
import {AbstractControl, FormArray, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {FormField} from '../form-field/form-field';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule,
    FormField,
  ],
  templateUrl: './dynamic-form.html',
  styleUrls: ['./dynamic-form.scss']
})
export class DynamicForm {
  form = input.required<FormGroup>();
  themeOptions = input<string[]>([]);
  roleOptions = input<string[]>([]);

  addTag = output<void>();
  removeTag = output<number>();
  addMember = output<void>();
  removeMember = output<number>();
  resetForm = output<void>();

  readonly tagsArray = computed((): FormArray => {
    return this.form().get('tags') as FormArray;
  });

  readonly membersArray = computed((): FormArray => {
    return this.form().get('members') as FormArray;
  });

  readonly nameControl = computed((): AbstractControl => {
    return this.form().get('name')!;
  });

  readonly descriptionControl = computed((): AbstractControl => {
    return this.form().get('description')!;
  });

  readonly settingsGroup = computed((): FormGroup => {
    return this.form().get('settings') as FormGroup;
  });

  getMemberNameControl(ctrl: AbstractControl) {
    return ctrl.get('name')!;
  }

  getMemberRoleControl(ctrl: AbstractControl) {
    return ctrl.get('role')!;
  }
}
