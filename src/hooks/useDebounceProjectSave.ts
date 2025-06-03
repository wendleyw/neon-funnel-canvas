import { useCallback, useRef } from 'react';
import { FunnelProject } from '../types/funnel';

interface UseDebounceProjectSaveProps {
  onSave: (project: FunnelProject) => Promise<{ success: boolean; projectId?: string }>;
  delay?: number;
}

export const useDebounceProjectSave = ({ onSave, delay = 3000 }: UseDebounceProjectSaveProps) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');

  const debouncedSave = useCallback(async (project: FunnelProject) => {
    // Criar hash simples para detectar mudanças reais
    const projectHash = JSON.stringify({
      name: project.name,
      components: project.components.map(c => ({ 
        id: c.id, 
        type: c.type, 
        position: c.position,
        data: c.data 
      })),
      connections: project.connections.map(c => ({ 
        id: c.id, 
        from: c.from, 
        to: c.to, 
        type: c.type 
      }))
    });

    // Se o projeto não mudou, não salvar
    if (projectHash === lastSavedRef.current) {
      console.log('🔄 Project unchanged, skipping save');
      return;
    }

    // Limpar timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Criar novo timeout para salvar
    timeoutRef.current = setTimeout(async () => {
      try {
        console.log('💾 Auto-saving project...');
        const result = await onSave(project);
        if (result.success) {
          lastSavedRef.current = projectHash;
          console.log('✅ Project auto-saved successfully');
        }
      } catch (error) {
        console.error('❌ Auto-save failed:', error);
      }
    }, delay);

    console.log(`⏱️ Auto-save scheduled in ${delay}ms`);
  }, [onSave, delay]);

  const forceSave = useCallback(async (project: FunnelProject) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    try {
      console.log('💾 Force saving project...');
      const result = await onSave(project);
      if (result.success) {
        const projectHash = JSON.stringify({
          name: project.name,
          components: project.components.map(c => ({ 
            id: c.id, 
            type: c.type, 
            position: c.position,
            data: c.data 
          })),
          connections: project.connections.map(c => ({ 
            id: c.id, 
            from: c.from, 
            to: c.to, 
            type: c.type 
          }))
        });
        lastSavedRef.current = projectHash;
        console.log('✅ Project force-saved successfully');
      }
      return result;
    } catch (error) {
      console.error('❌ Force save failed:', error);
      return { success: false };
    }
  }, [onSave]);

  const cancelSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      console.log('🚫 Auto-save cancelled');
    }
  }, []);

  return {
    debouncedSave,
    forceSave,
    cancelSave
  };
}; 