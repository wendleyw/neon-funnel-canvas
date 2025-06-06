/**
 * Safe JSON stringification to prevent circular reference errors
 * This function filters out React Fiber properties and DOM elements that can cause circular references
 */
export const safeStringify = (obj: any): string => {
  const seen = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
      
      // Skip React Fiber properties and DOM elements
      if (key.startsWith('__react') || key.startsWith('_owner') || key === 'stateNode') {
        return undefined;
      }
      
      // Skip DOM elements
      if (value instanceof HTMLElement) {
        return undefined;
      }
      
      // Skip functions (they can't be serialized anyway)
      if (typeof value === 'function') {
        return undefined;
      }
    }
    return value;
  });
}; 