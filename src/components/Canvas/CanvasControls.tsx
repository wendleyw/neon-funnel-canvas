
import React from 'react';

interface CanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({ zoom, onZoomIn, onZoomOut }) => {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
      <button
        onClick={onZoomIn}
        className="w-8 h-8 bg-gray-900 hover:bg-gray-700 border border-gray-600 rounded flex items-center justify-center text-white text-sm transition-colors"
      >
        +
      </button>
      <div className="w-8 h-6 bg-gray-900 border border-gray-600 rounded flex items-center justify-center text-xs text-white">
        {Math.round(zoom * 100)}%
      </div>
      <button
        onClick={onZoomOut}
        className="w-8 h-8 bg-gray-900 hover:bg-gray-700 border border-gray-600 rounded flex items-center justify-center text-xs text-white transition-colors"
      >
        -
      </button>
    </div>
  );
};
