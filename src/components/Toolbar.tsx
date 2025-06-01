
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ToolbarProps {
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onClear: () => void;
  onBackToWorkspace: () => void;
  projectName: string;
  onProjectNameChange: (name: string) => void;
  workspaceName?: string;
  componentsCount?: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  onLoad,
  onExport,
  onClear,
  onBackToWorkspace,
  projectName,
  onProjectNameChange,
  workspaceName,
  componentsCount = 0
}) => {
  return (
    <div className="h-12 bg-black border-b border-gray-800 flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onBackToWorkspace}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">{workspaceName || 'Workspaces'}</span>
        </button>
        <div className="w-px h-6 bg-gray-700" />
        <input
          type="text"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          className="bg-transparent border-none text-white text-sm focus:outline-none focus:bg-gray-900 px-2 py-1 rounded"
          placeholder="Nome do Projeto"
        />
      </div>

      {/* Center Section */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onSave}
          className="bg-white hover:bg-gray-200 text-black px-3 py-1 rounded text-sm font-medium transition-colors"
        >
          Salvar
        </button>
        <button
          onClick={onLoad}
          className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors border border-gray-600"
        >
          Carregar
        </button>
        <button
          onClick={onExport}
          className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors border border-gray-600"
        >
          Exportar
        </button>
        <button
          onClick={onClear}
          className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors border border-gray-600"
        >
          Limpar
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        <div className="text-gray-400 text-xs">
          Componentes: <span className="text-white font-medium">{componentsCount}</span>
        </div>
      </div>
    </div>
  );
};
