import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DynamicForm } from './components/dynamic-form/dynamic-form';
import { JsonEditor } from './components/json-editor/json-editor';
import { AppSchema } from './models/form.model';
import { Form } from './services/form';
import { JsonUtils } from './utils/json.utils';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicForm, JsonEditor],
  templateUrl: 'app.html',
  styleUrl: 'app.scss'
})
export class App {
  private fbService = inject(Form);

  readonly defaultData: AppSchema = {
    name: 'Demo Project',
    description: 'Initial schema phase',
    tags: ['angular', 'phase3'],
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
  jsonOutput = signal<string>(JsonUtils.stringify(this.form().value));

  constructor() {
    effect(() => {
      this.jsonOutput.set(JsonUtils.stringify(this.form().value));
    });
  }

  onJsonInput(json: string): void {
    const parsed = JsonUtils.parse<AppSchema>(json);
    if (!parsed.success) return;
    if (!JsonUtils.hasRequiredKeys(parsed.data, ['name', 'settings', 'members'])) return;
    this.form.set(this.fbService.createFormFromSchema(parsed.data));
  }
}
