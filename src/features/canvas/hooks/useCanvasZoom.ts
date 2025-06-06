import { useCallback, useState, useMemo } from 'react';
import { CanvasPosition } from '../../../types/canvas';

const ZOOM_INTENSITY = 0.1;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const SCROLL_SENSITIVITY = 1;

interface UseCanvasZoomProps {
  pan: CanvasPosition;
  setPan: (pan: CanvasPosition | ((prev: CanvasPosition) => CanvasPosition)) => void;
}

export const useCanvasZoom = (props?: UseCanvasZoomProps) => {
  const [zoom, setZoom] = useState(1);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    // Shift + scroll for horizontal pan
    if (e.shiftKey && props?.setPan) {
      const deltaX = e.deltaY * SCROLL_SENSITIVITY;
      props.setPan(prev => ({
        x: prev.x - deltaX,
        y: prev.y
      }));
      return;
    }
    
    // Ctrl/Cmd + scroll for zoom
    if (e.ctrlKey || e.metaKey) {
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const delta = e.deltaY > 0 ? -ZOOM_INTENSITY : ZOOM_INTENSITY;
      
      setZoom(prevZoom => {
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prevZoom + delta));
        
        // Zoom towards mouse position
        if (props?.setPan) {
          const scaleDiff = newZoom - prevZoom;
          const offsetX = -(mouseX - props.pan.x) * scaleDiff / prevZoom;
          const offsetY = -(mouseY - props.pan.y) * scaleDiff / prevZoom;
          
          props.setPan(prev => ({
            x: prev.x + offsetX,
            y: prev.y + offsetY
          }));
        }
        
        return newZoom;
      });
    } else if (props?.setPan) {
      // Normal scroll for vertical pan
      const deltaY = e.deltaY * SCROLL_SENSITIVITY;
      props.setPan(prev => ({
        x: prev.x,
        y: prev.y - deltaY
      }));
    }
  }, [props]);

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
    // This function can be expanded to calculate ideal zoom based on components
    setZoom(1);
  }, []);

  const setZoomLevel = useCallback((level: number) => {
    setZoom(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, level)));
  }, []);

  const zoomActions = useMemo(() => ({
    handleWheel,
    handleZoomIn,
    handleZoomOut,
    resetZoom,
    fitToScreen,
    setZoomLevel
  }), [handleWheel, handleZoomIn, handleZoomOut, resetZoom, fitToScreen, setZoomLevel]);

  return {
    zoom,
    ...zoomActions
  };
};
