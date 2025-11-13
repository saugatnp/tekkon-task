export class JsonUtils {
  /**
   * Safely parse JSON string
   */
  static parse<T = any>(jsonString: string): { success: true; data: T } | { success: false; error: string } {
    try {
      const data = JSON.parse(jsonString);
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message || 'Invalid JSON' };
    }
  }

  /**
   * Safely stringify object to JSON
   */
  static stringify(data: any, pretty: boolean = true): string {
    try {
      return JSON.stringify(data, null, pretty ? 2 : 0);
    } catch (error) {
      return '';
    }
  }

  /**
   * Validate JSON structure against a schema
   */
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

  /**
   * Compare two objects for equality
   */
  static equals(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
}
