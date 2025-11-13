import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DynamicForm } from './components/dynamic-form/dynamic-form';
import { JsonEditor } from './components/json-editor/json-editor';
import {Form} from './services/form';
import {AppSchema} from './models/form.model';
import {JsonUtils} from './utils/json.utils';
import {Localstorage} from './services/localstorage';
import {debounceTime, distinctUntilChanged} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicForm, JsonEditor],
  templateUrl: 'app.html',
  styleUrl: 'app.scss'
})
export class App {
  private fbService = inject(Form);
  private lsService = inject(Localstorage);

  readonly themeOptions = ['light', 'dark', 'system'];
  readonly roleOptions = ['Admin', 'User'];

  readonly defaultData: AppSchema = {
    name: 'Crewmojo Demo',
    description: 'Testing reactive form coding task',
    tags: ['angular', 'forms', 'json'],
    settings: {
      notifications: true,
      theme: 'dark',
      refreshInterval: 30
    },
    members: [
      { id: 1, name: 'Alice', role: 'Admin' },
      { id: 2, name: 'Bob', role: 'User' }
    ]
  };

  form = signal<FormGroup>(this.fbService.createFormFromSchema(this.defaultData));
  jsonOutput = signal<string>('');

  constructor() {
    const savedData = this.lsService.loadData();
    if (savedData) {
      this.form.set(this.fbService.createFormFromSchema(savedData));
    }

    effect(() => {
      this.jsonOutput.set(JsonUtils.stringify(this.form().value));
    });

    this.form().valueChanges
      .pipe(debounceTime(300), distinctUntilChanged((a, b) => JsonUtils.equals(a, b)))
      .subscribe(value => {
        this.lsService.saveData(value);
      });
  }

  onJsonInput(json: string): void {
    const parsed = JsonUtils.parse<AppSchema>(json);
    if (!parsed.success) return;

    const validation = JsonUtils.validate(parsed.data, [
      'name',
      'settings',
      'settings.notifications',
      'settings.theme',
      'settings.refreshInterval',
      'members'
    ]);
    if (!validation.valid) return;

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
    this.lsService.clearData();
  }
}
