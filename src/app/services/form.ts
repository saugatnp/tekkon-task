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
    return this.fb.group({
      name: [data.name, [Validators.required, Validators.minLength(3)]],
      description: [data.description],
      tags: this.fb.array(data.tags.map(t => this.fb.control(t))),
      settings: this.fb.group({
        notifications: [data.settings.notifications],
        theme: [data.settings.theme, [CustomValidators.allowedValues(['light', 'dark', 'system'])]],
        refreshInterval: [
          data.settings.refreshInterval,
          [Validators.required, CustomValidators.positiveNumber()]
        ]
      }),
      members: this.fb.array(data.members.map(m => this.createMemberForm(m)))
    });
  }

  private createMemberForm(member: Member): FormGroup {
    return this.fb.group({
      id: [member.id],
      name: [member.name, Validators.required],
      role: [member.role, [CustomValidators.allowedValues(['Admin', 'User'])]]
    });
  }

  getTagsArray(form: FormGroup): FormArray {
    return form.get('tags') as FormArray;
  }

  getMembersArray(form: FormGroup): FormArray {
    return form.get('members') as FormArray;
  }

  addTag(tags: FormArray): void {
    tags.push(this.fb.control(''));
  }

  removeTag(tags: FormArray, index: number): void {
    tags.removeAt(index);
  }

  addMember(members: FormArray): void {
    const member: Member = { id: Date.now(), name: '', role: 'User' };
    members.push(this.createMemberForm(member));
  }

  removeMember(members: FormArray, index: number): void {
    members.removeAt(index);
  }
}
