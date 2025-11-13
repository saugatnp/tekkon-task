import {Component, effect, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormGroup} from '@angular/forms';
import {DynamicForm} from './components/dynamic-form/dynamic-form';
import {JsonEditor} from './components/json-editor/json-editor';
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
  private formBuilderService = inject(Form);
  private localstorageService = inject(Localstorage);

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
    // Effect to sync form with JSON output
    effect(() => {
      const formValue = this.form().value;
      this.jsonOutput.set(JsonUtils.stringify(formValue));
    });
  }

  ngOnInit(): void {
    this.loadPersistedData();
    this.setupFormSubscription();
    this.updateJsonOutput();
  }

  private loadPersistedData(): void {
    const savedData = this.localstorageService.loadData();
    if (savedData) {
      this.form.set(this.formBuilderService.createFormFromSchema(savedData));
    }
  }

  private setupFormSubscription(): void {
    this.form().valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JsonUtils.equals(prev, curr))
    ).subscribe(value => {
      this.updateJsonOutput();
      this.localstorageService.saveData(value);
    });
  }

  private updateJsonOutput(): void {
    const value = this.form().value;
    this.jsonOutput.set(JsonUtils.stringify(value));
  }

  onJsonInput(jsonString: string): void {
    const result = JsonUtils.parse<AppSchema>(jsonString);

    if (!result.success) {
      return;
    }

    if (this.isValidSchema(result.data)) {
      this.form.set(this.formBuilderService.createFormFromSchema(result.data));
      this.localstorageService.saveData(result.data);
      this.setupFormSubscription();
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
    this.setupFormSubscription();
    this.updateJsonOutput();
  }
}
