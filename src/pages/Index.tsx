import React, { useState, useCallback } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Canvas } from '../components/Canvas';
import { Toolbar } from '../components/Toolbar';
import { StatusBar } from '../components/StatusBar';
import { WorkspaceSelector } from '../components/WorkspaceSelector';
import { CreateProjectModal } from '../components/ProjectCreator/CreateProjectModal';
import { OpenProjectModal } from '../components/ProjectLoader/OpenProjectModal';
import { FunnelComponent, Connection, FunnelProject } from '../types/funnel';
import { useWorkspace } from '../hooks/useWorkspace';
import { useHotkeys } from 'react-hotkeys-hook';
import { initialProject } from '../data/initialProject';
import { toast } from 'sonner';

const Index = () => {
  const { 
    currentWorkspace, 
    addProjectToWorkspace, 
    loadProject 
  } = useWorkspace();

  const [project, setProject] = useState(initialProject);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
  const [isInEditor, setIsInEditor] = useState(false);

  const handleDragStart = useCallback((template: any) => {
    console.log('Starting drag for template:', template);
  }, []);

  const handleComponentAdd = useCallback((component: FunnelComponent) => {
    setProject(prev => ({
      ...prev,
      components: [...prev.components, component]
    }));
  }, []);

  const handleComponentUpdate = useCallback((id: string, updates: Partial<FunnelComponent>) => {
    setProject(prev => ({
      ...prev,
      components: prev.components.map(component =>
        component.id === id ? { ...component, ...updates } : component
      )
    }));
  }, []);

  const handleComponentDelete = useCallback((id: string) => {
    setProject(prev => {
      const updatedComponents = prev.components.filter(component => component.id !== id);
      const updatedConnections = prev.connections.filter(connection =>
        connection.from !== id && connection.to !== id
      );

      return {
        ...prev,
        components: updatedComponents,
        connections: updatedConnections
      };
    });
  }, []);

  const handleConnectionAdd = useCallback((connection: Connection) => {
    setProject(prev => ({
      ...prev,
      connections: [...prev.connections, connection]
    }));
  }, []);

  const handleConnectionDelete = useCallback((connectionId: string) => {
    setProject(prev => ({
      ...prev,
      connections: prev.connections.filter(connection => connection.id !== connectionId)
    }));
  }, []);

  const handleConnectionUpdate = useCallback((connectionId: string, updates: Partial<Connection>) => {
    setProject(prev => ({
      ...prev,
      connections: prev.connections.map(connection =>
        connection.id === connectionId ? { ...connection, ...updates } : connection
      )
    }));
  }, []);

  const handleProjectSelect = useCallback((projectId: string) => {
    const projectData = loadProject(projectId);
    if (projectData) {
      // Convert to unknown first, then validate the structure
      const unknownProject = projectData as unknown;
      
      // Validate that the loaded data has the required FunnelProject structure
      if (
        unknownProject && 
        typeof unknownProject === 'object' && 
        'name' in unknownProject && 
        'id' in unknownProject &&
        'components' in unknownProject &&
        'connections' in unknownProject
      ) {
        const typedProject = unknownProject as FunnelProject;
        setProject(typedProject);
        setCurrentProjectId(projectId);
        setIsInEditor(true);
        console.log('Project loaded:', typedProject.name);
      } else {
        toast.error('Dados do projeto inválidos');
      }
    } else {
      toast.error('Erro ao carregar projeto');
    }
  }, [loadProject]);

  const handleNewProject = useCallback(() => {
    setProject(initialProject);
    setCurrentProjectId(null);
    setIsInEditor(true);
  }, []);

  const handleProjectCreate = useCallback((newProject: any) => {
    setProject(newProject);
    setCurrentProjectId(null);
    setIsCreateModalOpen(false);
    setIsInEditor(true);
  }, []);

  const handleProjectOpen = useCallback((loadedProject: any) => {
    setProject(loadedProject);
    setIsOpenModalOpen(false);
  }, []);

  const handleAddCompleteTemplate = useCallback((newComponents: FunnelComponent[], newConnections: Connection[]) => {
    setProject(prev => ({
      ...prev,
      components: [...prev.components, ...newComponents],
      connections: [...prev.connections, ...newConnections]
    }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!currentWorkspace) {
      toast.error('Nenhum workspace selecionado');
      return;
    }

    const success = await addProjectToWorkspace(project, currentWorkspace.id);
    if (success) {
      toast.success('Projeto salvo com sucesso!');
      if (!currentProjectId) {
        // Se é um novo projeto, pode definir um ID baseado no timestamp
        setCurrentProjectId(`project-${Date.now()}`);
      }
    }
  }, [project, currentWorkspace, addProjectToWorkspace, currentProjectId]);

  const handleLoad = useCallback(() => {
    setIsOpenModalOpen(true);
  }, []);

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Projeto exportado!');
  }, [project]);

  const handleClear = useCallback(() => {
    if (window.confirm('Tem certeza que deseja limpar o projeto?')) {
      setProject(initialProject);
      toast.success('Projeto limpo!');
    }
  }, []);

  const handleBackToWorkspace = useCallback(() => {
    console.log('Voltar para workspace');
    setIsInEditor(false);
    setCurrentProjectId(null);
  }, []);

  const handleProjectNameChange = useCallback((name: string) => {
    setProject(prev => ({
      ...prev,
      name
    }));
  }, []);

  useHotkeys('ctrl+s, command+s', (e) => {
    e.preventDefault();
    if (isInEditor) {
      handleSave();
    }
  });

  // Se não está no editor, mostra o WorkspaceSelector
  if (!isInEditor) {
    return (
      <WorkspaceSelector
        onProjectSelect={handleProjectSelect}
        onNewProject={handleNewProject}
      />
    );
  }

  // Se está no editor, mostra o editor de funil
  return (
    <div className="h-screen flex bg-black">
      <Sidebar 
        onDragStart={handleDragStart} 
        onAddCompleteTemplate={handleAddCompleteTemplate}
      />
      
      <div className="flex-1 flex flex-col">
        <Toolbar 
          onSave={handleSave}
          onLoad={handleLoad}
          onExport={handleExport}
          onClear={handleClear}
          onBackToWorkspace={handleBackToWorkspace}
          projectName={project.name}
          onProjectNameChange={handleProjectNameChange}
          workspaceName={currentWorkspace?.name}
          componentsCount={project.components.length}
        />
        <StatusBar 
          components={project.components}
          connections={project.connections}
        />
        
        <Canvas
          components={project.components}
          connections={project.connections}
          onComponentAdd={handleComponentAdd}
          onComponentUpdate={handleComponentUpdate}
          onComponentDelete={handleComponentDelete}
          onConnectionAdd={handleConnectionAdd}
          onConnectionDelete={handleConnectionDelete}
          onConnectionUpdate={handleConnectionUpdate}
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

export default Index;
