import React from 'react';
import { Compass } from 'lucide-react';

export const ExploreContent: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full p-4">
      <div className="text-center py-8">
        <Compass className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-white text-lg font-medium mb-2">Explore Community</h3>
        <p className="text-gray-400 text-sm mb-4">
          Discover templates created by the community
        </p>
        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors">
          Coming Soon
        </button>
      </div>
    </div>
  );
}; 