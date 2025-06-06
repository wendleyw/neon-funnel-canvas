import React, { useMemo } from 'react';

interface CanvasGridProps {
  zoom: number;
  pan: { x: number; y: number };
  isDragOver?: boolean;
}

export const CanvasGrid: React.FC<CanvasGridProps> = ({ zoom, pan }) => {
  const gridStyle = useMemo(() => {
    const gridSize = 50;
    const scaledGridSize = gridSize * zoom;
    
    // Calculate grid offset to ensure it tiles properly
    const offsetX = pan.x % scaledGridSize;
    const offsetY = pan.y % scaledGridSize;
    
    return {
      position: 'absolute' as const,
      inset: 0,
      backgroundImage: `
        linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
      `,
      backgroundSize: `${scaledGridSize}px ${scaledGridSize}px`,
      backgroundPosition: `${offsetX}px ${offsetY}px`,
      pointerEvents: 'none' as const
    };
  }, [zoom, pan.x, pan.y]);

  // Dots at grid intersections for better visual reference
  const dotsStyle = useMemo(() => {
    const dotSize = 100;
    const scaledDotSize = dotSize * zoom;
    
    const offsetX = pan.x % scaledDotSize;
    const offsetY = pan.y % scaledDotSize;
    
    return {
      position: 'absolute' as const,
      inset: 0,
      backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px)`,
      backgroundSize: `${scaledDotSize}px ${scaledDotSize}px`,
      backgroundPosition: `${offsetX}px ${offsetY}px`,
      pointerEvents: 'none' as const
    };
  }, [zoom, pan.x, pan.y]);

  return (
    <>
      <div style={gridStyle} />
      <div style={dotsStyle} />
    </>
  );
};
