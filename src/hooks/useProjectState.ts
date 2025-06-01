
import { useState, useCallback } from 'react';
import { FunnelProject } from '../types/funnel';
import { initialProject } from '../data/initialProject';

export const useProjectState = () => {
  const [project, setProject] = useState<FunnelProject>(initialProject);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isInEditor, setIsInEditor] = useState(false);

  const handleProjectNameChange = useCallback((name: string) => {
    setProject(prev => ({
      ...prev,
      name
    }));
  }, []);

  const resetProject = useCallback(() => {
    setProject(initialProject);
    setCurrentProjectId(null);
  }, []);

  const loadProjectData = useCallback((projectData: FunnelProject, projectId?: string) => {
    setProject(projectData);
    setCurrentProjectId(projectId || null);
    setIsInEditor(true);
  }, []);

  const enterEditor = useCallback(() => {
    setIsInEditor(true);
  }, []);

  const exitEditor = useCallback(() => {
    setIsInEditor(false);
    setCurrentProjectId(null);
  }, []);

  return {
    project,
    setProject,
    currentProjectId,
    setCurrentProjectId,
    isInEditor,
    handleProjectNameChange,
    resetProject,
    loadProjectData,
    enterEditor,
    exitEditor
  };
};
