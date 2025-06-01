import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useWorkspace } from '../hooks/useWorkspace';
import { Plus, FolderOpen } from 'lucide-react';
import { WorkspaceCard } from './Workspace/WorkspaceCard';
import { ProjectCard } from './Workspace/ProjectCard';
import { CreateWorkspaceModal } from './Workspace/CreateWorkspaceModal';
import { ErrorBoundary } from './ErrorBoundary';

interface WorkspaceSelectorProps {
  onProjectSelect: (projectId: string) => void;
  onNewProject: () => void;
}

export const WorkspaceSelector = React.memo<WorkspaceSelectorProps>(({
  onProjectSelect,
  onNewProject
}) => {
  const {
    currentWorkspace,
    setCurrentWorkspace,
    workspaces,
    createWorkspace,
    deleteWorkspace,
    loadWorkspaces,
    getWorkspaceProjects
  } = useWorkspace();

  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  const handleCreateWorkspace = useCallback((name: string, description?: string) => {
    const workspace = createWorkspace(name, description);
    setCurrentWorkspace(workspace);
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

  if (!currentWorkspace) {
    return (
      <ErrorBoundary>
        <div className="flex-1 flex flex-col items-center justify-center bg-black text-white p-8">
          <div className="max-w-md w-full">
            <h1 className="text-2xl font-bold mb-8 text-center">Workspaces</h1>
            
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
      </div>
    </ErrorBoundary>
  );
});

WorkspaceSelector.displayName = 'WorkspaceSelector';
