import { useCallback, useRef, useEffect } from 'react';
import { FunnelProject } from '../types/funnel';

interface UseDebounceProjectSaveProps {
  onSave: (project: FunnelProject) => Promise<{ success: boolean; projectId?: string }>;
  delay?: number;
}

export const useDebounceProjectSave = ({ onSave, delay = 3000 }: UseDebounceProjectSaveProps) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');
  const previousProjectRef = useRef<FunnelProject | null>(null);
  const currentProjectId = useRef<string | null>(null);

  const debouncedSave = useCallback(async (project: FunnelProject) => {
    if (!project || !currentProjectId.current) {
      return;
    }

    // If the project hasn't changed, don't save
    if (previousProjectRef.current && JSON.stringify(project) === JSON.stringify(previousProjectRef.current)) {
      if (process.env.NODE_ENV === 'development') {
        console.log('DBNC_SAVE: Project unchanged, skipping save for project:', currentProjectId.current);
      }
      return;
    }

    // Clear existing timeout if project changes again before save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Create new timeout for saving
    timeoutRef.current = setTimeout(async () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('DBNC_SAVE: Debounced save triggered for project:', currentProjectId.current, project);
      }
      try {
        console.log('💾 Auto-saving project...');
        const result = await onSave(project);
        if (result.success) {
          previousProjectRef.current = project;
          currentProjectId.current = result.projectId;
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
        previousProjectRef.current = project;
        currentProjectId.current = result.projectId;
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