import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Canvas } from '../components/Canvas';
import { Toolbar } from '../components/Toolbar';
import { WorkspaceSelector } from '../components/WorkspaceSelector';
import { useFunnelProject } from '../hooks/useFunnelProject';
import { useWorkspace } from '../hooks/useWorkspace';
import { ComponentTemplate } from '../types/funnel';
import { toast } from 'sonner';

const Index = () => {
  const [currentView, setCurrentView] = useState<'workspace' | 'project'>('workspace');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  
  const {
    project,
    addComponent,
    updateComponent,
    deleteComponent,
    addConnection,
    deleteConnection,
    saveProject,
    loadProject,
    exportProject,
    clearProject,
    updateProjectName
  } = useFunnelProject();

  const {
    currentWorkspace,
    addProjectToWorkspace
  } = useWorkspace();

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed'));
    }
  }, []);

  const handleDragStart = (template: ComponentTemplate) => {
    console.log('Dragging component:', template.label);
  };

  const handleSave = () => {
    saveProject();
    if (currentWorkspace) {
      addProjectToWorkspace(project, currentWorkspace.id);
    }
    toast.success('Projeto salvo com sucesso!');
  };

  const handleLoad = () => {
    toast.info('Funcionalidade de carregar abriria um seletor de projeto');
  };

  const handleExport = () => {
    exportProject();
    toast.success('Projeto exportado com sucesso!');
  };

  const handleClear = () => {
    clearProject();
    toast.success('Canvas limpo!');
  };

  const handleProjectSelect = (projectId: string) => {
    setCurrentProjectId(projectId);
    loadProject(projectId);
    setCurrentView('project');
  };

  const handleNewProject = () => {
    clearProject();
    setCurrentProjectId(null);
    setCurrentView('project');
  };

  const handleBackToWorkspace = () => {
    setCurrentView('workspace');
    setCurrentProjectId(null);
  };

  if (currentView === 'workspace') {
    return (
      <div className="min-h-screen bg-black">
        <WorkspaceSelector
          onProjectSelect={handleProjectSelect}
          onNewProject={handleNewProject}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col w-full">
      {/* Toolbar */}
      <Toolbar
        onSave={handleSave}
        onLoad={handleLoad}
        onExport={handleExport}
        onClear={handleClear}
        onBackToWorkspace={handleBackToWorkspace}
        projectName={project.name}
        onProjectNameChange={updateProjectName}
        workspaceName={currentWorkspace?.name}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <Sidebar onDragStart={handleDragStart} />
        
        {/* Canvas */}
        <Canvas
          components={project.components}
          connections={project.connections}
          onComponentAdd={addComponent}
          onComponentUpdate={updateComponent}
          onComponentDelete={deleteComponent}
          onConnectionAdd={addConnection}
          onConnectionDelete={deleteConnection}
        />
      </div>
      
      {/* Status Bar */}
      <div className="h-8 bg-black border-t border-gray-800 flex items-center justify-between px-4 text-xs text-gray-400">
        <div>
          Pronto • {project.components.length} componentes • {project.connections.length} conexões
        </div>
        <div>
          FunnelCraft v1.0 • PWA Ready
        </div>
      </div>
    </div>
  );
};

export default Index;
