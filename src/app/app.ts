import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicForm } from './components/dynamic-form/dynamic-form';
import { JsonEditor } from './components/json-editor/json-editor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DynamicForm, JsonEditor],
  templateUrl: 'app.html',
  styleUrl: 'app.scss'
})
export class App {}
