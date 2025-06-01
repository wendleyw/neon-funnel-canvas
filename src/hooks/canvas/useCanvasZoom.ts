
import { useCallback, useState } from 'react';

export const useCanvasZoom = () => {
  const [zoom, setZoom] = useState(1);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const newZoom = e.deltaY > 0 
      ? Math.max(0.5, zoom - zoomIntensity)
      : Math.min(2, zoom + zoomIntensity);
    
    setZoom(newZoom);
  }, [zoom]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(2, prev + 0.1));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(0.5, prev - 0.1));
  }, []);

  return {
    zoom,
    handleWheel,
    handleZoomIn,
    handleZoomOut
  };
};
