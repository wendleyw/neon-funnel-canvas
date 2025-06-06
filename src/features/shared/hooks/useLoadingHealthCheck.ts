import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface LoadingState {
  authLoading: boolean;
  workspaceLoading: boolean;
  user: any;
}

interface HealthCheckOptions {
  timeout?: number;
  maxRetries?: number;
  onTimeout?: () => void;
  onRecovery?: () => void;
}

export const useLoadingHealthCheck = (
  loadingState: LoadingState,
  options: HealthCheckOptions = {}
) => {
  const {
    timeout = 15000,
    maxRetries = 3,
    onTimeout,
    onRecovery
  } = options;

  const [isHealthy, setIsHealthy] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastStateRef = useRef<string>('');
  const stuckCountRef = useRef(0);

  const getCurrentStateString = () => {
    return JSON.stringify({
      authLoading: loadingState.authLoading,
      workspaceLoading: loadingState.workspaceLoading,
      hasUser: !!loadingState.user
    });
  };

  useEffect(() => {
    const currentState = getCurrentStateString();
    const isLoading = loadingState.authLoading || loadingState.workspaceLoading;

    // Se não está carregando, limpar timers e resetar contadores
    if (!isLoading) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      if (!isHealthy) {
        setIsHealthy(true);
        setRetryCount(0);
        stuckCountRef.current = 0;
        onRecovery?.();
        toast.success('Connection restored!', {
          description: 'You are back online.',
          icon: '🌍',
        });
      }
      return;
    }

    // Verificar se o estado está "preso" na mesma condição
    if (currentState === lastStateRef.current) {
      stuckCountRef.current += 1;
    } else {
      stuckCountRef.current = 0;
      lastStateRef.current = currentState;
    }

    // Se ficou "preso" por muito tempo, considerar problemático
    if (stuckCountRef.current > 5 && !timeoutRef.current) {
      console.warn('Possível loading infinito detectado');
      
      timeoutRef.current = setTimeout(() => {
        setIsHealthy(false);
        setRetryCount(prev => prev + 1);
        
        if (retryCount < maxRetries) {
          toast.error('Problema de carregamento detectado', {
            description: `Tentativa ${retryCount + 1} de ${maxRetries}`,
            action: {
              label: 'Tentar Novamente',
              onClick: () => window.location.reload()
            }
          });
        } else {
          toast.error('Falha persistente no carregamento', {
            description: 'Recarregue a página manualmente',
            action: {
              label: 'Recarregar',
              onClick: () => window.location.reload()
            }
          });
        }
        
        onTimeout?.();
        timeoutRef.current = null;
      }, timeout);
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [
    loadingState.authLoading,
    loadingState.workspaceLoading,
    loadingState.user,
    isHealthy,
    retryCount,
    timeout,
    maxRetries,
    onTimeout,
    onRecovery
  ]);

  const forceRecovery = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHealthy(true);
    setRetryCount(0);
    stuckCountRef.current = 0;
  };

  const getHealthStatus = () => ({
    isHealthy,
    retryCount,
    maxRetries,
    isStuck: stuckCountRef.current > 5
  });

  return {
    isHealthy,
    retryCount,
    forceRecovery,
    getHealthStatus
  };
}; 