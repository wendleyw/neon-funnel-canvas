/**
 * Canvas positioning utilities for smart component placement
 */

export interface ViewportInfo {
  x: number;
  y: number;
  zoom: number;
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

/**
 * Calculate the center position of the current viewport
 * @param viewport - Current viewport information
 * @returns Position in canvas coordinates
 */
export const getViewportCenter = (viewport: ViewportInfo): Position => {
  // Calculate the center of what's currently visible
  const centerX = (-viewport.x + viewport.width / 2) / viewport.zoom;
  const centerY = (-viewport.y + viewport.height / 2) / viewport.zoom;
  
  return { x: centerX, y: centerY };
};

/**
 * Convert screen coordinates to canvas coordinates
 * @param screenX - X coordinate in screen space
 * @param screenY - Y coordinate in screen space
 * @param viewport - Current viewport information
 * @param canvasRect - Canvas DOM rectangle
 * @returns Position in canvas coordinates
 */
export const screenToCanvas = (
  screenX: number, 
  screenY: number, 
  viewport: ViewportInfo, 
  canvasRect: DOMRect
): Position => {
  const canvasX = (screenX - canvasRect.left - viewport.x) / viewport.zoom;
  const canvasY = (screenY - canvasRect.top - viewport.y) / viewport.zoom;
  
  return { x: canvasX, y: canvasY };
};

/**
 * Get smart positioning for new components
 * @param viewport - Current viewport information
 * @param options - Positioning options
 * @returns Position in canvas coordinates
 */
export const getSmartPosition = (
  viewport: ViewportInfo,
  options: {
    avoidOverlap?: boolean;
    existingPositions?: Position[];
    offsetAmount?: number;
    preferredPosition?: Position;
  } = {}
): Position => {
  const {
    avoidOverlap = true,
    existingPositions = [],
    offsetAmount = 50,
    preferredPosition
  } = options;

  // Use preferred position if provided, otherwise use viewport center
  let position = preferredPosition || getViewportCenter(viewport);

  // Add small random offset to avoid exact overlapping
  const randomOffset = () => (Math.random() - 0.5) * 40; // ±20px variation
  position = {
    x: position.x + randomOffset(),
    y: position.y + randomOffset()
  };

  // Avoid overlap with existing components if requested
  if (avoidOverlap && existingPositions.length > 0) {
    let attempts = 0;
    const maxAttempts = 20;
    
    while (attempts < maxAttempts) {
      const hasOverlap = existingPositions.some(existing => {
        const distance = Math.sqrt(
          Math.pow(position.x - existing.x, 2) + 
          Math.pow(position.y - existing.y, 2)
        );
        return distance < 120; // Minimum distance between components
      });

      if (!hasOverlap) break;

      // Try a new position with larger offset
      const offsetX = (Math.random() - 0.5) * offsetAmount * (attempts + 1);
      const offsetY = (Math.random() - 0.5) * offsetAmount * (attempts + 1);
      
      const basePosition = preferredPosition || getViewportCenter(viewport);
      position = {
        x: basePosition.x + offsetX,
        y: basePosition.y + offsetY
      };

      attempts++;
    }
  }

  return position;
};

/**
 * Get the current viewport information from a canvas element
 * @param canvasElement - Canvas DOM element
 * @returns Viewport information or null if not available
 */
export const getCanvasViewport = (canvasElement: HTMLElement | null): ViewportInfo | null => {
  if (!canvasElement) return null;

  const rect = canvasElement.getBoundingClientRect();
  
  // Look for transform styles on the canvas content
  const canvasContent = canvasElement.querySelector('.canvas-viewport') as HTMLElement;
  
  if (!canvasContent) {
    // Fallback to default viewport
    return {
      x: 0,
      y: 0,
      zoom: 1,
      width: rect.width,
      height: rect.height
    };
  }

  const transform = canvasContent.style.transform || '';
  
  // Parse transform values
  const translateMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
  const scaleMatch = transform.match(/scale\(([^)]+)\)/);
  
  const x = translateMatch ? parseFloat(translateMatch[1].replace('px', '')) : 0;
  const y = translateMatch ? parseFloat(translateMatch[2].replace('px', '')) : 0;
  const zoom = scaleMatch ? parseFloat(scaleMatch[1]) : 1;

  return {
    x,
    y,
    zoom,
    width: rect.width,
    height: rect.height
  };
};

/**
 * Focus the canvas on a specific position with smooth animation
 * @param canvasElement - Canvas DOM element
 * @param position - Position to focus on
 * @param zoom - Optional zoom level
 */
export const focusOnPosition = (
  canvasElement: HTMLElement | null,
  position: Position,
  zoom?: number
): void => {
  if (!canvasElement) return;

  const canvasContent = canvasElement.querySelector('.canvas-viewport') as HTMLElement;
  if (!canvasContent) return;

  const rect = canvasElement.getBoundingClientRect();
  const targetZoom = zoom || 1;
  
  // Calculate the transform needed to center the position
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const newX = centerX - (position.x * targetZoom);
  const newY = centerY - (position.y * targetZoom);
  
  // Apply smooth transition
  canvasContent.style.transition = 'transform 0.5s ease-out';
  canvasContent.style.transform = `translate(${newX}px, ${newY}px) scale(${targetZoom})`;
  
  // Remove transition after animation
  setTimeout(() => {
    canvasContent.style.transition = '';
  }, 500);
}; 