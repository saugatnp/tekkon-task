import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-json-editor',
  imports: [],
  templateUrl: './json-editor.html',
  styleUrl: './json-editor.scss',
})
export class JsonEditor {
  content = signal<string>('');

  onChange(value: string) {
    this.content.set(value);
  }
}
