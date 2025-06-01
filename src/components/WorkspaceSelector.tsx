import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../hooks/useWorkspace';
import { Plus, FolderOpen, Trash2 } from 'lucide-react';

interface WorkspaceSelectorProps {
  onProjectSelect: (projectId: string) => void;
  onNewProject: () => void;
}

export const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({
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
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim()) {
      const workspace = createWorkspace(newWorkspaceName, newWorkspaceDesc);
      setCurrentWorkspace(workspace);
      setNewWorkspaceName('');
      setNewWorkspaceDesc('');
      setShowCreateForm(false);
    }
  };

  const handleDeleteWorkspace = (workspaceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este workspace?')) {
      deleteWorkspace(workspaceId);
    }
  };

  if (!currentWorkspace) {
    return (
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
                <div
                  key={workspace.id}
                  onClick={() => setCurrentWorkspace(workspace)}
                  className="p-4 bg-gray-900 rounded border border-gray-700 hover:border-gray-600 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-medium">{workspace.name}</h3>
                    {workspace.description && (
                      <p className="text-sm text-gray-400">{workspace.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {workspace.projects.length} projeto(s)
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteWorkspace(workspace.id, e)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {showCreateForm ? (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nome do workspace"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
                autoFocus
              />
              <input
                type="text"
                placeholder="Descrição (opcional)"
                value={newWorkspaceDesc}
                onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateWorkspace}
                  className="flex-1 bg-white text-black py-2 px-4 rounded hover:bg-gray-200 transition-colors"
                >
                  Criar
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full flex items-center justify-center gap-2 p-3 bg-white text-black rounded hover:bg-gray-200 transition-colors"
            >
              <Plus size={20} />
              Novo Workspace
            </button>
          )}
        </div>
      </div>
    );
  }

  const projects = getWorkspaceProjects(currentWorkspace.id);

  return (
    <div className="flex-1 flex flex-col bg-black text-white">
      {/* Workspace Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setCurrentWorkspace(null)}
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
            <div
              key={project.id}
              onClick={() => onProjectSelect(project.id)}
              className="p-4 bg-gray-900 rounded border border-gray-700 hover:border-gray-600 cursor-pointer transition-colors"
            >
              <h3 className="font-medium mb-2">{project.name}</h3>
              <div className="text-xs text-gray-400 space-y-1">
                <p>{project.componentsCount} componentes</p>
                <p>{project.connectionsCount} conexões</p>
                <p>Atualizado: {new Date(project.updatedAt).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
