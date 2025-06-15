import { useUnifiedWorkspace } from '../../../contexts/UnifiedWorkspaceContext';
import { useProjectStore } from '../../../store/projectStore';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useRef, useCallback } from 'react';
import { error } from '@/lib/logger';

/**
 * Hook that integrates Zustand project store with WorkspaceContext auto-save
 * Replaces the useDebounceProjectSave functionality
 */
export function useZustandAutoSave() {
  const workspace = useUnifiedWorkspace();
  const project = useProjectStore(state => state.project);
  const currentProjectId = useProjectStore(state => state.currentProjectId);
  const hasUnsavedChanges = useProjectStore(state => state.hasUnsavedChanges);
  const markAsSaved = useProjectStore(state => state.markAsSaved);
  const setSaving = useProjectStore(state => state.setSaving);
  const { user } = useAuth();
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');

  useEffect(() => {
    // Only auto-save if there are actual unsaved changes
    if (!project || !workspace.currentWorkspace || !user || !hasUnsavedChanges) return;

    // Capture user and workspace at this moment to avoid null issues
    const currentUser = user;
    const currentWorkspaceId = workspace.currentWorkspace.id;

    // Create a stable representation of the data that matters for saving
    const projectDataString = JSON.stringify({
      name: project.name,
      components: project.components,
      connections: project.connections,
    });

    // Don't save if data hasn't actually changed
    if (lastSavedDataRef.current === projectDataString) {
      return;
    }

    // Clear any existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Schedule auto-save with captured values
    autoSaveTimeoutRef.current = setTimeout(async () => {
      // Double-check user is still available and data hasn't changed
      if (currentUser && currentUser.id && lastSavedDataRef.current !== projectDataString) {
        setSaving(true);
        try {
          const result = await workspace.saveProject(project, currentWorkspaceId, currentProjectId || undefined);
          if (result?.success) {
            lastSavedDataRef.current = projectDataString;
            markAsSaved();
          }
        } catch (err) {
          error('Auto-save failed:', err);
        } finally {
          setSaving(false);
        }
      }
    }, 3000); // 3 second delay (increased from 2)

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [project, workspace, currentProjectId, user, hasUnsavedChanges, markAsSaved, setSaving]);

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
        // Update the last saved data reference
        const projectDataString = JSON.stringify({
          name: project.name,
          components: project.components,
          connections: project.connections,
        });
        lastSavedDataRef.current = projectDataString;
        markAsSaved();
      }
      return result;
    } catch (err) {
      error('Force save failed:', err);
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
}
