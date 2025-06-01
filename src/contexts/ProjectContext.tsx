
import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { FunnelProject, FunnelComponent, Connection } from '../types/funnel';
import { initialProject } from '../data/initialProject';

interface ProjectState {
  project: FunnelProject;
  selectedComponent: string | null;
  connectingFrom: string | null;
  selectedConnection: string | null;
  isLoading: boolean;
  isDirty: boolean;
  history: FunnelProject[];
  historyIndex: number;
}

type ProjectAction =
  | { type: 'SET_PROJECT'; payload: FunnelProject }
  | { type: 'ADD_COMPONENT'; payload: FunnelComponent }
  | { type: 'UPDATE_COMPONENT'; payload: { id: string; updates: Partial<FunnelComponent> } }
  | { type: 'DELETE_COMPONENT'; payload: string }
  | { type: 'ADD_CONNECTION'; payload: Connection }
  | { type: 'DELETE_CONNECTION'; payload: string }
  | { type: 'UPDATE_CONNECTION'; payload: { id: string; updates: Partial<Connection> } }
  | { type: 'SELECT_COMPONENT'; payload: string | null }
  | { type: 'START_CONNECTION'; payload: string | null }
  | { type: 'SELECT_CONNECTION'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SAVE_TO_HISTORY' };

const initialState: ProjectState = {
  project: initialProject,
  selectedComponent: null,
  connectingFrom: null,
  selectedConnection: null,
  isLoading: false,
  isDirty: false,
  history: [initialProject],
  historyIndex: 0,
};

function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case 'SET_PROJECT':
      return {
        ...state,
        project: action.payload,
        isDirty: false,
        history: [action.payload],
        historyIndex: 0,
      };

    case 'ADD_COMPONENT':
      const newProject = {
        ...state.project,
        components: [...state.project.components, action.payload],
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        project: newProject,
        isDirty: true,
      };

    case 'UPDATE_COMPONENT':
      const updatedProject = {
        ...state.project,
        components: state.project.components.map(comp =>
          comp.id === action.payload.id ? { ...comp, ...action.payload.updates } : comp
        ),
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        project: updatedProject,
        isDirty: true,
      };

    case 'DELETE_COMPONENT':
      const afterDeleteProject = {
        ...state.project,
        components: state.project.components.filter(comp => comp.id !== action.payload),
        connections: state.project.connections.filter(conn =>
          conn.from !== action.payload && conn.to !== action.payload
        ),
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        project: afterDeleteProject,
        selectedComponent: state.selectedComponent === action.payload ? null : state.selectedComponent,
        connectingFrom: state.connectingFrom === action.payload ? null : state.connectingFrom,
        isDirty: true,
      };

    case 'ADD_CONNECTION':
      const projectWithConnection = {
        ...state.project,
        connections: [...state.project.connections, action.payload],
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        project: projectWithConnection,
        connectingFrom: null,
        isDirty: true,
      };

    case 'DELETE_CONNECTION':
      const projectWithoutConnection = {
        ...state.project,
        connections: state.project.connections.filter(conn => conn.id !== action.payload),
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        project: projectWithoutConnection,
        selectedConnection: state.selectedConnection === action.payload ? null : state.selectedConnection,
        isDirty: true,
      };

    case 'UPDATE_CONNECTION':
      const projectWithUpdatedConnection = {
        ...state.project,
        connections: state.project.connections.map(conn =>
          conn.id === action.payload.id ? { ...conn, ...action.payload.updates } : conn
        ),
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        project: projectWithUpdatedConnection,
        isDirty: true,
      };

    case 'SELECT_COMPONENT':
      return {
        ...state,
        selectedComponent: action.payload,
        connectingFrom: null,
        selectedConnection: null,
      };

    case 'START_CONNECTION':
      return {
        ...state,
        connectingFrom: action.payload,
        selectedComponent: null,
        selectedConnection: null,
      };

    case 'SELECT_CONNECTION':
      return {
        ...state,
        selectedConnection: action.payload,
        selectedComponent: null,
        connectingFrom: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SAVE_TO_HISTORY':
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(state.project);
      return {
        ...state,
        history: newHistory.slice(-50), // Keep only last 50 states
        historyIndex: Math.min(newHistory.length - 1, 49),
      };

    case 'UNDO':
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          ...state,
          project: state.history[newIndex],
          historyIndex: newIndex,
          isDirty: true,
        };
      }
      return state;

    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          ...state,
          project: state.history[newIndex],
          historyIndex: newIndex,
          isDirty: true,
        };
      }
      return state;

    default:
      return state;
  }
}

interface ProjectContextType {
  state: ProjectState;
  actions: {
    setProject: (project: FunnelProject) => void;
    addComponent: (component: FunnelComponent) => void;
    updateComponent: (id: string, updates: Partial<FunnelComponent>) => void;
    deleteComponent: (id: string) => void;
    addConnection: (connection: Connection) => void;
    deleteConnection: (id: string) => void;
    updateConnection: (id: string, updates: Partial<Connection>) => void;
    selectComponent: (id: string | null) => void;
    startConnection: (id: string | null) => void;
    selectConnection: (id: string | null) => void;
    setLoading: (loading: boolean) => void;
    undo: () => void;
    redo: () => void;
    saveToHistory: () => void;
    duplicateComponent: (id: string) => void;
  };
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  const actions = useMemo(() => ({
    setProject: useCallback((project: FunnelProject) => {
      dispatch({ type: 'SET_PROJECT', payload: project });
    }, []),

    addComponent: useCallback((component: FunnelComponent) => {
      dispatch({ type: 'SAVE_TO_HISTORY' });
      dispatch({ type: 'ADD_COMPONENT', payload: component });
    }, []),

    updateComponent: useCallback((id: string, updates: Partial<FunnelComponent>) => {
      dispatch({ type: 'UPDATE_COMPONENT', payload: { id, updates } });
    }, []),

    deleteComponent: useCallback((id: string) => {
      dispatch({ type: 'SAVE_TO_HISTORY' });
      dispatch({ type: 'DELETE_COMPONENT', payload: id });
    }, []),

    addConnection: useCallback((connection: Connection) => {
      dispatch({ type: 'SAVE_TO_HISTORY' });
      dispatch({ type: 'ADD_CONNECTION', payload: connection });
    }, []),

    deleteConnection: useCallback((id: string) => {
      dispatch({ type: 'SAVE_TO_HISTORY' });
      dispatch({ type: 'DELETE_CONNECTION', payload: id });
    }, []),

    updateConnection: useCallback((id: string, updates: Partial<Connection>) => {
      dispatch({ type: 'UPDATE_CONNECTION', payload: { id, updates } });
    }, []),

    selectComponent: useCallback((id: string | null) => {
      dispatch({ type: 'SELECT_COMPONENT', payload: id });
    }, []),

    startConnection: useCallback((id: string | null) => {
      dispatch({ type: 'START_CONNECTION', payload: id });
    }, []),

    selectConnection: useCallback((id: string | null) => {
      dispatch({ type: 'SELECT_CONNECTION', payload: id });
    }, []),

    setLoading: useCallback((loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading });
    }, []),

    undo: useCallback(() => {
      dispatch({ type: 'UNDO' });
    }, []),

    redo: useCallback(() => {
      dispatch({ type: 'REDO' });
    }, []),

    saveToHistory: useCallback(() => {
      dispatch({ type: 'SAVE_TO_HISTORY' });
    }, []),

    duplicateComponent: useCallback((id: string) => {
      const component = state.project.components.find(c => c.id === id);
      if (component) {
        const newComponent: FunnelComponent = {
          ...component,
          id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          position: {
            x: component.position.x + 50,
            y: component.position.y + 50,
          },
          data: {
            ...component.data,
            title: `${component.data.title} (Cópia)`,
          },
          connections: [],
        };
        dispatch({ type: 'SAVE_TO_HISTORY' });
        dispatch({ type: 'ADD_COMPONENT', payload: newComponent });
      }
    }, [state.project.components]),
  }), [state.project.components]);

  const contextValue = useMemo(() => ({ state, actions }), [state, actions]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};
