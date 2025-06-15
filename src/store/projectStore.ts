import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { Node, Edge, Viewport } from 'reactflow';
import React from 'react';
import { FunnelProject, FunnelComponent, Connection } from '../types/funnel';
import { initialProject } from '../data/initialProject';
import { toast } from 'sonner';
import { logger } from '../lib/logger';

// Convert between FunnelComponent and ReactFlow Node
const componentToNode = (component: FunnelComponent): Node => ({
  id: component.id,
  type: 'custom',
  position: component.position,
  data: {
    ...component.data,
    originalType: component.type,
  },
});

const nodeToComponent = (node: Node): FunnelComponent => ({
  id: node.id,
  type: node.data.originalType || 'custom',
  position: node.position,
  data: node.data,
  connections: [], // Will be calculated from edges
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Convert between Connection and ReactFlow Edge
const connectionToEdge = (connection: Connection): Edge => ({
  id: connection.id,
  source: connection.from,
  target: connection.to,
  type: 'smoothstep',
  animated: connection.animated || false,
  style: {
    stroke: connection.color || connection.customColor || '#6366f1',
  },
  data: connection.connectionData,
});

const edgeToConnection = (edge: Edge): Connection => ({
  id: edge.id,
  from: edge.source,
  to: edge.target,
  type: 'success', // Default type
  color: edge.style?.stroke as string,
  animated: edge.animated,
  connectionData: edge.data,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export interface ProjectState {
  // === CORE PROJECT STATE ===
  project: FunnelProject;
  currentProjectId: string | null;
  isInEditor: boolean;
  hasUnsavedChanges: boolean;
  lastSavedAt: Date | null;
  
  // === REACT FLOW STATE ===
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
  selectedNodes: string[];
  selectedEdges: string[];
  
  // === UI STATE ===
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  mode: 'edit' | 'view' | 'presentation';
  
  // === AUTO-SAVE STATE ===
  autoSaveEnabled: boolean;
  autoSaveDelay: number;
  saveInProgress: boolean;
  
  // === CORE PROJECT ACTIONS ===
  setProject: (project: FunnelProject) => void;
  updateProjectName: (name: string) => void;
  resetProject: () => void;
  loadProjectData: (projectData: FunnelProject, projectId?: string) => void;
  enterEditor: () => void;
  exitEditor: () => void;
  setCurrentProjectId: (id: string | null) => void;
  
  // === COMPONENT ACTIONS ===
  addComponent: (component: FunnelComponent) => void;
  updateComponent: (id: string, updates: Partial<FunnelComponent>) => void;
  deleteComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  
  // === CONNECTION ACTIONS ===
  addConnection: (connection: Connection) => void;
  deleteConnection: (connectionId: string) => void;
  updateConnection: (id: string, updates: Partial<Connection>) => void;
  
  // === REACT FLOW ACTIONS ===
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
  setViewport: (viewport: Viewport) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  deleteNode: (id: string) => void;
  addEdge: (edge: Edge) => void;
  updateEdge: (id: string, updates: Partial<Edge>) => void;
  deleteEdge: (id: string) => void;
  
  // === SELECTION ACTIONS ===
  setSelectedNodes: (nodeIds: string[]) => void;
  setSelectedEdges: (edgeIds: string[]) => void;
  clearSelection: () => void;
  selectNode: (nodeId: string, multi?: boolean) => void;
  selectEdge: (edgeId: string, multi?: boolean) => void;
  
  // === UTILITY ACTIONS ===
  exportProject: () => void;
  clearProject: () => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  setMode: (mode: 'edit' | 'view' | 'presentation') => void;
  markAsChanged: () => void;
  markAsSaved: () => void;
  
  // === AUTO-SAVE ACTIONS ===
  setAutoSaveEnabled: (enabled: boolean) => void;
  setAutoSaveDelay: (delay: number) => void;
  triggerAutoSave: () => void;
  
  // === SYNC ACTIONS ===
  syncFromReactFlow: () => void;
  syncToReactFlow: () => void;
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // === INITIAL STATE ===
      project: initialProject,
      currentProjectId: null,
      isInEditor: false,
      hasUnsavedChanges: false,
      lastSavedAt: null,
      
      // React Flow state
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      selectedNodes: [],
      selectedEdges: [],
      
      // UI state
      isLoading: false,
      isSaving: false,
      error: null,
      mode: 'edit',
      
      // Auto-save state
      autoSaveEnabled: true,
      autoSaveDelay: 3000,
      saveInProgress: false,
      
      // === CORE PROJECT ACTIONS ===
      setProject: (project) => {
        logger.log('🔄 Project updated in store:', project.name);
        set((state) => {
          // Check if project data actually changed to prevent unnecessary updates
          const existingProject = state.project;
          const hasActualChanges = 
            existingProject.name !== project.name ||
            existingProject.components.length !== project.components.length ||
            existingProject.connections.length !== project.connections.length ||
            JSON.stringify(existingProject.components) !== JSON.stringify(project.components) ||
            JSON.stringify(existingProject.connections) !== JSON.stringify(project.connections);

          if (!hasActualChanges) {
            // No actual changes, don't update state
            return state;
          }

          const nodes = project.components.map(componentToNode);
          const edges = project.connections.map(connectionToEdge);
          
          return {
            project,
            nodes,
            edges,
            hasUnsavedChanges: false,
            lastSavedAt: new Date(),
          };
        });
      },
      
      updateProjectName: (name) => {
        logger.log('📝 Project name updated:', name);
        set((state) => ({
          project: {
            ...state.project,
            name,
            updatedAt: new Date().toISOString(),
          },
          hasUnsavedChanges: true,
        }));
      },
      
      resetProject: () => {
        logger.log('🔄 Project reset to initial state');
        set({
          project: initialProject,
          currentProjectId: null,
          nodes: [],
          edges: [],
          viewport: { x: 0, y: 0, zoom: 1 },
          selectedNodes: [],
          selectedEdges: [],
          hasUnsavedChanges: false,
          lastSavedAt: null,
          isInEditor: false,
        });
      },
      
      loadProjectData: (projectData, projectId) => {
        // Safety check for undefined/null projectData
        if (!projectData) {
          logger.error('❌ Cannot load project: projectData is undefined/null');
          return;
        }
        
        // Additional type checking to ensure we have a valid project
        if (typeof projectData !== 'object' || !projectData.id || !projectData.name) {
          logger.error('❌ Invalid project data structure:', projectData);
          return;
        }
        
        logger.log('📂 Loading project data:', projectData.name || 'Unnamed Project');
        logger.log('📊 Project components:', projectData.components?.length || 0);
        logger.log('🔗 Project connections:', projectData.connections?.length || 0);
        
        set((state) => {
          // Ensure components and connections exist with safe defaults
          const safeProjectData = {
            ...projectData,
            components: Array.isArray(projectData.components) ? projectData.components : [],
            connections: Array.isArray(projectData.connections) ? projectData.connections : [],
            name: projectData.name || 'Untitled Project',
            id: projectData.id || `project-${Date.now()}`,
            createdAt: projectData.createdAt || new Date().toISOString(),
            updatedAt: projectData.updatedAt || new Date().toISOString(),
          };
          
          const nodes = safeProjectData.components.map(componentToNode);
          const edges = safeProjectData.connections.map(connectionToEdge);
          
          logger.log('✅ Project loaded successfully in store:', {
            name: safeProjectData.name,
            components: safeProjectData.components.length,
            connections: safeProjectData.connections.length,
            projectId: projectId || null
          });
          
          return {
            project: safeProjectData,
            currentProjectId: projectId || safeProjectData.id || null,
            nodes,
            edges,
            isInEditor: true,
            hasUnsavedChanges: false,
            lastSavedAt: new Date(),
          };
        });
      },
      
      enterEditor: () => {
        logger.log('🚀 Entering editor mode');
        set({ isInEditor: true, mode: 'edit' });
      },
      
      exitEditor: () => {
        logger.log('🏠 Exiting editor mode');
        set({ 
          isInEditor: false, 
          currentProjectId: null,
          mode: 'view',
          selectedNodes: [],
          selectedEdges: [],
        });
      },
      
      setCurrentProjectId: (id) => {
        set({ currentProjectId: id });
      },
      
      // === COMPONENT ACTIONS ===
      addComponent: (component) => {
        logger.log('➕ Adding component:', component.type);
        set((state) => {
          const newProject = {
            ...state.project,
            components: [...state.project.components, component],
            updatedAt: new Date().toISOString(),
          };
          
          const newNode = componentToNode(component);
          
          return {
            project: newProject,
            nodes: [...state.nodes, newNode],
            hasUnsavedChanges: true,
          };
        });
      },
      
      updateComponent: (id, updates) => {
        logger.log('📝 Updating component:', id);
        set((state) => {
          const newProject = {
            ...state.project,
            components: state.project.components.map((comp) =>
              comp.id === id ? { ...comp, ...updates, updatedAt: new Date().toISOString() } : comp
            ),
            updatedAt: new Date().toISOString(),
          };
          
          const newNodes = state.nodes.map((node) =>
            node.id === id 
              ? { ...node, data: { ...node.data, ...updates.data } }
              : node
          );
          
          return {
            project: newProject,
            nodes: newNodes,
            hasUnsavedChanges: true,
          };
        });
      },
      
      deleteComponent: (id) => {
        logger.log('🗑️ Deleting component:', id);
        set((state) => {
          const newProject = {
            ...state.project,
            components: state.project.components.filter((comp) => comp.id !== id),
            connections: state.project.connections.filter(
              (conn) => conn.from !== id && conn.to !== id
            ),
            updatedAt: new Date().toISOString(),
          };
          
          const newNodes = state.nodes.filter((node) => node.id !== id);
          const newEdges = state.edges.filter(
            (edge) => edge.source !== id && edge.target !== id
          );
          
          return {
            project: newProject,
            nodes: newNodes,
            edges: newEdges,
            selectedNodes: state.selectedNodes.filter(nodeId => nodeId !== id),
            hasUnsavedChanges: true,
          };
        });
      },
      
      duplicateComponent: (id) => {
        const state = get();
        const component = state.project.components.find((comp) => comp.id === id);
        
        if (component) {
          const duplicatedComponent: FunnelComponent = {
            ...component,
            id: `${id}-copy-${Date.now()}`,
            position: {
              x: component.position.x + 50,
              y: component.position.y + 50,
            },
            data: {
              ...component.data,
              title: `${component.data.title} (Copy)`,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          get().addComponent(duplicatedComponent);
          logger.log('📋 Component duplicated:', duplicatedComponent.id);
        }
      },
      
      // === CONNECTION ACTIONS ===
      addConnection: (connection) => {
        logger.log('🔗 Adding connection:', connection.id);
        set((state) => {
          const newProject = {
            ...state.project,
            connections: [...state.project.connections, connection],
            updatedAt: new Date().toISOString(),
          };
          
          const newEdge = connectionToEdge(connection);
          
          return {
            project: newProject,
            edges: [...state.edges, newEdge],
            hasUnsavedChanges: true,
          };
        });
      },
      
      deleteConnection: (connectionId) => {
        logger.log('🗑️ Deleting connection:', connectionId);
        set((state) => {
          const newProject = {
            ...state.project,
            connections: state.project.connections.filter((conn) => conn.id !== connectionId),
            updatedAt: new Date().toISOString(),
          };
          
          const newEdges = state.edges.filter((edge) => edge.id !== connectionId);
          
          return {
            project: newProject,
            edges: newEdges,
            selectedEdges: state.selectedEdges.filter(edgeId => edgeId !== connectionId),
            hasUnsavedChanges: true,
          };
        });
      },
      
      updateConnection: (id, updates) => {
        logger.log('📝 Updating connection:', id);
        set((state) => {
          const newProject = {
            ...state.project,
            connections: state.project.connections.map((conn) =>
              conn.id === id ? { ...conn, ...updates, updatedAt: new Date().toISOString() } : conn
            ),
            updatedAt: new Date().toISOString(),
          };
          
          const newEdges = state.edges.map((edge) =>
            edge.id === id 
              ? { 
                  ...edge, 
                  style: { ...edge.style, stroke: updates.color || updates.customColor },
                  animated: updates.animated ?? edge.animated,
                  data: updates.connectionData || edge.data,
                }
              : edge
          );
          
          return {
            project: newProject,
            edges: newEdges,
            hasUnsavedChanges: true,
          };
        });
      },
      
      // === REACT FLOW ACTIONS ===
      setNodes: (nodes) => {
        const newNodes = typeof nodes === 'function' ? nodes(get().nodes) : nodes;
        logger.log('🔄 Nodes updated, count:', newNodes.length);
        
        set((state) => {
          // Convert nodes back to components and update project
          const components = newNodes.map(nodeToComponent);
          const newProject = {
            ...state.project,
            components,
            updatedAt: new Date().toISOString(),
          };
          
          return {
            nodes: newNodes,
            project: newProject,
            hasUnsavedChanges: true,
          };
        });
      },
      
      setEdges: (edges) => {
        const newEdges = typeof edges === 'function' ? edges(get().edges) : edges;
        logger.log('🔄 Edges updated, count:', newEdges.length);
        
        set((state) => {
          // Convert edges back to connections and update project
          const connections = newEdges.map(edgeToConnection);
          const newProject = {
            ...state.project,
            connections,
            updatedAt: new Date().toISOString(),
          };
          
          return {
            edges: newEdges,
            project: newProject,
            hasUnsavedChanges: true,
          };
        });
      },
      
      setViewport: (viewport) => {
        set({ viewport });
      },
      
      addNode: (node) => {
        const component = nodeToComponent(node);
        get().addComponent(component);
      },
      
      updateNode: (id, updates) => {
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === id ? { ...node, ...updates } : node
          ),
          hasUnsavedChanges: true,
        }));
        
        // Sync to components
        get().syncFromReactFlow();
      },
      
      deleteNode: (id) => {
        get().deleteComponent(id);
      },
      
      addEdge: (edge) => {
        const connection = edgeToConnection(edge);
        get().addConnection(connection);
      },
      
      updateEdge: (id, updates) => {
        set((state) => ({
          edges: state.edges.map((edge) =>
            edge.id === id ? { ...edge, ...updates } : edge
          ),
          hasUnsavedChanges: true,
        }));
        
        // Sync to connections
        get().syncFromReactFlow();
      },
      
      deleteEdge: (id) => {
        get().deleteConnection(id);
      },
      
      // === SELECTION ACTIONS ===
      setSelectedNodes: (nodeIds) => {
        set({ selectedNodes: nodeIds });
      },
      
      setSelectedEdges: (edgeIds) => {
        set({ selectedEdges: edgeIds });
      },
      
      clearSelection: () => {
        set({ selectedNodes: [], selectedEdges: [] });
      },
      
      selectNode: (nodeId, multi = false) => {
        set((state) => ({
          selectedNodes: multi 
            ? [...state.selectedNodes, nodeId]
            : [nodeId],
          selectedEdges: multi ? state.selectedEdges : [],
        }));
      },
      
      selectEdge: (edgeId, multi = false) => {
        set((state) => ({
          selectedEdges: multi 
            ? [...state.selectedEdges, edgeId]
            : [edgeId],
          selectedNodes: multi ? state.selectedNodes : [],
        }));
      },
      
      // === UTILITY ACTIONS ===
      exportProject: () => {
        const { project } = get();
        try {
          const dataStr = JSON.stringify(project, null, 2);
          const dataBlob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(dataBlob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.json`;
          link.click();
          
          URL.revokeObjectURL(url);
          toast.success('Project exported successfully!');
          logger.log('📤 Project exported:', project.name);
        } catch (error) {
          logger.error('❌ Export failed:', error);
          toast.error('Error exporting project');
        }
      },
      
      clearProject: () => {
        logger.log('🧹 Clearing project');
        set({
          project: {
            id: 'project-' + Date.now(),
            name: 'Untitled Funnel',
            components: [],
            connections: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          nodes: [],
          edges: [],
          selectedNodes: [],
          selectedEdges: [],
          hasUnsavedChanges: false,
        });
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      
      setSaving: (saving) => {
        set({ isSaving: saving });
      },
      
      setError: (error) => {
        set({ error });
        if (error) {
          logger.error('❌ Store error:', error);
        }
      },
      
      setMode: (mode) => {
        set({ mode });
      },
      
      markAsChanged: () => {
        set({ hasUnsavedChanges: true });
      },
      
      markAsSaved: () => {
        set({ 
          hasUnsavedChanges: false, 
          lastSavedAt: new Date(),
          isSaving: false,
        });
      },
      
      // === AUTO-SAVE ACTIONS ===
      setAutoSaveEnabled: (enabled) => {
        set({ autoSaveEnabled: enabled });
      },
      
      setAutoSaveDelay: (delay) => {
        set({ autoSaveDelay: delay });
      },
      
      triggerAutoSave: () => {
        const state = get();
        if (state.hasUnsavedChanges && state.autoSaveEnabled && !state.saveInProgress) {
          // This will be handled by the auto-save hook
          set({ saveInProgress: true });
        }
      },
      
      // === SYNC ACTIONS ===
      syncFromReactFlow: () => {
        const state = get();
        const components = state.nodes.map(nodeToComponent);
        const connections = state.edges.map(edgeToConnection);
        
        set((current) => ({
          project: {
            ...current.project,
            components,
            connections,
            updatedAt: new Date().toISOString(),
          },
          hasUnsavedChanges: true,
        }));
      },
      
      syncToReactFlow: () => {
        const state = get();
        const nodes = state.project.components.map(componentToNode);
        const edges = state.project.connections.map(connectionToEdge);
        
        set({
          nodes,
          edges,
        });
      },
    })),
    {
      name: 'project-store',
      partialize: (state) => ({
        // Only persist essential state, not UI state
        project: state.project,
        currentProjectId: state.currentProjectId,
        autoSaveEnabled: state.autoSaveEnabled,
        autoSaveDelay: state.autoSaveDelay,
      }),
    }
  )
);

// Selectors for optimized component subscriptions
export const useProjectData = () => useProjectStore((state) => state.project);
export const useProjectId = () => useProjectStore((state) => state.currentProjectId);
export const useIsInEditor = () => useProjectStore((state) => state.isInEditor);
export const useHasUnsavedChanges = () => useProjectStore((state) => state.hasUnsavedChanges);
export const useProjectNodes = () => useProjectStore((state) => state.nodes);
export const useProjectEdges = () => useProjectStore((state) => state.edges);
export const useProjectViewport = () => useProjectStore((state) => state.viewport);
export const useProjectSelection = () => useProjectStore((state) => ({
  selectedNodes: state.selectedNodes,
  selectedEdges: state.selectedEdges,
}));
export const useProjectActions = () => useProjectStore((state) => ({
  addComponent: state.addComponent,
  updateComponent: state.updateComponent,
  deleteComponent: state.deleteComponent,
  duplicateComponent: state.duplicateComponent,
  addConnection: state.addConnection,
  deleteConnection: state.deleteConnection,
  updateConnection: state.updateConnection,
  updateProjectName: state.updateProjectName,
  exportProject: state.exportProject,
  clearProject: state.clearProject,
}));
export const useReactFlowActions = () => useProjectStore((state) => ({
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  setViewport: state.setViewport,
  addNode: state.addNode,
  updateNode: state.updateNode,
  deleteNode: state.deleteNode,
  addEdge: state.addEdge,
  updateEdge: state.updateEdge,
  deleteEdge: state.deleteEdge,
}));

// Auto-save integration hook
export const useAutoSaveIntegration = (
  saveFunction: (project: FunnelProject) => Promise<{ success: boolean; projectId?: string }>
) => {
  const { 
    project, 
    hasUnsavedChanges, 
    autoSaveEnabled, 
    autoSaveDelay,
    markAsSaved,
    setError,
    setSaving 
  } = useProjectStore();
  
  React.useEffect(() => {
    if (!hasUnsavedChanges || !autoSaveEnabled) return;
    
    const timeoutId = setTimeout(async () => {
      try {
        setSaving(true);
        logger.log('💾 Auto-saving project via Zustand...');
        
        const result = await saveFunction(project);
        if (result.success) {
          markAsSaved();
          logger.log('✅ Project auto-saved successfully');
        } else {
          setError('Failed to auto-save project');
        }
      } catch (error: any) {
        logger.error('❌ Auto-save failed:', error);
        setError(error.message);
      } finally {
        setSaving(false);
      }
    }, autoSaveDelay);
    
    return () => clearTimeout(timeoutId);
  }, [project, hasUnsavedChanges, autoSaveEnabled, autoSaveDelay, saveFunction, markAsSaved, setError, setSaving]);
};

export default useProjectStore; 