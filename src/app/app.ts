import {Component, DestroyRef, effect, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormGroup} from '@angular/forms';
import {DynamicForm} from './components/dynamic-form/dynamic-form';
import {JsonEditor} from './components/json-editor/json-editor';
import {Form} from './services/form';
import {AppSchema} from './models/form.model';
import {JsonUtils} from './utils/json.utils';
import {Localstorage} from './services/localstorage';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicForm, JsonEditor],
  templateUrl: 'app.html',
  styleUrl: 'app.scss'
})
export class App {
  private formBuilderService = inject(Form);
  private localstorageService = inject(Localstorage);
  private destroyRef = inject(DestroyRef);

  readonly defaultData: AppSchema = {
    name: "Crewmojo Demo",
    description: "Testing reactive form coding task",
    tags: ["angular", "forms", "json"],
    settings: {
      notifications: true,
      theme: "dark",
      refreshInterval: 30
    },
    members: [
      {id: 1, name: "Alice", role: "Admin"},
      {id: 2, name: "Bob", role: "User"}
    ]
  };

  readonly themeOptions = ['light', 'dark', 'system'];
  readonly roleOptions = ['Admin', 'User'];

  // Signals
  form = signal<FormGroup>(this.formBuilderService.createFormFromSchema(this.defaultData));
  jsonOutput = signal<string>('');

  constructor() {
    this.loadPersistedData();

    // Effect to sync form with JSON output
    effect(() => {
      const currentForm = this.form();
      const formValue = currentForm.value;

      // Update JSON output
      this.jsonOutput.set(JsonUtils.stringify(formValue));

      // Set up subscription
      currentForm.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JsonUtils.equals(prev, curr)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(value => {
        // Update JSON output
        this.jsonOutput.set(JsonUtils.stringify(value));
        // Save to localStorage
        this.localstorageService.saveData(value);
      });
    });
  }

  private loadPersistedData(): void {
    const savedData = this.localstorageService.loadData();
    if (savedData) {
      this.form.set(this.formBuilderService.createFormFromSchema(savedData));
    }
  }


  onJsonInput(jsonString: string): void {
    const result = JsonUtils.parse<AppSchema>(jsonString);

    if (!result.success) {
      return;
    }

    if (this.isValidSchema(result.data)) {
      this.form.set(this.formBuilderService.createFormFromSchema(result.data));
      this.localstorageService.saveData(result.data);
    }
  }

  private isValidSchema(data: any): boolean {
    const validation = JsonUtils.validate(data, [
      'name',
      'description',
      'tags',
      'settings',
      'settings.notifications',
      'settings.theme',
      'settings.refreshInterval',
      'members'
    ]);

    return validation.valid && Array.isArray(data.tags) && Array.isArray(data.members);
  }

  // Array helpers
  get tagsArray() {
    return this.formBuilderService.getTagsArray(this.form());
  }

  get membersArray() {
    return this.formBuilderService.getMembersArray(this.form());
  }

  addTag(): void {
    this.formBuilderService.addTag(this.tagsArray);
  }

  removeTag(index: number): void {
    this.formBuilderService.removeTag(this.tagsArray, index);
  }

  addMember(): void {
    this.formBuilderService.addMember(this.membersArray);
  }

  removeMember(index: number): void {
    this.formBuilderService.removeMember(this.membersArray, index);
  }

  resetForm(): void {
    this.form.set(this.formBuilderService.createFormFromSchema(this.defaultData));
    this.localstorageService.clearData();
  }
}
