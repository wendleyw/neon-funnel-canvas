import React from 'react';
import { Button } from './ui/button';
import { EditorModalBase as ModalBase } from './shared/EditorModalBase';
import { AlertTriangle, Save, X } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
  projectName?: string;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onSave,
  onDiscard,
  onCancel,
  projectName = 'current project'
}) => {
  if (!isOpen) return null;

  return (
    <ModalBase 
      isOpen={isOpen} 
      onClose={onCancel} 
      modalClassName="sm:max-w-lg"
    >
      <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-800/80 backdrop-blur-sm z-10">
        <h2 className="text-xl font-semibold text-white text-center">Unsaved Changes</h2>
      </div>

      <div className="p-6 flex-grow overflow-y-auto">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            You have unsaved changes in "{projectName}"!
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Do you want to save your changes before proceeding? Otherwise, your work will be lost.
          </p>
        </div>

        <div className="bg-gray-700 p-3 rounded-md mb-6">
          <p className="text-xs text-gray-400">
            💡 <strong>Tip:</strong> Use Ctrl+S (or Cmd+S) to quickly save your projects.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            onClick={onDiscard}
            variant="outline"
            className="w-full border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Discard Changes
          </Button>
          
          <Button 
            onClick={onCancel}
            variant="secondary"
            className="w-full bg-gray-500 hover:bg-gray-600 text-white order-first sm:order-none"
          >
            Cancel
          </Button>

          <Button 
            onClick={onSave} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save and Continue
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}; 