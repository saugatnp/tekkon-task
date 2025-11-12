import {Component, effect, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicForm } from './components/dynamic-form/dynamic-form';
import { JsonEditor } from './components/json-editor/json-editor';
import {Form} from './services/form';
import {AppSchema} from './models/form.model';
import {FormGroup} from '@angular/forms';
import {JsonUtils} from './utils/json.utils';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DynamicForm, JsonEditor],
  templateUrl: 'app.html',
  styleUrl: 'app.scss'
})
export class App {
  private fbService = inject(Form);

  readonly themeOptions = ['light', 'dark', 'system'];
  readonly roleOptions = ['Admin', 'User'];

  readonly defaultData: AppSchema = {
    name: 'Demo Project',
    description: 'Extended form with settings and members',
    tags: ['angular', 'forms'],
    settings: {
      notifications: true,
      theme: 'light',
      refreshInterval: 15
    },
    members: [
      { id: 1, name: 'Alice', role: 'Admin' },
      { id: 2, name: 'Bob', role: 'User' }
    ]
  };

  form = signal<FormGroup>(this.fbService.createFormFromSchema(this.defaultData));
  jsonOutput = signal<string>(JsonUtils.stringify(this.form().value));

  constructor() {
    effect(() => {
      this.jsonOutput.set(JsonUtils.stringify(this.form().value));
    });
  }

  onJsonInput(json: string) {
    const parsed = JsonUtils.parse<AppSchema>(json);
    if (!parsed.success) return;
    if (!JsonUtils.validate(parsed.data, [
      'name',
      'settings',
      'settings.notifications',
      'settings.theme',
      'settings.refreshInterval',
      'members'
    ]).valid) return;
    this.form.set(this.fbService.createFormFromSchema(parsed.data));
  }

  private tagsArray() {
    return this.fbService.getTagsArray(this.form());
  }

  private membersArray() {
    return this.fbService.getMembersArray(this.form());
  }

  addTag() {
    this.fbService.addTag(this.tagsArray());
  }

  removeTag(index: number) {
    this.fbService.removeTag(this.tagsArray(), index);
  }

  addMember() {
    this.fbService.addMember(this.membersArray());
  }

  removeMember(index: number) {
    this.fbService.removeMember(this.membersArray(), index);
  }

  resetForm() {
    this.form.set(this.fbService.createFormFromSchema(this.defaultData));
  }
}
