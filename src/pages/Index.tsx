
import React, { useEffect, useState, useCallback } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Canvas } from '../components/Canvas';
import { Toolbar } from '../components/Toolbar';
import { WorkspaceSelector } from '../components/WorkspaceSelector';
import { ProfileModal } from '../components/Profile/ProfileModal';
import { useFunnelProject } from '../hooks/useFunnelProject';
import { useSupabaseWorkspace } from '../hooks/useSupabaseWorkspace';
import { useAuth } from '../contexts/AuthContext';
import { ComponentTemplate, Connection } from '../types/funnel';
import { toast } from 'sonner';
import { StatusBar } from '../components/StatusBar';
import { User } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'workspace' | 'project'>('workspace');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
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
    updateProjectName,
    setProjectData
  } = useFunnelProject();

  const {
    currentWorkspace,
    setCurrentWorkspace,
    addProjectToWorkspace,
    loadProject: loadProjectFromWorkspace,
    loading: workspaceLoading
  } = useSupabaseWorkspace();

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed:', err));
    }
  }, []);

  // Debug workspace state
  useEffect(() => {
    console.log('Current workspace state:', currentWorkspace);
    console.log('Current view:', currentView);
    console.log('Workspace loading:', workspaceLoading);
  }, [currentWorkspace, currentView, workspaceLoading]);

  // Verificar se workspace está selecionado quando mudando para project view
  useEffect(() => {
    if (currentView === 'project' && !currentWorkspace && user && !workspaceLoading) {
      console.log('No workspace selected, redirecting to workspace selector');
      toast.error('Nenhum workspace selecionado. Selecione um workspace primeiro.');
      setCurrentView('workspace');
    }
  }, [currentView, currentWorkspace, user, workspaceLoading]);

  const handleDragStart = useCallback((template: ComponentTemplate) => {
    console.log('Dragging component:', template.label);
  }, []);

  const handleConnectionUpdate = useCallback((connectionId: string, updates: Partial<Connection>) => {
    const updatedConnections = project.connections.map(conn => 
      conn.id === connectionId ? { ...conn, ...updates } : conn
    );
    
    const updatedProject = {
      ...project,
      connections: updatedConnections,
      updatedAt: new Date().toISOString()
    };
    
    setProjectData(updatedProject);
    console.log('Connection updated:', connectionId, updates);
  }, [project, setProjectData]);

  const handleSave = useCallback(async () => {
    console.log('handleSave called - currentWorkspace:', currentWorkspace);
    
    if (!currentWorkspace) {
      toast.error('Nenhum workspace selecionado. Selecione um workspace primeiro.');
      setCurrentView('workspace');
      return;
    }

    console.log('Saving project to workspace:', currentWorkspace.name);
    
    try {
      // Adicionar projeto ao workspace usando Supabase
      const success = await addProjectToWorkspace(project, currentWorkspace.id);
      
      if (success) {
        toast.success(`Projeto "${project.name}" salvo no workspace "${currentWorkspace.name}"!`);
      }
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      toast.error('Erro ao salvar projeto');
    }
  }, [currentWorkspace, addProjectToWorkspace, project]);

  const handleLoad = useCallback(() => {
    toast.info('Funcionalidade de carregar abriria um seletor de projeto');
  }, []);

  const handleExport = useCallback(() => {
    exportProject();
  }, [exportProject]);

  const handleClear = useCallback(() => {
    clearProject();
    toast.success('Canvas limpo!');
  }, [clearProject]);

  const handleProjectSelect = useCallback((projectId: string) => {
    console.log('handleProjectSelect called with:', projectId, 'currentWorkspace:', currentWorkspace);
    
    if (!currentWorkspace) {
      toast.error('Workspace não encontrado');
      setCurrentView('workspace');
      return;
    }
    
    setCurrentProjectId(projectId);
    
    // Carregar projeto do workspace
    const projectData = loadProjectFromWorkspace(projectId);
    if (projectData) {
      setProjectData(projectData);
      setCurrentView('project');
      toast.success('Projeto carregado!');
    } else {
      toast.error('Projeto não encontrado');
    }
  }, [loadProjectFromWorkspace, setProjectData, currentWorkspace]);

  const handleNewProject = useCallback(() => {
    console.log('handleNewProject called - currentWorkspace:', currentWorkspace);
    
    if (!currentWorkspace) {
      toast.error('Selecione um workspace primeiro');
      setCurrentView('workspace');
      return;
    }
    
    clearProject();
    setCurrentProjectId(null);
    setCurrentView('project');
    toast.success(`Novo projeto criado no workspace "${currentWorkspace.name}"`);
  }, [clearProject, currentWorkspace]);

  const handleBackToWorkspace = useCallback(() => {
    setCurrentView('workspace');
    setCurrentProjectId(null);
  }, []);

  // Mostrar loading se ainda estiver carregando workspaces
  if (workspaceLoading && user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando workspaces...</p>
        </div>
      </div>
    );
  }

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

  // Verificação adicional para garantir que há workspace selecionado
  if (!currentWorkspace) {
    console.log('No current workspace, redirecting...');
    setCurrentView('workspace');
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Redirecionando para seleção de workspace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col w-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-black border-b border-gray-800">
        <div className="flex-1">
          <Toolbar
            onSave={handleSave}
            onLoad={handleLoad}
            onExport={handleExport}
            onClear={handleClear}
            onBackToWorkspace={handleBackToWorkspace}
            projectName={project.name}
            onProjectNameChange={updateProjectName}
            workspaceName={currentWorkspace?.name}
            componentsCount={project.components.length}
          />
        </div>
        
        {/* User info in project view */}
        {user && (
          <div className="px-4">
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors p-2 rounded"
            >
              <User size={16} />
              <span className="text-xs">{user.email}</span>
            </button>
          </div>
        )}
      </div>
      
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
          onConnectionUpdate={handleConnectionUpdate}
        />
      </div>
      
      {/* Status Bar */}
      <StatusBar 
        components={project.components}
        connections={project.connections}
      />

      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </div>
  );
};

export default Index;
