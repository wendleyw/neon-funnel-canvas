
import React from 'react';

interface CanvasGridProps {
  zoom: number;
  pan: { x: number; y: number };
  isDragOver: boolean;
}

export const CanvasGrid: React.FC<CanvasGridProps> = ({ zoom, pan, isDragOver }) => {
  return (
    <>
      {/* Canvas Grid */}
      <div 
        className={`fixed inset-0 opacity-5 canvas-background ${isDragOver ? 'bg-gray-900' : ''}`}
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
          width: '100vw',
          height: '100vh',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      />
      
      {isDragOver && (
        <div className="fixed inset-0 border-2 border-dashed border-white opacity-30 pointer-events-none z-50" />
      )}
    </>
  );
};
