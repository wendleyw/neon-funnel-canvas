/**
 * Optimized Logger for Production
 * Conditionally logs based on environment to reduce bundle size and improve performance
 */

interface LogLevel {
  LOG: 'log';
  WARN: 'warn';
  ERROR: 'error';
  DEBUG: 'debug';
  INFO: 'info';
}

interface PerformanceTracker {
  [key: string]: number;
}

class Logger {
  private isDev = process.env.NODE_ENV === 'development';
  private isTest = process.env.NODE_ENV === 'test';
  private performanceTracker: PerformanceTracker = {};

  /**
   * Development-only console.log
   */
  log = (...args: any[]): void => {
    if (this.isDev) {
      console.log(...args);
    }
  };

  /**
   * Development-only console.warn
   */
  warn = (...args: any[]): void => {
    if (this.isDev) {
      console.warn(...args);
    }
  };

  /**
   * Always active console.error (important for production debugging)
   */
  error = (...args: any[]): void => {
    console.error(...args);
  };

  /**
   * Development-only console.debug
   */
  debug = (...args: any[]): void => {
    if (this.isDev) {
      console.debug(...args);
    }
  };

  /**
   * Development-only console.info
   */
  info = (...args: any[]): void => {
    if (this.isDev) {
      console.info(...args);
    }
  };

  /**
   * Performance tracking - development only
   */
  time = (label: string): void => {
    if (this.isDev) {
      // Handle duplicate timers gracefully (React StrictMode runs effects twice)
      if (this.performanceTracker[label] !== undefined) {
        // Timer already exists, just update the start time
        this.performanceTracker[label] = performance.now();
        return;
      }
      
      this.performanceTracker[label] = performance.now();
      console.time(label);
    }
  };

  /**
   * End performance tracking - development only
   */
  timeEnd = (label: string): void => {
    if (this.isDev) {
      const startTime = this.performanceTracker[label];
      if (startTime) {
        const endTime = performance.now();
        console.timeEnd(label);
        console.log(`⏱️ ${label}: ${(endTime - startTime).toFixed(2)}ms`);
        delete this.performanceTracker[label];
      }
    }
  };

  /**
   * Group logging - development only
   */
  group = (label: string): void => {
    if (this.isDev) {
      console.group(label);
    }
  };

  /**
   * End group logging - development only
   */
  groupEnd = (): void => {
    if (this.isDev) {
      console.groupEnd();
    }
  };

  /**
   * Table logging - development only
   */
  table = (data: any): void => {
    if (this.isDev) {
      console.table(data);
    }
  };

  /**
   * Conditional logging based on condition
   */
  conditionalLog = (condition: boolean, ...args: any[]): void => {
    if (this.isDev && condition) {
      console.log(...args);
    }
  };

  /**
   * Production-safe error reporting
   * Always logs errors but with sanitized data in production
   */
  reportError = (error: Error, context?: Record<string, any>): void => {
    if (this.isDev) {
      console.error('🚨 Error Report:', error, context);
    } else {
      // In production, log minimal error info
      console.error('Application Error:', {
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n'), // First 3 lines only
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }
  };

  /**
   * Performance monitoring for critical operations
   */
  monitorPerformance = <T>(
    operation: string,
    fn: () => T | Promise<T>
  ): T | Promise<T> => {
    if (this.isDev) {
      this.time(operation);
      
      try {
        const result = fn();
        
        if (result instanceof Promise) {
          return result.finally(() => this.timeEnd(operation));
        } else {
          this.timeEnd(operation);
          return result;
        }
      } catch (error) {
        this.timeEnd(operation);
        throw error;
      }
    } else {
      return fn();
    }
  };

  /**
   * Memory usage tracking - development only
   */
  memoryUsage = (): void => {
    if (this.isDev && 'memory' in performance) {
      const memory = (performance as any).memory;
      console.log('💾 Memory Usage:', {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      });
    }
  };

  /**
   * Network monitoring for API calls
   */
  logApiCall = (
    method: string,
    url: string,
    duration?: number,
    status?: number
  ): void => {
    if (this.isDev) {
      const emoji = status && status >= 400 ? '❌' : '✅';
      console.log(
        `${emoji} API ${method.toUpperCase()} ${url}`,
        duration ? `(${duration}ms)` : '',
        status ? `[${status}]` : ''
      );
    }
  };
}

// Create singleton instance
export const logger = new Logger();

// Export commonly used methods for convenience
export const { log, warn, error, debug, info, time, timeEnd, reportError } = logger;

// Development-only assertion
export const assert = (condition: boolean, message: string): void => {
  if (process.env.NODE_ENV === 'development' && !condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
};

// Production-safe feature flag checking
export const isFeatureEnabled = (feature: string): boolean => {
  // In development, check localStorage for feature flags
  if (process.env.NODE_ENV === 'development') {
    return localStorage.getItem(`feature_${feature}`) === 'true';
  }
  
  // In production, only enable stable features
  const stableFeatures = ['auto_save', 'template_cache'];
  return stableFeatures.includes(feature);
};

export default logger; 