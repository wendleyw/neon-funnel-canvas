import { useCallback, useState, useRef } from 'react';

interface UseComponentDragOptions {
  componentId: string;
  onDrag: (id: string, position: { x: number; y: number }) => void;
  onSelect: () => void;
}

export const useComponentDrag = ({ componentId, onDrag, onSelect }: UseComponentDragOptions) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  
  // Cache canvas references and transform values for better performance
  const canvasCache = useRef<{
    canvas: Element | null;
    canvasRect: DOMRect | null;
    canvasContent: HTMLElement | null;
    panX: number;
    panY: number;
    scale: number;
    lastUpdateTime: number;
  }>({
    canvas: null,
    canvasRect: null,
    canvasContent: null,
    panX: 0,
    panY: 0,
    scale: 1,
    lastUpdateTime: 0
  });

  const updateCanvasCache = useCallback(() => {
    const now = performance.now();
    const cache = canvasCache.current;
    
    // Only update cache every 16ms (60fps) for performance
    if (now - cache.lastUpdateTime < 16) {
      return cache;
    }
    
    const canvas = document.querySelector('.canvas-container');
    const canvasRect = canvas?.getBoundingClientRect();
    const canvasContent = canvas?.querySelector('div[style*="transform"]') as HTMLElement;
    
    if (canvasContent) {
      const transform = canvasContent.style.transform || '';
      const translateMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      const scaleMatch = transform.match(/scale\(([^)]+)\)/);
      
      cache.panX = translateMatch ? parseFloat(translateMatch[1].replace('px', '')) : 0;
      cache.panY = translateMatch ? parseFloat(translateMatch[2].replace('px', '')) : 0;
      cache.scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
    }
    
    cache.canvas = canvas;
    cache.canvasRect = canvasRect;
    cache.canvasContent = canvasContent;
    cache.lastUpdateTime = now;
    
    return cache;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Don't start dragging if clicking on buttons, inputs, or other interactive elements
    const target = e.target as Element;
    if (target.closest('button, input, textarea, select, [contenteditable]')) {
      return;
    }
    
    e.stopPropagation();
    e.preventDefault(); // Prevent text selection
    
    const rect = nodeRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Cache initial values
    const initialDragOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    const startPosition = { x: e.clientX, y: e.clientY };
    
    setDragOffset(initialDragOffset);
    setIsDragging(true);
    setHasDragged(false);
    
    // Update canvas cache immediately
    updateCanvasCache();
    
    // Optimize node for dragging
    if (nodeRef.current) {
      nodeRef.current.style.zIndex = '9999';
      nodeRef.current.style.pointerEvents = 'none';
      nodeRef.current.style.willChange = 'transform'; // Hint for GPU acceleration
    }
    
    // Track mouse movement with requestAnimationFrame for smooth performance
    let isMoving = false;
    let animationFrameId: number;
    
    const handleMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      
      // Throttle with requestAnimationFrame for 60fps performance
      if (isMoving) return;
      
      isMoving = true;
      animationFrameId = requestAnimationFrame(() => {
        // Calculate movement distance
        const distance = Math.sqrt(
          Math.pow(event.clientX - startPosition.x, 2) + 
          Math.pow(event.clientY - startPosition.y, 2)
        );
        
        // Only consider as drag if moved more than 3 pixels (reduced threshold for better responsiveness)
        if (distance > 3) {
          setHasDragged(true);
          
          const cache = updateCanvasCache();
          
          if (cache.canvasRect) {
            // Calculate new position in canvas coordinates with cached values
            const newPosition = {
              x: (event.clientX - cache.canvasRect.left - cache.panX - initialDragOffset.x) / cache.scale,
              y: (event.clientY - cache.canvasRect.top - cache.panY - initialDragOffset.y) / cache.scale
            };
            
            onDrag(componentId, newPosition);
          }
        }
        
        isMoving = false;
      });
    };
    
    const handleMouseUp = () => {
      // Cancel any pending animation frame
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      setIsDragging(false);
      
      // Reset node optimizations
      if (nodeRef.current) {
        nodeRef.current.style.zIndex = '';
        nodeRef.current.style.pointerEvents = '';
        nodeRef.current.style.willChange = '';
      }
      
      // Remove global listeners
      document.removeEventListener('mousemove', handleMouseMove, { passive: false } as any);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Only call onSelect if component wasn't dragged
      if (!hasDragged) {
        // Use shorter timeout for better responsiveness
        setTimeout(() => onSelect(), 0);
      }
      
      setHasDragged(false);
    };
    
    // Add global event listeners with passive: false for preventDefault
    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);
  }, [componentId, onDrag, onSelect, updateCanvasCache]);

  return {
    isDragging,
    nodeRef,
    handleMouseDown
  };
};
