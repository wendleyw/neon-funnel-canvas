import { useEffect, useRef } from 'react';
import { useWorkspaceContext } from '../../../contexts/WorkspaceContext';
import { useProjectStore } from '../../../store/projectStore';
import { logger } from '../../../lib/logger';

/**
 * Hook that integrates Zustand project store with WorkspaceContext auto-save
 * Replaces the useDebounceProjectSave functionality
 */
export const useZustandAutoSave = () => {
  const { addProjectToWorkspace, currentWorkspace } = useWorkspaceContext();
  
  const {
    project,
    currentProjectId,
    hasUnsavedChanges,
    autoSaveEnabled,
    autoSaveDelay,
    markAsSaved,
    setError,
    setSaving,
    setCurrentProjectId,
  } = useProjectStore();
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');
  const currentProjectIdRef = useRef<string | null>(currentProjectId);
  
  // Update ref when projectId changes
  useEffect(() => {
    currentProjectIdRef.current = currentProjectId;
  }, [currentProjectId]);
  
  // Auto-save effect
  useEffect(() => {
    if (!hasUnsavedChanges || !autoSaveEnabled || !currentWorkspace) {
      return;
    }
    
    // Generate project hash to check for actual changes
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
    
    // Skip if project hasn't actually changed
    if (lastSavedRef.current === projectHash) {
      logger.log('🔄 Project unchanged, skipping auto-save');
      return;
    }
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        logger.log('💾 Auto-saving project via Zustand:', project.name);
        
        const result = await addProjectToWorkspace(
          project,
          currentWorkspace.id,
          currentProjectIdRef.current || undefined,
          true // isAutoSave flag
        );
        
        if (result) {
          // Update the current project ID if this was a new project
          if (!currentProjectIdRef.current && result.id) {
            setCurrentProjectId(result.id);
            currentProjectIdRef.current = result.id;
          }
          
          lastSavedRef.current = projectHash;
          markAsSaved();
          logger.log('✅ Project auto-saved successfully');
        } else {
          setError('Failed to auto-save project');
          logger.error('❌ Auto-save failed: No result returned');
        }
      } catch (error: any) {
        logger.error('❌ Auto-save failed:', error);
        setError(error.message || 'Failed to auto-save project');
      } finally {
        setSaving(false);
      }
    }, autoSaveDelay);
    
    logger.log(`⏱️ Auto-save scheduled in ${autoSaveDelay}ms`);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    project,
    hasUnsavedChanges,
    autoSaveEnabled,
    autoSaveDelay,
    currentWorkspace,
    addProjectToWorkspace,
    markAsSaved,
    setError,
    setSaving,
    setCurrentProjectId,
  ]);
  
  // Force save function
  const forceSave = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (!currentWorkspace) {
      setError('No workspace selected');
      return { success: false };
    }
    
    try {
      setSaving(true);
      logger.log('💾 Force saving project via Zustand:', project.name);
      
      const result = await addProjectToWorkspace(
        project,
        currentWorkspace.id,
        currentProjectIdRef.current || undefined,
        false // not auto-save
      );
      
      if (result) {
        // Update the current project ID if this was a new project
        if (!currentProjectIdRef.current && result.id) {
          setCurrentProjectId(result.id);
          currentProjectIdRef.current = result.id;
        }
        
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
        markAsSaved();
        logger.log('✅ Project force-saved successfully');
        return { success: true, projectId: result.id };
      } else {
        setError('Failed to save project');
        logger.error('❌ Force save failed: No result returned');
        return { success: false };
      }
    } catch (error: any) {
      logger.error('❌ Force save failed:', error);
      setError(error.message || 'Failed to save project');
      return { success: false };
    } finally {
      setSaving(false);
    }
  };
  
  // Cancel save function
  const cancelSave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      logger.log('🚫 Auto-save cancelled');
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return {
    forceSave,
    cancelSave,
  };
}; 