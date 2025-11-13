import {inject, Injectable} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppSchema, Member} from '../models/form.model';
import {CustomValidators} from '../validators/form.validator';

@Injectable({
  providedIn: 'root',
})
export class Form {
  private fb = inject(FormBuilder);
  constructor() {}

  createFormFromSchema(data: AppSchema): FormGroup {
    const form = this.fb.group({
      name: [data.name, [Validators.required, Validators.minLength(3)]],
      description: [data.description],
      tags: this.fb.array(data.tags.map(tag => this.fb.control(tag))),
      settings: this.fb.group({
        notifications: [data.settings.notifications],
        theme: [data.settings.theme, [CustomValidators.allowedValues(['light', 'dark', 'system'])]],
        refreshInterval: [data.settings.refreshInterval, [Validators.required, CustomValidators.positiveNumber()]]
      }),
      members: this.fb.array(data.members.map(member => this.createMemberForm(member)))
    });

    // Mark invalid controls as touched to show errors on load
    this.markInvalidControlsAsTouched(form);

    return form;
  }

  private markInvalidControlsAsTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);

      if (control instanceof FormGroup) {
        this.markInvalidControlsAsTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(ctrl => {
          if (ctrl instanceof FormGroup) {
            this.markInvalidControlsAsTouched(ctrl);
          } else if (ctrl.invalid) {
            ctrl.markAsTouched();
          }
        });
      } else if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  createMemberForm(member: Member): FormGroup {
    return this.fb.group({
      id: [member.id],
      name: [member.name, Validators.required],
      role: [member.role, [CustomValidators.allowedValues(['Admin', 'User'])]]
    });
  }

  // Helper methods to get form arrays
  getTagsArray(form: FormGroup): FormArray {
    return form.get('tags') as FormArray;
  }

  getMembersArray(form: FormGroup): FormArray {
    return form.get('members') as FormArray;
  }

  addTag(tagsArray: FormArray): void {
    tagsArray.push(this.fb.control(''));
  }

  removeTag(tagsArray: FormArray, index: number): void {
    tagsArray.removeAt(index);
  }

  addMember(membersArray: FormArray): void {
    const newMember = { id: Date.now(), name: '', role: 'User' as const };
    membersArray.push(this.createMemberForm(newMember));
  }

  removeMember(membersArray: FormArray, index: number): void {
    membersArray.removeAt(index);
  }
}
