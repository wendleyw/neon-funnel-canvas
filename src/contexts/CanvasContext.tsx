import React, { createContext, useContext, ReactNode } from 'react';
import { FunnelComponent, Connection } from '../types/funnel';

interface CanvasState {
  components: FunnelComponent[];
  connections: Connection[];
  selectedComponent: string | null;
  connectingFrom: string | null;
  selectedConnection: string | null;
  pan: { x: number; y: number };
  zoom: number;
  isPanning: boolean;
  isDragOver: boolean;
}

interface CanvasActions {
  // Component actions
  onComponentAdd: (component: FunnelComponent) => void;
  onComponentUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  onComponentDelete: (id: string) => void;
  onComponentSelect: (componentId: string) => void;
  
  // Connection actions
  onConnectionAdd: (connection: Connection) => void;
  onConnectionDelete: (connectionId: string) => void;
  onConnectionUpdate?: (connectionId: string, updates: Partial<Connection>) => void;
  onConnectionSelect: (connectionId: string) => void;
  onConnectionColorChange?: (connectionId: string, updates: Partial<Connection>) => void;
  
  // Canvas interactions
  startConnection: (componentId: string) => void;
  handleComponentConnect: (componentId: string) => void;
  clearSelection: () => void;
  
  // Zoom actions
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleWheel: (e: React.WheelEvent) => void;
  
  // Pan actions
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleMouseLeave?: (e: React.MouseEvent) => void;
  handleCanvasMouseDown: (e: React.MouseEvent) => void;
  handleContextMenu?: (e: React.MouseEvent) => void;
  
  // Drag & Drop actions
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragEnter: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  
  // Internal state setters
  setSelectedComponent: (id: string | null) => void;
}

interface CanvasContextType extends CanvasState, CanvasActions {
  canvasRef: React.RefObject<HTMLDivElement>;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

interface CanvasProviderProps {
  children: ReactNode;
  value: CanvasContextType;
}

export function CanvasProvider({ children, value }: CanvasProviderProps) {
  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvas() {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
}
