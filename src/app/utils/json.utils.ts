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

  static validate(data: any, requiredFields: string[]): { valid: boolean; missingFields: string[] } {
    const missingFields = requiredFields.filter(field => {
      const keys = field.split('.');
      let current = data;

      for (const key of keys) {
        if (current === null || current === undefined || !(key in current)) {
          return true;
        }
        current = current[key];
      }

      return false;
    });

    return {
      valid: missingFields.length === 0,
      missingFields
    };
  }

  static hasRequiredKeys(obj: any, keys: string[]): boolean {
    return keys.every(k => k.split('.').reduce((cur, part) => (cur && part in cur) ? cur[part] : undefined, obj) !== undefined);
  }

  static equals(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
}
