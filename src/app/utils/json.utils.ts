export class JsonUtils {
  static parse<T = any>(json: string): { success: true; data: T } | { success: false; error: string } {
    try {
      return { success: true, data: JSON.parse(json) };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Invalid JSON' };
    }
  }

  static stringify(data: any, pretty: boolean = true): string {
    try {
      return JSON.stringify(data, null, pretty ? 2 : 0);
    } catch {
      return '';
    }
  }

  static hasRequiredKeys(obj: any, keys: string[]): boolean {
    return keys.every(k => k.split('.').reduce((cur, part) => (cur && part in cur) ? cur[part] : undefined, obj) !== undefined);
  }
}
