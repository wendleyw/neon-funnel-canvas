import React from 'react';
import { Link } from 'react-router-dom';
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

  if (!isInEditor) {
    return (
      <div className="relative">
        <WorkspaceSelector
          onProjectSelect={projectHandlers.handleProjectSelect}
          onNewProject={projectHandlers.handleNewProject}
        />
      </div>
    );
  }

  return (
    <div className="relative">
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
    </div>
  );
};

export default Index;
