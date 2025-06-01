
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
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Don't start dragging if clicking on buttons
    if ((e.target as Element).closest('button')) {
      return;
    }
    
    e.stopPropagation();
    
    console.log('Starting drag for component:', componentId);
    
    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setDragStartPosition({ x: e.clientX, y: e.clientY });
      setIsDragging(true);
      setHasDragged(false);
      
      // Adiciona listeners globais para mousemove e mouseup
      const handleMouseMove = (event: MouseEvent) => {
        event.preventDefault();
        
        // Calcula a distância do movimento
        const distance = Math.sqrt(
          Math.pow(event.clientX - dragStartPosition.x, 2) + 
          Math.pow(event.clientY - dragStartPosition.y, 2)
        );
        
        // Só considera como drag se moveu mais de 5 pixels
        if (distance > 5) {
          setHasDragged(true);
          
          // Find the canvas container with the specific class
          const canvas = document.querySelector('.canvas-container');
          const canvasRect = canvas?.getBoundingClientRect();
          
          if (canvasRect) {
            // Get current transform values to calculate proper position
            const canvasContent = canvas.querySelector('div[style*="transform"]') as HTMLElement;
            const transform = canvasContent?.style.transform || '';
            
            // Extract translate and scale values
            const translateMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            const scaleMatch = transform.match(/scale\(([^)]+)\)/);
            
            const panX = translateMatch ? parseFloat(translateMatch[1].replace('px', '')) : 0;
            const panY = translateMatch ? parseFloat(translateMatch[2].replace('px', '')) : 0;
            const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
            
            const newPosition = {
              x: Math.max(0, (event.clientX - canvasRect.left - panX - dragOffset.x) / scale),
              y: Math.max(0, (event.clientY - canvasRect.top - panY - dragOffset.y) / scale)
            };
            
            console.log('Dragging component to position:', newPosition, {
              mouseX: event.clientX,
              mouseY: event.clientY,
              canvasLeft: canvasRect.left,
              canvasTop: canvasRect.top,
              panX,
              panY,
              scale,
              dragOffset
            });
            
            onDrag(componentId, newPosition);
          }
        }
      };
      
      const handleMouseUp = () => {
        console.log('Drag ended for component:', componentId, 'hasDragged:', hasDragged);
        setIsDragging(false);
        
        // Remove listeners
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        
        // Só chama onSelect se não arrastou o componente
        if (!hasDragged) {
          setTimeout(() => onSelect(), 0); // Pequeno delay para evitar conflitos
        }
        
        setHasDragged(false);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  }, [componentId, onDrag, onSelect, dragOffset.x, dragOffset.y, dragStartPosition.x, dragStartPosition.y, hasDragged]);

  return {
    isDragging,
    nodeRef,
    handleMouseDown
  };
};
