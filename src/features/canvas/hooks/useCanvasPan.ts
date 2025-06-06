import { useCallback, useState, useMemo, useRef } from 'react';
import { CanvasPosition } from '../../../types/canvas';

export const useCanvasPan = () => {
  const [pan, setPan] = useState<CanvasPosition>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState<CanvasPosition>({ x: 0, y: 0 });
  const panStartRef = useRef<CanvasPosition>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Allow panning with middle mouse button (1) or Ctrl+left click or right click
    if (e.button === 1 || (e.button === 0 && e.ctrlKey) || e.button === 2) {
      e.preventDefault();
      setIsPanning(true);
      setLastPanPosition({ x: e.clientX, y: e.clientY });
      panStartRef.current = { x: e.clientX, y: e.clientY };
      
      // Change cursor to grabbing
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else if (e.button === 0) {
      // For left click, check if clicking on canvas background
      const target = e.target as Element;
      const isCanvasBackground = target === e.currentTarget || 
                                target.classList.contains('canvas-background') ||
                                target.classList.contains('canvas-container') ||
                                target.classList.contains('canvas-viewport') ||
                                target.tagName === 'svg';
      
      if (isCanvasBackground && !e.ctrlKey && !e.shiftKey) {
        // Allow panning on canvas background with left click
        setIsPanning(true);
        setLastPanPosition({ x: e.clientX, y: e.clientY });
        panStartRef.current = { x: e.clientX, y: e.clientY };
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
      }
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      e.preventDefault();
      
      const deltaX = e.clientX - lastPanPosition.x;
      const deltaY = e.clientY - lastPanPosition.y;
      
      // Apply pan movement
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPosition({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPosition.x, lastPanPosition.y]);

  const handleMouseUp = useCallback((e?: React.MouseEvent) => {
    if (isPanning) {
      setIsPanning(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, [isPanning]);

  // Handler for mouse leave - when mouse leaves canvas area
  const handleMouseLeave = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, [isPanning]);

  // Reset pan position
  const resetPan = useCallback(() => {
    setPan({ x: 0, y: 0 });
  }, []);

  // Center canvas
  const centerCanvas = useCallback(() => {
    setPan({ x: 0, y: 0 });
  }, []);

  const panHandlers = useMemo(() => ({
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    resetPan,
    centerCanvas,
    setPan
  }), [handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave, resetPan, centerCanvas]);

  return {
    pan,
    isPanning,
    ...panHandlers
  };
};
