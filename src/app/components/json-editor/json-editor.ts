import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, model, output, signal} from '@angular/core';
import {JsonUtils} from '../../utils/json.utils';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-json-editor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './json-editor.html',
  styleUrls: ['./json-editor.scss']
})
export class JsonEditor {
  jsonContent = model<string>('');
  jsonChange = output<string>();

  readonly isValidJson = computed((): boolean => {
    const result = JsonUtils.parse(this.jsonContent());
    return result.success;
  });

  readonly validationError = computed((): string | null => {
    const content = this.jsonContent();
    if (!content.trim()) return null;
    const result = JsonUtils.parse(content);
    return result.success ? null : result.error;
  });

  onJsonChange(value: string): void {
    this.jsonContent.set(value);
    this.jsonChange.emit(value);
  }

  formatJson(): void {
    const result = JsonUtils.parse(this.jsonContent());
    if (result.success) {
      const formatted = JsonUtils.stringify(result.data);
      this.jsonContent.set(formatted);
      this.jsonChange.emit(formatted);
    }
  }
}
