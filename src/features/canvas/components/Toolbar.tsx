import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, Download, Save, FolderOpen, Trash2, FileText, Link, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { AdvancedExportModal } from '@/features/shared/components/AdvancedExportModal';
import { FunnelProject } from '../../../types/funnel';

interface ToolbarProps {
  onSave: () => Promise<void>;
  onLoad: () => void;
  onExport: () => void;
  onClear: () => void;
  onBackToWorkspace: () => void;
  projectName: string;
  onProjectNameChange: (name: string) => void;
  workspaceName?: string;
  componentsCount?: number;
  project: FunnelProject;
  onToggleConnectionValidation?: () => void;
  enableConnectionValidation?: boolean;
  hasUnsavedChanges?: boolean;
  isSaving?: boolean;
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
  onToggleConnectionValidation,
  enableConnectionValidation,
  hasUnsavedChanges = false,
  isSaving = false
}) => {
  const [showAdvancedExport, setShowAdvancedExport] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'normal' | 'saving' | 'saved' | 'error'>('normal');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced save handler with visual feedback
  const handleSave = useCallback(async () => {
    if (saveStatus === 'saving') return; // Prevent double saves
    
    setSaveStatus('saving');
    
    try {
      await onSave();
      setSaveStatus('saved');
      
      // Reset to normal after 2 seconds
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        setSaveStatus('normal');
      }, 2000);
      
    } catch (error) {
      setSaveStatus('error');
      
      // Reset to normal after 3 seconds for errors
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        setSaveStatus('normal');
      }, 3000);
    }
  }, [onSave, saveStatus]);

  // Update status based on external saving state
  useEffect(() => {
    if (isSaving && saveStatus !== 'saving') {
      setSaveStatus('saving');
    }
  }, [isSaving, saveStatus]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Get save button appearance based on status
  const getSaveButtonStyles = () => {
    switch (saveStatus) {
      case 'saving':
        return {
          className: 'text-yellow-400 bg-yellow-900/20',
          icon: <Loader2 size={16} className="animate-spin" />,
          title: 'Saving...'
        };
      case 'saved':
        return {
          className: 'text-green-400 bg-green-900/20',
          icon: <CheckCircle size={16} />,
          title: 'Saved!'
        };
      case 'error':
        return {
          className: 'text-red-400 bg-red-900/20',
          icon: <AlertCircle size={16} />,
          title: 'Save failed - Click to retry'
        };
      default:
        return {
          className: hasUnsavedChanges 
            ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-900/20 hover:bg-yellow-900/30' 
            : 'text-gray-400 hover:text-white hover:bg-gray-800',
          icon: <Save size={16} />,
          title: hasUnsavedChanges ? "Save Changes (Ctrl+S)" : "Save Project (Ctrl+S)"
        };
    }
  };

  const saveButtonStyles = getSaveButtonStyles();

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
          {/* Connection validation button removed to hide "Free Connections" text */}
          {/* {onToggleConnectionValidation && (
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
          )} */}
          
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 relative ${saveButtonStyles.className} disabled:cursor-not-allowed`}
            title={saveButtonStyles.title}
          >
            {saveButtonStyles.icon}
            {hasUnsavedChanges && saveStatus === 'normal' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
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
