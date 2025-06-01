
import { useCallback, useState, useMemo } from 'react';
import { CanvasPosition } from '../../types/canvas';

export const useCanvasPan = () => {
  const [pan, setPan] = useState<CanvasPosition>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState<CanvasPosition>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Check if the click is on the canvas background
    if (e.target === e.currentTarget || (e.target as Element).closest('.canvas-background')) {
      setIsPanning(true);
      setLastPanPosition({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPosition.x;
      const deltaY = e.clientY - lastPanPosition.y;
      
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPosition({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPosition.x, lastPanPosition.y]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const panHandlers = useMemo(() => ({
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  }), [handleMouseDown, handleMouseMove, handleMouseUp]);

  return {
    pan,
    isPanning,
    ...panHandlers
  };
};
