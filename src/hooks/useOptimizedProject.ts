import { useMemo } from 'react';
import { FunnelComponent, Connection } from '../types/funnel';
import { ProjectStats, ProjectValidation } from '../types/project';

interface OptimizedProjectData {
  components: FunnelComponent[];
  connections: Connection[];
  stats: ProjectStats;
  validation: ProjectValidation;
  componentsByType: Map<string, FunnelComponent[]>;
  connectionsMap: Map<string, Connection[]>;
}

interface ProjectData {
  components: FunnelComponent[];
  connections: Connection[];
  updatedAt: string;
}

export const useOptimizedProject = (project: ProjectData): OptimizedProjectData => {
  return useMemo(() => {
    const componentsByType = new Map<string, FunnelComponent[]>();
    const connectionsMap = new Map<string, Connection[]>();

    // Index components by type
    project.components.forEach(component => {
      const typeComponents = componentsByType.get(component.type) || [];
      typeComponents.push(component);
      componentsByType.set(component.type, typeComponents);
    });

    // Index connections by component
    project.connections.forEach(connection => {
      // From connections
      const fromConnections = connectionsMap.get(connection.from) || [];
      fromConnections.push(connection);
      connectionsMap.set(connection.from, fromConnections);

      // To connections
      const toConnections = connectionsMap.get(connection.to) || [];
      toConnections.push(connection);
      connectionsMap.set(connection.to, toConnections);
    });

    // Calculate stats
    const stats: ProjectStats = {
      componentsCount: project.components.length,
      connectionsCount: project.connections.length,
      lastModified: project.updatedAt,
      isValid: project.components.length > 0,
    };

    // Validate project
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for orphaned connections
    project.connections.forEach(connection => {
      const fromExists = project.components.some(c => c.id === connection.from);
      const toExists = project.components.some(c => c.id === connection.to);
      
      if (!fromExists || !toExists) {
        errors.push(`Connection ${connection.id} references non-existent components`);
      }
    });

    // Check for isolated components
    const connectedComponents = new Set();
    project.connections.forEach(conn => {
      connectedComponents.add(conn.from);
      connectedComponents.add(conn.to);
    });

    project.components.forEach(component => {
      if (!connectedComponents.has(component.id) && project.components.length > 1) {
        warnings.push(`Componente ${component.data.title} está isolado`);
      }
    });

    const validation: ProjectValidation = {
      isValid: errors.length === 0,
      errors,
      warnings,
    };

    return {
      components: project.components,
      connections: project.connections,
      stats,
      validation,
      componentsByType,
      connectionsMap,
    };
  }, [project]);
};
