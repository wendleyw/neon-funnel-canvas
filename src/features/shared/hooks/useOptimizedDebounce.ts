import { useCallback, useEffect, useRef } from 'react';
import { logger } from '../../../lib/logger';

/**
 * Optimized debounce hook with performance monitoring
 * Reduces API calls and improves performance by batching operations
 */
export function useOptimizedDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
    immediate?: boolean;
  } = {}
): [T, () => void] {
  const {
    leading = false,
    trailing = true,
    maxWait,
    immediate = false
  } = options;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTimeRef = useRef<number>(0);
  const lastInvokeTimeRef = useRef<number>(0);
  const argsRef = useRef<Parameters<T>>();
  const resultRef = useRef<ReturnType<T>>();

  // Performance tracking
  const callCountRef = useRef<number>(0);
  const saveCountRef = useRef<number>(0);

  const invokeFunction = useCallback(() => {
    const args = argsRef.current;
    if (args) {
      logger.time(`debounce-execution-${callback.name}`);
      resultRef.current = callback(...args);
      lastInvokeTimeRef.current = Date.now();
      saveCountRef.current++;
      logger.timeEnd(`debounce-execution-${callback.name}`);
      
      // Log performance stats in development
      if (process.env.NODE_ENV === 'development') {
        const efficiency = ((callCountRef.current - saveCountRef.current) / callCountRef.current * 100).toFixed(1);
        logger.log(`📊 Debounce efficiency: ${efficiency}% calls saved (${callCountRef.current - saveCountRef.current}/${callCountRef.current})`);
      }
    }
  }, [callback]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
  }, []);

  const debouncedFunction = useCallback(
    ((...args: Parameters<T>) => {
      callCountRef.current++;
      argsRef.current = args;
      lastCallTimeRef.current = Date.now();

      const invokeLeading = leading && !timeoutRef.current;
      const invokeImmediate = immediate && !timeoutRef.current;

      cancel();

      if (invokeLeading || invokeImmediate) {
        invokeFunction();
      }

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        if (trailing && !leading) {
          invokeFunction();
        }
      }, delay);

      // Handle maxWait
      if (maxWait && !maxTimeoutRef.current) {
        maxTimeoutRef.current = setTimeout(() => {
          maxTimeoutRef.current = null;
          invokeFunction();
        }, maxWait);
      }

      return resultRef.current;
    }) as T,
    [callback, delay, leading, trailing, maxWait, immediate, invokeFunction, cancel]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return [debouncedFunction, cancel];
}

/**
 * Specialized hook for search operations
 */
export function useSearchDebounce<T extends (...args: any[]) => any>(
  searchFunction: T,
  delay: number = 300
): [T, () => void] {
  return useOptimizedDebounce(searchFunction, delay, {
    leading: false,
    trailing: true,
    maxWait: 1000
  });
}

/**
 * Specialized hook for save operations with longer delay
 */
export function useSaveDebounce<T extends (...args: any[]) => any>(
  saveFunction: T,
  delay: number = 1000
): [T, () => void, () => void] {
  const [debouncedSave, cancel] = useOptimizedDebounce(saveFunction, delay, {
    leading: false,
    trailing: true,
    maxWait: 5000
  });

  // Force immediate save
  const saveNow = useCallback(() => {
    cancel();
    saveFunction();
  }, [saveFunction, cancel]);

  return [debouncedSave, cancel, saveNow];
}

/**
 * Specialized hook for API calls with intelligent batching
 */
export function useApiDebounce<T extends (...args: any[]) => Promise<any>>(
  apiFunction: T,
  delay: number = 500
): [T, () => void] {
  const batchedRequests = useRef<Map<string, {
    resolve: (value: any) => void;
    reject: (error: any) => void;
    args: Parameters<T>;
  }[]>>(new Map());

  const executeBatch = useCallback(async () => {
    const batches = Array.from(batchedRequests.current.entries());
    batchedRequests.current.clear();

    for (const [key, requests] of batches) {
      try {
        // Execute the API call with the latest arguments
        const latestRequest = requests[requests.length - 1];
        const result = await apiFunction(...latestRequest.args);
        
        // Resolve all pending requests with the same result
        requests.forEach(({ resolve }) => resolve(result));
        
        logger.log(`📦 Batched ${requests.length} API calls for ${key}`);
      } catch (error) {
        // Reject all pending requests
        requests.forEach(({ reject }) => reject(error));
        logger.error(`❌ Batch API call failed for ${key}:`, error);
      }
    }
  }, [apiFunction]);

  const [debouncedExecute] = useOptimizedDebounce(executeBatch, delay, {
    leading: false,
    trailing: true,
    maxWait: delay * 3
  });

  const debouncedApiFunction = useCallback(
    ((...args: Parameters<T>) => {
      return new Promise((resolve, reject) => {
        // Create a unique key for batching similar requests
        const key = JSON.stringify(args);
        
        if (!batchedRequests.current.has(key)) {
          batchedRequests.current.set(key, []);
        }
        
        batchedRequests.current.get(key)!.push({
          resolve,
          reject,
          args
        });

        debouncedExecute();
      });
    }) as T,
    [debouncedExecute]
  );

  const cancel = useCallback(() => {
    batchedRequests.current.clear();
  }, []);

  return [debouncedApiFunction, cancel];
}

/**
 * Hook for debouncing template operations
 */
export function useTemplateDebounce() {
  const [debouncedSearch, cancelSearch] = useSearchDebounce(
    (query: string, type?: string) => {
      logger.log('🔍 Executing debounced search:', { query, type });
      // This will be replaced by actual search implementation
      return { query, type };
    },
    300
  );

  const [debouncedSave, cancelSave, saveNow] = useSaveDebounce(
    (templateData: any) => {
      logger.log('💾 Executing debounced save:', templateData);
      // This will be replaced by actual save implementation
      return Promise.resolve(templateData);
    },
    1000
  );

  const [debouncedApiCall, cancelApi] = useApiDebounce(
    async (endpoint: string, data: any) => {
      logger.log('🌐 Executing debounced API call:', { endpoint, data });
      // This will be replaced by actual API implementation
      return Promise.resolve({ endpoint, data });
    },
    500
  );

  return {
    // Search operations
    debouncedSearch,
    cancelSearch,
    
    // Save operations
    debouncedSave,
    cancelSave,
    saveNow,
    
    // API operations
    debouncedApiCall,
    cancelApi,
    
    // Cancel all operations
    cancelAll: () => {
      cancelSearch();
      cancelSave();
      cancelApi();
    }
  };
}

export default useOptimizedDebounce; 