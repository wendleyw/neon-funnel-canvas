
import { useCallback, useState, useMemo } from 'react';

const ZOOM_INTENSITY = 0.1;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3;

export const useCanvasZoom = () => {
  const [zoom, setZoom] = useState(1);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -ZOOM_INTENSITY : ZOOM_INTENSITY;
    
    setZoom(prevZoom => {
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prevZoom + delta));
      return newZoom;
    });
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(MAX_ZOOM, prev + ZOOM_INTENSITY));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(MIN_ZOOM, prev - ZOOM_INTENSITY));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  const fitToScreen = useCallback(() => {
    // Esta função pode ser expandida para calcular o zoom ideal baseado nos componentes
    setZoom(1);
  }, []);

  const zoomActions = useMemo(() => ({
    handleWheel,
    handleZoomIn,
    handleZoomOut,
    resetZoom,
    fitToScreen
  }), [handleWheel, handleZoomIn, handleZoomOut, resetZoom, fitToScreen]);

  return {
    zoom,
    ...zoomActions
  };
};
