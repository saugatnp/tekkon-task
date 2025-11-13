import { Injectable } from '@angular/core';
import {AppSchema} from '../models/form.model';

@Injectable({
  providedIn: 'root',
})
export class Localstorage {
  private readonly STORAGE_KEY = 'json-form-data';

  saveData(data: AppSchema): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  loadData(): AppSchema | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  clearData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
