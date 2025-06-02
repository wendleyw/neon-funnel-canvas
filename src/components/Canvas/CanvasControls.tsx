
import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize } from 'lucide-react';

interface CanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView?: () => void;
  onFitToScreen?: () => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({ 
  zoom, 
  onZoomIn, 
  onZoomOut,
  onResetView,
  onFitToScreen
}) => {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-20 bg-gray-900/90 backdrop-blur-sm rounded-lg p-1 border border-gray-700">
      <button
        onClick={onZoomIn}
        className="w-8 h-8 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded flex items-center justify-center text-white text-sm transition-colors"
        title="Zoom In (Ctrl + +)"
      >
        <ZoomIn size={14} />
      </button>
      
      <div className="w-8 h-6 bg-gray-800 border border-gray-600 rounded flex items-center justify-center text-xs text-white">
        {Math.round(zoom * 100)}%
      </div>
      
      <button
        onClick={onZoomOut}
        className="w-8 h-8 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded flex items-center justify-center text-white text-sm transition-colors"
        title="Zoom Out (Ctrl + -)"
      >
        <ZoomOut size={14} />
      </button>

      {onResetView && (
        <button
          onClick={onResetView}
          className="w-8 h-8 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded flex items-center justify-center text-white text-sm transition-colors"
          title="Reset View (Ctrl + 0)"
        >
          <RotateCcw size={14} />
        </button>
      )}

      {onFitToScreen && (
        <button
          onClick={onFitToScreen}
          className="w-8 h-8 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded flex items-center justify-center text-white text-sm transition-colors"
          title="Fit to Screen (Ctrl + F)"
        >
          <Maximize size={14} />
        </button>
      )}
    </div>
  );
};
