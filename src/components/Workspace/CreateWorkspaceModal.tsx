
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface CreateWorkspaceModalProps {
  showCreateForm: boolean;
  onToggleForm: () => void;
  onCreate: (name: string, description?: string) => void;
}

export const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({
  showCreateForm,
  onToggleForm,
  onCreate
}) => {
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');

  const handleCreate = () => {
    if (newWorkspaceName.trim()) {
      onCreate(newWorkspaceName, newWorkspaceDesc);
      setNewWorkspaceName('');
      setNewWorkspaceDesc('');
    }
  };

  const handleCancel = () => {
    onToggleForm();
    setNewWorkspaceName('');
    setNewWorkspaceDesc('');
  };

  if (showCreateForm) {
    return (
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
            onClick={handleCreate}
            className="flex-1 bg-white text-black py-2 px-4 rounded hover:bg-gray-200 transition-colors"
          >
            Criar
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onToggleForm}
      className="w-full flex items-center justify-center gap-2 p-3 bg-white text-black rounded hover:bg-gray-200 transition-colors"
    >
      <Plus size={20} />
      Novo Workspace
    </button>
  );
};
