
import React, { useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { AdvancedExportModal } from './AdvancedExportModal';
import { FunnelProject } from '../types/funnel';

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
  project: FunnelProject;
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
  componentsCount = 0,
  project
}) => {
  const [showAdvancedExport, setShowAdvancedExport] = useState(false);

  return (
    <>
      <div className="h-12 bg-black border-b border-gray-800 flex items-center justify-between px-2 lg:px-4 shrink-0">
        {/* Left Section */}
        <div className="flex items-center space-x-2 lg:space-x-3 min-w-0">
          <button
            onClick={onBackToWorkspace}
            className="flex items-center gap-1 lg:gap-2 text-gray-400 hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft size={16} />
            <span className="text-xs lg:text-sm truncate max-w-20 lg:max-w-none">
              {workspaceName || 'Workspaces'}
            </span>
          </button>
          <div className="w-px h-4 lg:h-6 bg-gray-700 shrink-0" />
          <input
            type="text"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            className="bg-transparent border-none text-white text-xs lg:text-sm focus:outline-none focus:bg-gray-900 px-1 lg:px-2 py-1 rounded min-w-0 max-w-32 lg:max-w-none"
            placeholder="Nome do Projeto"
          />
        </div>

        {/* Center Section - Hidden on small screens */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            onClick={onSave}
            className="bg-white hover:bg-gray-200 text-black px-2 lg:px-3 py-1 rounded text-xs lg:text-sm font-medium transition-colors"
          >
            Salvar
          </button>
          <button
            onClick={onLoad}
            className="bg-gray-800 hover:bg-gray-700 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm font-medium transition-colors border border-gray-600"
          >
            Carregar
          </button>
          <button
            onClick={() => setShowAdvancedExport(true)}
            className="bg-gray-800 hover:bg-gray-700 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm font-medium transition-colors border border-gray-600 flex items-center gap-1"
          >
            <Download size={14} />
            Exportar
          </button>
          <button
            onClick={onClear}
            className="bg-gray-800 hover:bg-gray-700 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm font-medium transition-colors border border-gray-600"
          >
            Limpar
          </button>
        </div>

        {/* Mobile Actions Menu */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={onSave}
            className="bg-white hover:bg-gray-200 text-black px-2 py-1 rounded text-xs font-medium transition-colors"
          >
            Salvar
          </button>
          <button
            onClick={() => setShowAdvancedExport(true)}
            className="bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors border border-gray-600"
          >
            <Download size={12} />
          </button>
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex items-center space-x-3">
          <div className="text-gray-400 text-xs">
            Componentes: <span className="text-white font-medium">{componentsCount}</span>
          </div>
        </div>
      </div>

      <AdvancedExportModal
        isOpen={showAdvancedExport}
        onClose={() => setShowAdvancedExport(false)}
        project={project}
      />
    </>
  );
};
