
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

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Don't start dragging if clicking on connection points or buttons
    if ((e.target as Element).closest('.connection-point') || 
        (e.target as Element).closest('button')) {
      return;
    }
    
    setIsDragging(true);
    setHasDragged(false);
    
    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && nodeRef.current) {
      e.preventDefault();
      setHasDragged(true);
      
      const canvas = nodeRef.current.closest('.canvas-container');
      const canvasRect = canvas?.getBoundingClientRect();
      
      if (canvasRect) {
        const newPosition = {
          x: Math.max(0, e.clientX - canvasRect.left - dragOffset.x),
          y: Math.max(0, e.clientY - canvasRect.top - dragOffset.y)
        };
        onDrag(componentId, newPosition);
      }
    }
  }, [isDragging, dragOffset, componentId, onDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    
    // Só chama onSelect se não arrastou o componente
    if (!hasDragged) {
      onSelect();
    }
    
    setHasDragged(false);
  }, [hasDragged, onSelect]);

  return {
    isDragging,
    nodeRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
