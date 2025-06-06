import { useUnifiedWorkspace } from '../../../contexts/UnifiedWorkspaceContext';
import { useProjectStore } from '../../../store/projectStore';
import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook that integrates Zustand project store with WorkspaceContext auto-save
 * Replaces the useDebounceProjectSave functionality
 */
export const useZustandAutoSave = () => {
  const workspace = useUnifiedWorkspace();
  const project = useProjectStore(state => state.project);
  const currentProjectId = useProjectStore(state => state.currentProjectId);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!project || !workspace.currentWorkspace) return;

    // Clear any existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Schedule auto-save with the unified workspace
    autoSaveTimeoutRef.current = setTimeout(() => {
      workspace.scheduleAutoSave(project, workspace.currentWorkspace!.id, currentProjectId || undefined);
    }, 2000); // 2 second delay

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [project, workspace, currentProjectId]);

  /**
   * Force save the current project immediately
   */
  const forceSave = useCallback(async (): Promise<{ success: boolean; projectId?: string }> => {
    if (!project || !workspace.currentWorkspace) {
      return { success: false };
    }

    // Cancel any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = null;
    }

    // Save immediately
    return await workspace.saveProject(project, workspace.currentWorkspace.id, currentProjectId || undefined);
  }, [project, workspace, currentProjectId]);

  /**
   * Cancel any pending auto-save
   */
  const cancelSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = null;
    }
  }, []);

  return {
    isSaving: workspace.saving,
    lastSaved: workspace.lastSaved,
    forceSave,
    cancelSave
  };
}; 