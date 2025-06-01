
import React, { useState, useCallback } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Canvas } from '../components/Canvas';
import { Toolbar } from '../components/Toolbar';
import { StatusBar } from '../components/StatusBar';
import { CreateProjectModal } from '../components/ProjectCreator/CreateProjectModal';
import { OpenProjectModal } from '../components/ProjectLoader/OpenProjectModal';
import { FunnelComponent, Connection } from '../types/funnel';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useHotkeys } from 'react-hotkeys-hook';
import { initialProject } from '../data/initialProject';

const Index = () => {
  const [project, setProject] = useLocalStorage('funnel-project', initialProject);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);

  const handleDragStart = useCallback((template: any) => {
    console.log('Starting drag for template:', template);
  }, []);

  const handleComponentAdd = useCallback((component: FunnelComponent) => {
    setProject(prev => ({
      ...prev,
      components: [...prev.components, component]
    }));
  }, [setProject]);

  const handleComponentUpdate = useCallback((id: string, updates: Partial<FunnelComponent>) => {
    setProject(prev => ({
      ...prev,
      components: prev.components.map(component =>
        component.id === id ? { ...component, ...updates } : component
      )
    }));
  }, [setProject]);

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
  }, [setProject]);

  const handleConnectionAdd = useCallback((connection: Connection) => {
    setProject(prev => ({
      ...prev,
      connections: [...prev.connections, connection]
    }));
  }, [setProject]);

  const handleConnectionDelete = useCallback((connectionId: string) => {
    setProject(prev => ({
      ...prev,
      connections: prev.connections.filter(connection => connection.id !== connectionId)
    }));
  }, [setProject]);

  const handleConnectionUpdate = useCallback((connectionId: string, updates: Partial<Connection>) => {
    setProject(prev => ({
      ...prev,
      connections: prev.connections.map(connection =>
        connection.id === connectionId ? { ...connection, ...updates } : connection
      )
    }));
  }, [setProject]);

  const handleProjectCreate = useCallback((newProject: any) => {
    setProject(newProject);
    setIsCreateModalOpen(false);
  }, [setProject]);

  const handleProjectOpen = useCallback((loadedProject: any) => {
    setProject(loadedProject);
    setIsOpenModalOpen(false);
  }, [setProject]);

  const handleAddCompleteTemplate = useCallback((newComponents: FunnelComponent[], newConnections: Connection[]) => {
    setProject(prev => ({
      ...prev,
      components: [...prev.components, ...newComponents],
      connections: [...prev.connections, ...newConnections]
    }));
  }, [setProject]);

  const handleSave = useCallback(() => {
    alert('Projeto salvo!');
  }, []);

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
  }, [project]);

  const handleClear = useCallback(() => {
    if (window.confirm('Tem certeza que deseja limpar o projeto?')) {
      setProject(initialProject);
    }
  }, [setProject]);

  const handleBackToWorkspace = useCallback(() => {
    // Implementar navegação para workspace
    console.log('Voltar para workspace');
  }, []);

  const handleProjectNameChange = useCallback((name: string) => {
    setProject(prev => ({
      ...prev,
      name
    }));
  }, [setProject]);

  useHotkeys('ctrl+s, command+s', (e) => {
    e.preventDefault();
    handleSave();
  });

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
          workspaceName="Workspace"
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
