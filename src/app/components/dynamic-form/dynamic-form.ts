import { CommonModule } from '@angular/common';
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

  tagsArray = computed(() => this.form().get('tags') as FormArray);
  membersArray = computed(() => this.form().get('members') as FormArray);
  settingsGroup = computed(() => this.form().get('settings') as FormGroup);

  nameControl = computed(() => this.form().get('name')!);
  descriptionControl = computed(() => this.form().get('description')!);

  getMemberNameControl(ctrl: AbstractControl) {
    return ctrl.get('name')!;
  }
  getMemberRoleControl(ctrl: AbstractControl) {
    return ctrl.get('role')!;
  }
}
