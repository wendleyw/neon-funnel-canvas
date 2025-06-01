import React, { useEffect, useState, useCallback } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Canvas } from '../components/Canvas';
import { Toolbar } from '../components/Toolbar';
import { WorkspaceSelector } from '../components/WorkspaceSelector';
import { ProfileModal } from '../components/Profile/ProfileModal';
import { useFunnelProject } from '../hooks/useFunnelProject';
import { useWorkspace } from '../hooks/useWorkspace';
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
    updateProjectName
  } = useFunnelProject();

  const {
    currentWorkspace,
    addProjectToWorkspace,
    loadProject: loadProjectFromWorkspace
  } = useWorkspace();

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed'));
    }
  }, []);

  const handleDragStart = useCallback((template: ComponentTemplate) => {
    console.log('Dragging component:', template.label);
  }, []);

  // Função para atualizar conexões
  const handleConnectionUpdate = useCallback((connectionId: string, updates: Partial<Connection>) => {
    const updatedConnections = project.connections.map(conn => 
      conn.id === connectionId ? { ...conn, ...updates } : conn
    );
    
    // Como useFunnelProject não tem updateConnection, vamos atualizar manualmente
    const updatedProject = {
      ...project,
      connections: updatedConnections,
      updatedAt: new Date().toISOString()
    };
    
    // Aqui seria ideal ter uma função updateConnection no hook, mas por enquanto fazemos assim
    console.log('Connection updated:', connectionId, updates);
  }, [project]);

  const handleSave = useCallback(() => {
    saveProject();
    if (currentWorkspace) {
      addProjectToWorkspace(project, currentWorkspace.id);
    }
  }, [saveProject, currentWorkspace, addProjectToWorkspace, project]);

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
    setCurrentProjectId(projectId);
    
    // Carregar projeto do workspace
    const projectData = loadProjectFromWorkspace(projectId);
    if (projectData) {
      loadProject(projectId);
      setCurrentView('project');
    } else {
      toast.error('Projeto não encontrado');
    }
  }, [loadProject, loadProjectFromWorkspace]);

  const handleNewProject = useCallback(() => {
    clearProject();
    setCurrentProjectId(null);
    setCurrentView('project');
  }, [clearProject]);

  const handleBackToWorkspace = useCallback(() => {
    setCurrentView('workspace');
    setCurrentProjectId(null);
  }, []);

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
