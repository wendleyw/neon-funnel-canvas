import { useState, useEffect, useCallback, useRef } from 'react';
import { FunnelProject } from '../types/funnel';

interface UseUnsavedChangesProps {
  project: FunnelProject;
  currentProjectId: string | null;
}

export const useUnsavedChanges = ({ project, currentProjectId }: UseUnsavedChangesProps) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedState, setLastSavedState] = useState<string>('');
  const projectRef = useRef<FunnelProject>(project);
  
  // Create a serializable snapshot of the project for comparison
  const createProjectSnapshot = useCallback((proj: FunnelProject): string => {
    const snapshot = {
      name: proj.name,
      components: proj.components?.map(comp => ({
        id: comp.id,
        type: comp.type,
        position: comp.position,
        data: comp.data,
        connections: comp.connections
      })) || [],
      connections: proj.connections || []
    };
    
    return JSON.stringify(snapshot, null, 0);
  }, []);

  // Mark as saved - call this after successful save operations
  const markAsSaved = useCallback(() => {
    const snapshot = createProjectSnapshot(project);
    setLastSavedState(snapshot);
    setHasUnsavedChanges(false);
    console.log('📁 Project marked as saved');
  }, [project, createProjectSnapshot]);

  // Reset unsaved changes tracking - call when loading a new project
  const resetTracking = useCallback(() => {
    const snapshot = createProjectSnapshot(project);
    setLastSavedState(snapshot);
    setHasUnsavedChanges(false);
    console.log('🔄 Unsaved changes tracking reset');
  }, [project, createProjectSnapshot]);

  // Check if current project state differs from last saved state
  useEffect(() => {
    // Skip tracking if no project ID (empty project)
    if (!currentProjectId) {
      setHasUnsavedChanges(false);
      return;
    }

    // Skip initial render or when project reference hasn't changed
    if (project === projectRef.current) {
      return;
    }

    projectRef.current = project;

    const currentSnapshot = createProjectSnapshot(project);
    
    // If we don't have a saved state yet, set the current state as saved
    if (!lastSavedState) {
      setLastSavedState(currentSnapshot);
      setHasUnsavedChanges(false);
      return;
    }

    // Compare current state with last saved state
    const hasChanges = currentSnapshot !== lastSavedState;
    
    if (hasChanges !== hasUnsavedChanges) {
      setHasUnsavedChanges(hasChanges);
      console.log(hasChanges ? '⚠️ Unsaved changes detected' : '✅ All changes saved');
    }
  }, [project, lastSavedState, hasUnsavedChanges, currentProjectId, createProjectSnapshot]);

  // Reset tracking when project ID changes (new project loaded)
  useEffect(() => {
    if (currentProjectId) {
      resetTracking();
    }
  }, [currentProjectId, resetTracking]);

  // Browser beforeunload event to warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Você tem alterações não salvas. Tem certeza que deseja sair?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  return {
    hasUnsavedChanges,
    markAsSaved,
    resetTracking
  };
}; 