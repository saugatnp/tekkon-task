import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, model, output, signal } from '@angular/core';

@Component({
  selector: 'app-json-editor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './json-editor.html',
  styleUrls: ['./json-editor.scss']
})
export class JsonEditor {
  jsonContent = model<string>('');
  jsonChange = output<string>();

  onInput(value: string) {
    this.jsonContent.set(value);
    this.jsonChange.emit(value);
  }
}
