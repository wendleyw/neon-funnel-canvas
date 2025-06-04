import React, { useState } from 'react';
import { ArrowLeft, Download, Save, FolderOpen, Trash2, FileText } from 'lucide-react';
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
      <div className="h-10 bg-black border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
        {/* Left Section */}
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={onBackToWorkspace}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-800 px-2 py-1 rounded-md"
            title="Back to Workspaces"
          >
            <ArrowLeft size={14} />
            <span className="text-xs font-medium truncate max-w-28">
              {workspaceName || 'Workspaces'}
            </span>
          </button>
          
          <div className="w-px h-4 bg-gray-700" />
          
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-gray-400" />
            <input
              type="text"
              value={projectName}
              onChange={(e) => onProjectNameChange(e.target.value)}
              className="bg-transparent border-none text-white text-xs font-medium focus:outline-none focus:bg-gray-900 px-2 py-1 rounded min-w-40 max-w-56"
              placeholder="Project Name"
            />
          </div>
        </div>

        {/* Right Section - Minimalist Action Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onSave}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
            title="Save Project (Ctrl+S)"
          >
            <Save size={16} />
          </button>
          
          <button
            onClick={onLoad}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
            title="Load Project"
          >
            <FolderOpen size={16} />
          </button>
          
          <button
            onClick={() => setShowAdvancedExport(true)}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
            title="Export Project"
          >
            <Download size={16} />
          </button>
          
          <button
            onClick={onClear}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-all duration-200"
            title="Clear All Components"
          >
            <Trash2 size={16} />
          </button>
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
