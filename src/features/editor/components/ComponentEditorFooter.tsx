import React from 'react';
import { Button } from '@/features/shared/ui/button';
import { X, Save } from 'lucide-react';

interface ComponentEditorFooterProps {
  onClose: () => void;
  isSaving?: boolean; // Optional prop for indicating save operation
}

export const ComponentEditorFooter: React.FC<ComponentEditorFooterProps> = ({
  onClose,
  isSaving = false,
}) => {
  return (
    <div className="flex-shrink-0 flex items-center justify-end gap-3 p-3 sm:p-4 border-t border-gray-700/50 bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-b-2xl">
      <Button 
        variant="outline"
        onClick={(e) => {
          e.stopPropagation(); // Prevent form submission if this button is inside the form
          onClose();
        }}
        className="border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-600/50"
        disabled={isSaving}
      >
        <X className="w-4 h-4 mr-2" />
        Cancel
      </Button>
      <Button 
        type="submit" // This button will submit the form it's placed in
        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
}; 