import React, { useState } from 'react';
import { ArrowLeft, Download, Save, FolderOpen, Trash2, FileText, Link, AlertCircle } from 'lucide-react';
import { AdvancedExportModal } from '@/features/shared/components/AdvancedExportModal';
import { FunnelProject } from '../../../types/funnel';

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
  enableConnectionValidation?: boolean;
  onToggleConnectionValidation?: () => void;
  hasUnsavedChanges?: boolean;
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
  project,
  enableConnectionValidation,
  onToggleConnectionValidation,
  hasUnsavedChanges = false
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
            {/* Unsaved changes indicator */}
            {hasUnsavedChanges && (
              <div className="flex items-center gap-1 ml-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-xs text-yellow-500 font-medium">
                  Unsaved
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Minimalist Action Buttons */}
        <div className="flex items-center space-x-1">
          {onToggleConnectionValidation && (
            <button
              onClick={onToggleConnectionValidation}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${
                enableConnectionValidation 
                  ? 'text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30' 
                  : 'text-green-400 hover:text-green-300 bg-green-900/20 hover:bg-green-900/30'
              }`}
              title={enableConnectionValidation ? "Restricted Connections (click to allow)" : "Free Connections (click to restrict)"}
            >
              <Link size={16} />
            </button>
          )}
          
          <button
            onClick={onSave}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 relative ${
              hasUnsavedChanges 
                ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-900/20 hover:bg-yellow-900/30' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title={hasUnsavedChanges ? "Save Changes (Ctrl+S)" : "Save Project (Ctrl+S)"}
          >
            <Save size={16} />
            {hasUnsavedChanges && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                <AlertCircle size={8} className="text-black" />
              </div>
            )}
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
