
import { useCallback, useState, useMemo, useRef } from 'react';
import { CanvasPosition } from '../../types/canvas';

export const useCanvasPan = () => {
  const [pan, setPan] = useState<CanvasPosition>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState<CanvasPosition>({ x: 0, y: 0 });
  const panStartRef = useRef<CanvasPosition>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Permitir pan com botão esquerdo (0), do meio (1) ou com space+left click
    if (e.button === 0 || e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      // Verificar se o clique é no canvas background ou diretamente no canvas container
      const target = e.target as Element;
      const isCanvasBackground = target === e.currentTarget || 
                                target.classList.contains('canvas-background') ||
                                target.classList.contains('canvas-container') ||
                                target.tagName === 'svg';
      
      if (isCanvasBackground || e.button === 1 || e.ctrlKey) {
        e.preventDefault();
        setIsPanning(true);
        setLastPanPosition({ x: e.clientX, y: e.clientY });
        panStartRef.current = { x: e.clientX, y: e.clientY };
        
        // Mudar cursor para grabbing
        document.body.style.cursor = 'grabbing';
      }
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      e.preventDefault();
      
      const deltaX = e.clientX - lastPanPosition.x;
      const deltaY = e.clientY - lastPanPosition.y;
      
      // Aplicar o movimento de pan
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
    }
  }, [isPanning]);

  // Handler para mouse leave - para quando o mouse sai da área do canvas
  const handleMouseLeave = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      document.body.style.cursor = '';
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
    centerCanvas
  }), [handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave, resetPan, centerCanvas]);

  return {
    pan,
    isPanning,
    ...panHandlers
  };
};
