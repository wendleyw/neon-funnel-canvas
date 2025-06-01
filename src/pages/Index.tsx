
import React from 'react';
import { WorkspaceSelector } from '../components/WorkspaceSelector';
import { FunnelEditor } from '../components/FunnelEditor';
import { useWorkspace } from '../hooks/useWorkspace';
import { useProjectState } from '../hooks/useProjectState';
import { useProjectHandlers } from '../hooks/useProjectHandlers';

const Index = () => {
  const { currentWorkspace } = useWorkspace();
  
  const {
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
  } = useProjectState();

  const projectHandlers = useProjectHandlers({
    project,
    setProject,
    currentProjectId,
    setCurrentProjectId,
    loadProjectData,
    resetProject,
    enterEditor
  });

  // Se não está no editor, mostra o WorkspaceSelector
  if (!isInEditor) {
    return (
      <WorkspaceSelector
        onProjectSelect={projectHandlers.handleProjectSelect}
        onNewProject={projectHandlers.handleNewProject}
      />
    );
  }

  // Se está no editor, mostra o editor de funil
  return (
    <FunnelEditor
      project={project}
      setProject={setProject}
      currentProjectId={currentProjectId}
      setCurrentProjectId={setCurrentProjectId}
      loadProjectData={loadProjectData}
      resetProject={resetProject}
      enterEditor={enterEditor}
      onBackToWorkspace={exitEditor}
      handleProjectNameChange={handleProjectNameChange}
      currentWorkspace={currentWorkspace}
    />
  );
};

export default Index;
