
import React, { useCallback, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Canvas } from './Canvas';
import { Toolbar } from './Toolbar';
import { StatusBar } from './StatusBar';
import { CreateProjectModal } from './ProjectCreator/CreateProjectModal';
import { OpenProjectModal } from './ProjectLoader/OpenProjectModal';
import { FunnelProject } from '../types/funnel';
import { useProjectHandlers } from '../hooks/useProjectHandlers';
import { useHotkeys } from 'react-hotkeys-hook';

interface FunnelEditorProps {
  project: FunnelProject;
  setProject: React.Dispatch<React.SetStateAction<FunnelProject>>;
  currentProjectId: string | null;
  setCurrentProjectId: React.Dispatch<React.SetStateAction<string | null>>;
  loadProjectData: (projectData: FunnelProject, projectId?: string) => void;
  resetProject: () => void;
  enterEditor: () => void;
  onBackToWorkspace: () => void;
  handleProjectNameChange: (name: string) => void;
  currentWorkspace?: { id: string; name: string; description?: string } | null;
}

export const FunnelEditor: React.FC<FunnelEditorProps> = ({
  project,
  setProject,
  currentProjectId,
  setCurrentProjectId,
  loadProjectData,
  resetProject,
  enterEditor,
  onBackToWorkspace,
  handleProjectNameChange,
  currentWorkspace
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);

  const projectHandlers = useProjectHandlers({
    project,
    setProject,
    currentProjectId,
    setCurrentProjectId,
    loadProjectData,
    resetProject,
    enterEditor
  });

  const handleDragStart = useCallback((template: any) => {
    console.log('Starting drag for template:', template);
  }, []);

  const handleProjectCreate = useCallback((newProject: FunnelProject) => {
    loadProjectData(newProject);
    setIsCreateModalOpen(false);
  }, [loadProjectData]);

  const handleProjectOpen = useCallback((loadedProject: FunnelProject) => {
    loadProjectData(loadedProject);
    setIsOpenModalOpen(false);
  }, [loadProjectData]);

  const handleLoad = useCallback(() => {
    setIsOpenModalOpen(true);
  }, []);

  useHotkeys('ctrl+s, command+s', (e) => {
    e.preventDefault();
    projectHandlers.handleSave();
  });

  return (
    <div className="h-screen flex bg-black">
      <Sidebar 
        onDragStart={handleDragStart} 
        onAddCompleteTemplate={projectHandlers.handleAddCompleteTemplate}
      />
      
      <div className="flex-1 flex flex-col">
        <Toolbar 
          onSave={projectHandlers.handleSave}
          onLoad={handleLoad}
          onExport={projectHandlers.handleExport}
          onClear={projectHandlers.handleClear}
          onBackToWorkspace={onBackToWorkspace}
          projectName={project.name}
          onProjectNameChange={handleProjectNameChange}
          workspaceName={currentWorkspace?.name || ''}
          componentsCount={project.components.length}
        />
        <StatusBar 
          components={project.components}
          connections={project.connections}
        />
        
        <Canvas
          components={project.components}
          connections={project.connections}
          onComponentAdd={projectHandlers.handleComponentAdd}
          onComponentUpdate={projectHandlers.handleComponentUpdate}
          onComponentDelete={projectHandlers.handleComponentDelete}
          onConnectionAdd={projectHandlers.handleConnectionAdd}
          onConnectionDelete={projectHandlers.handleConnectionDelete}
          onConnectionUpdate={projectHandlers.handleConnectionUpdate}
        />
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleProjectCreate}
      />

      <OpenProjectModal
        isOpen={isOpenModalOpen}
        onClose={() => setIsOpenModalOpen(false)}
        onProjectOpen={handleProjectOpen}
      />
    </div>
  );
};
