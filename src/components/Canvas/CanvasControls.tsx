import React from 'react';
import { Button } from '../ui/button';
import { ZoomIn, ZoomOut, Maximize2, Home } from 'lucide-react';

interface CanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onFitToScreen: () => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  onFitToScreen
}) => {
  const zoomPercentage = Math.round(zoom * 100);
  
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 flex flex-col gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={onZoomIn}
          className="w-8 h-8 hover:bg-gray-700"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        
        <div className="text-center text-xs text-gray-400 font-mono py-1">
          {zoomPercentage}%
        </div>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={onZoomOut}
          className="w-8 h-8 hover:bg-gray-700"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 flex flex-col gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={onResetView}
          className="w-8 h-8 hover:bg-gray-700"
          title="Reset View"
        >
          <Home className="w-4 h-4" />
        </Button>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={onFitToScreen}
          className="w-8 h-8 hover:bg-gray-700"
          title="Fit to Screen"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
