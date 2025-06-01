
import { FunnelComponent, Connection, FunnelProject } from '../types/funnel';
import { useComponentHandlers } from './handlers/useComponentHandlers';
import { useConnectionHandlers } from './handlers/useConnectionHandlers';
import { useProjectManagementHandlers } from './handlers/useProjectManagementHandlers';

interface UseProjectHandlersProps {
  project: FunnelProject;
  setProject: React.Dispatch<React.SetStateAction<FunnelProject>>;
  currentProjectId: string | null;
  setCurrentProjectId: React.Dispatch<React.SetStateAction<string | null>>;
  loadProjectData: (projectData: FunnelProject, projectId?: string) => void;
  resetProject: () => void;
  enterEditor: () => void;
}

export const useProjectHandlers = ({
  project,
  setProject,
  currentProjectId,
  setCurrentProjectId,
  loadProjectData,
  resetProject,
  enterEditor
}: UseProjectHandlersProps) => {
  const componentHandlers = useComponentHandlers({ setProject });
  const connectionHandlers = useConnectionHandlers({ setProject });
  const projectManagementHandlers = useProjectManagementHandlers({
    project,
    setProject,
    currentProjectId,
    setCurrentProjectId,
    loadProjectData,
    resetProject,
    enterEditor
  });

  return {
    ...componentHandlers,
    ...connectionHandlers,
    ...projectManagementHandlers
  };
};
