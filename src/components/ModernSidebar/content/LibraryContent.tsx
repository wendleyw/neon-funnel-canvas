import React from 'react';
import { Library } from 'lucide-react';

interface LibraryContentProps {
  onOpenReadyTemplatesModal: () => void;
}

export const LibraryContent: React.FC<LibraryContentProps> = ({ onOpenReadyTemplatesModal }) => {
  return (
    <div className="flex-1 flex flex-col h-full p-4">
      <div className="text-center py-8">
        <Library className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-white text-lg font-medium mb-2">Ready Templates</h3>
        <p className="text-gray-400 text-sm mb-4">
          Explore our library of pre-built templates
        </p>
        <button
          onClick={onOpenReadyTemplatesModal}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
        >
          View Templates
        </button>
      </div>
    </div>
  );
}; 