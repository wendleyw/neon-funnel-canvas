import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

export const CanvasNavigationHelp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="absolute bottom-4 left-4 p-2 bg-gray-800/80 backdrop-blur-sm rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/80 transition-colors"
        title="Show navigation help"
      >
        <Info className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 text-sm text-gray-300 max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-white">Navigation Tips</h4>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <ul className="space-y-1">
        <li className="flex items-center gap-2">
          <kbd className="px-2 py-0.5 bg-gray-700 rounded text-xs">Click + Drag</kbd>
          <span>Pan canvas</span>
        </li>
        <li className="flex items-center gap-2">
          <kbd className="px-2 py-0.5 bg-gray-700 rounded text-xs">Scroll</kbd>
          <span>Vertical pan</span>
        </li>
        <li className="flex items-center gap-2">
          <kbd className="px-2 py-0.5 bg-gray-700 rounded text-xs">Shift + Scroll</kbd>
          <span>Horizontal pan</span>
        </li>
        <li className="flex items-center gap-2">
          <kbd className="px-2 py-0.5 bg-gray-700 rounded text-xs">Ctrl/Cmd + Scroll</kbd>
          <span>Zoom</span>
        </li>
        <li className="flex items-center gap-2">
          <kbd className="px-2 py-0.5 bg-gray-700 rounded text-xs">Right Click</kbd>
          <span>Pan canvas</span>
        </li>
      </ul>
    </div>
  );
}; 