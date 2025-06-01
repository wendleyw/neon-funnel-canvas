
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSupabaseWorkspace } from '../hooks/useSupabaseWorkspace';
import { useAuth } from '../contexts/AuthContext';
import { Plus, FolderOpen, User, LogIn } from 'lucide-react';
import { WorkspaceCard } from './Workspace/WorkspaceCard';
import { ProjectCard } from './Workspace/ProjectCard';
import { CreateWorkspaceModal } from './Workspace/CreateWorkspaceModal';
import { AuthModal } from './Auth/AuthModal';
import { ProfileModal } from './Profile/ProfileModal';
import { ErrorBoundary } from './ErrorBoundary';

interface WorkspaceSelectorProps {
  onProjectSelect: (projectId: string) => void;
  onNewProject: () => void;
}

export const WorkspaceSelector = React.memo<WorkspaceSelectorProps>(({
  onProjectSelect,
  onNewProject
}) => {
  const { user, loading: authLoading } = useAuth();
  const {
    currentWorkspace,
    setCurrentWorkspace,
    workspaces,
    createWorkspace,
    deleteWorkspace,
    loadWorkspaces,
    getWorkspaceProjects,
    loading: workspaceLoading
  } = useSupabaseWorkspace();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadWorkspaces();
    }
  }, [user, loadWorkspaces]);

  const handleCreateWorkspace = useCallback(async (name: string, description?: string) => {
    const workspace = await createWorkspace(name, description);
    if (workspace) {
      setCurrentWorkspace(workspace);
    }
    setShowCreateForm(false);
  }, [createWorkspace, setCurrentWorkspace]);

  const handleDeleteWorkspace = useCallback((workspaceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este workspace?')) {
      deleteWorkspace(workspaceId);
    }
  }, [deleteWorkspace]);

  const handleToggleCreateForm = useCallback(() => {
    setShowCreateForm(prev => !prev);
  }, []);

  const handleBackToWorkspaces = useCallback(() => {
    setCurrentWorkspace(null);
  }, [setCurrentWorkspace]);

  const projects = useMemo(() => {
    return currentWorkspace ? getWorkspaceProjects(currentWorkspace.id) : [];
  }, [currentWorkspace, getWorkspaceProjects]);

  if (authLoading || workspaceLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <div className="flex-1 flex flex-col items-center justify-center bg-black text-white p-8">
          <div className="max-w-md w-full text-center">
            <h1 className="text-3xl font-bold mb-4">Funnel Builder</h1>
            <p className="text-gray-400 mb-8">
              Crie e gerencie seus funnels de vendas de forma visual e intuitiva
            </p>
            
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full flex items-center justify-center gap-2 p-4 bg-white text-black rounded hover:bg-gray-200 transition-colors font-medium"
            >
              <LogIn size={20} />
              Entrar / Criar Conta
            </button>
            
            <p className="text-xs text-gray-500 mt-4">
              Faça login para acessar seus workspaces e projetos
            </p>
          </div>
        </div>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </ErrorBoundary>
    );
  }

  if (!currentWorkspace) {
    return (
      <ErrorBoundary>
        <div className="flex-1 flex flex-col bg-black text-white">
          {/* Header with user info */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Meus Workspaces</h1>
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors p-2 rounded"
            >
              <User size={20} />
              <span className="text-sm">{user.email}</span>
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="max-w-md w-full">
              {workspaces.length === 0 ? (
                <div className="text-center mb-8">
                  <p className="text-gray-400 mb-4">Nenhum workspace encontrado</p>
                  <p className="text-sm text-gray-500">Crie seu primeiro workspace para começar</p>
                </div>
              ) : (
                <div className="space-y-2 mb-8">
                  {workspaces.map((workspace) => (
                    <WorkspaceCard
                      key={workspace.id}
                      workspace={workspace}
                      onSelect={setCurrentWorkspace}
                      onDelete={handleDeleteWorkspace}
                    />
                  ))}
                </div>
              )}

              <CreateWorkspaceModal
                showCreateForm={showCreateForm}
                onToggleForm={handleToggleCreateForm}
                onCreate={handleCreateWorkspace}
              />
            </div>
          </div>
        </div>

        <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex-1 flex flex-col bg-black text-white">
        {/* Workspace Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handleBackToWorkspaces}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <FolderOpen size={16} />
              <span className="text-sm">Voltar aos Workspaces</span>
            </button>
            
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors p-2 rounded"
            >
              <User size={16} />
              <span className="text-xs">{user.email}</span>
            </button>
          </div>
          <h1 className="text-xl font-bold">{currentWorkspace.name}</h1>
          {currentWorkspace.description && (
            <p className="text-gray-400 text-sm">{currentWorkspace.description}</p>
          )}
        </div>

        {/* Projects Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* New Project Card */}
            <button
              onClick={onNewProject}
              className="p-6 bg-gray-900 border-2 border-dashed border-gray-700 rounded hover:border-gray-600 transition-colors flex flex-col items-center justify-center min-h-32"
            >
              <Plus size={24} className="mb-2" />
              <span className="text-sm">Novo Projeto</span>
            </button>

            {/* Existing Projects */}
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={onProjectSelect}
              />
            ))}
          </div>
        </div>

        <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      </div>
    </ErrorBoundary>
  );
});

WorkspaceSelector.displayName = 'WorkspaceSelector';
