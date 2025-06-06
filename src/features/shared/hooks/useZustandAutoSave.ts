import { useUnifiedWorkspace } from '../../../contexts/UnifiedWorkspaceContext';
import { useProjectStore } from '../../../store/projectStore';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook that integrates Zustand project store with WorkspaceContext auto-save
 * Replaces the useDebounceProjectSave functionality
 */
export const useZustandAutoSave = () => {
  const workspace = useUnifiedWorkspace();
  const project = useProjectStore(state => state.project);
  const currentProjectId = useProjectStore(state => state.currentProjectId);
  const markAsSaved = useProjectStore(state => state.markAsSaved);
  const setSaving = useProjectStore(state => state.setSaving);
  const { user } = useAuth();
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!project || !workspace.currentWorkspace || !user) return;

    // Capture user and workspace at this moment to avoid null issues
    const currentUser = user;
    const currentWorkspaceId = workspace.currentWorkspace.id;

    // Clear any existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Schedule auto-save with captured values
    autoSaveTimeoutRef.current = setTimeout(async () => {
      // Double-check user is still available
      if (currentUser && currentUser.id) {
        setSaving(true);
        try {
          const result = await workspace.saveProject(project, currentWorkspaceId, currentProjectId || undefined);
          if (result?.success) {
            markAsSaved();
          }
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setSaving(false);
        }
      }
    }, 2000); // 2 second delay

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [project, workspace, currentProjectId, user, markAsSaved, setSaving]);

  /**
   * Force save the current project immediately
   */
  const forceSave = useCallback(async (): Promise<{ success: boolean; projectId?: string }> => {
    if (!project || !workspace.currentWorkspace || !user) {
      return { success: false };
    }

    // Cancel any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = null;
    }

    setSaving(true);
    try {
      // Save immediately
      const result = await workspace.saveProject(project, workspace.currentWorkspace.id, currentProjectId || undefined);
      if (result?.success) {
        markAsSaved();
      }
      return result;
    } catch (error) {
      console.error('Force save failed:', error);
      return { success: false };
    } finally {
      setSaving(false);
    }
  }, [project, workspace, currentProjectId, user, markAsSaved, setSaving]);

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