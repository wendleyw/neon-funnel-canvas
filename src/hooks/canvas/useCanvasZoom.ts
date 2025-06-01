
import { useCallback, useState, useMemo } from 'react';

const ZOOM_INTENSITY = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;

export const useCanvasZoom = () => {
  const [zoom, setZoom] = useState(1);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prevZoom => {
      const newZoom = e.deltaY > 0 
        ? Math.max(MIN_ZOOM, prevZoom - ZOOM_INTENSITY)
        : Math.min(MAX_ZOOM, prevZoom + ZOOM_INTENSITY);
      return newZoom;
    });
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(MAX_ZOOM, prev + ZOOM_INTENSITY));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(MIN_ZOOM, prev - ZOOM_INTENSITY));
  }, []);

  const zoomActions = useMemo(() => ({
    handleWheel,
    handleZoomIn,
    handleZoomOut
  }), [handleWheel, handleZoomIn, handleZoomOut]);

  return {
    zoom,
    ...zoomActions
  };
};
