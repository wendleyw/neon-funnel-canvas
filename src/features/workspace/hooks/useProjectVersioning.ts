
import { useState, useCallback } from 'react';
import { FunnelProject } from '../types/funnel';
import { toast } from 'sonner';

interface ProjectVersion {
  id: string;
  timestamp: string;
  message: string;
  author: string;
  projectData: FunnelProject;
  hash: string;
}

interface ProjectDiff {
  componentsAdded: string[];
  componentsRemoved: string[];
  componentsModified: string[];
  connectionsAdded: string[];
  connectionsRemoved: string[];
  connectionsModified: string[];
}

export const useProjectVersioning = () => {
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);

  const generateHash = useCallback((project: FunnelProject): string => {
    const content = JSON.stringify({
      components: project.components.map(c => ({ id: c.id, type: c.type, data: c.data })),
      connections: project.connections.map(c => ({ id: c.id, from: c.from, to: c.to, type: c.type }))
    });
    return btoa(content).slice(0, 8);
  }, []);

  const createVersion = useCallback((project: FunnelProject, message: string = 'Auto-save') => {
    const version: ProjectVersion = {
      id: `v${Date.now()}`,
      timestamp: new Date().toISOString(),
      message,
      author: 'User',
      projectData: JSON.parse(JSON.stringify(project)),
      hash: generateHash(project)
    };

    setVersions(prev => {
      const newVersions = [version, ...prev].slice(0, 50); // Keep last 50 versions
      return newVersions;
    });
    
    setCurrentVersion(version.id);
    return version;
  }, [generateHash]);

  const getDiff = useCallback((fromProject: FunnelProject, toProject: FunnelProject): ProjectDiff => {
    const fromComponentIds = new Set(fromProject.components.map(c => c.id));
    const toComponentIds = new Set(toProject.components.map(c => c.id));
    const fromConnectionIds = new Set(fromProject.connections.map(c => c.id));
    const toConnectionIds = new Set(toProject.connections.map(c => c.id));

    return {
      componentsAdded: toProject.components.filter(c => !fromComponentIds.has(c.id)).map(c => c.id),
      componentsRemoved: fromProject.components.filter(c => !toComponentIds.has(c.id)).map(c => c.id),
      componentsModified: toProject.components.filter(c => {
        if (!fromComponentIds.has(c.id)) return false;
        const fromComponent = fromProject.components.find(fc => fc.id === c.id);
        return JSON.stringify(fromComponent?.data) !== JSON.stringify(c.data);
      }).map(c => c.id),
      connectionsAdded: toProject.connections.filter(c => !fromConnectionIds.has(c.id)).map(c => c.id),
      connectionsRemoved: fromProject.connections.filter(c => !toConnectionIds.has(c.id)).map(c => c.id),
      connectionsModified: toProject.connections.filter(c => {
        if (!fromConnectionIds.has(c.id)) return false;
        const fromConnection = fromProject.connections.find(fc => fc.id === c.id);
        return JSON.stringify(fromConnection) !== JSON.stringify(c);
      }).map(c => c.id)
    };
  }, []);

  const revertToVersion = useCallback((versionId: string): FunnelProject | null => {
    const version = versions.find(v => v.id === versionId);
    if (!version) return null;
    
    setCurrentVersion(versionId);
    return JSON.parse(JSON.stringify(version.projectData));
  }, [versions]);

  const exportGitCompatible = useCallback((project: FunnelProject) => {
    const currentTime = new Date().toISOString();
    
    const gitData = {
      version: '1.0.0',
      metadata: {
        name: project.name,
        id: project.id,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        hash: generateHash(project)
      },
      components: project.components.map(component => ({
        id: component.id,
        type: component.type,
        position: component.position,
        data: component.data,
        metadata: {
          createdAt: component.createdAt || currentTime,
          updatedAt: component.updatedAt || currentTime
        }
      })),
      connections: project.connections.map(connection => ({
        id: connection.id,
        from: connection.from,
        to: connection.to,
        type: connection.type,
        customColor: connection.customColor,
        animated: connection.animated,
        metadata: {
          createdAt: connection.createdAt || currentTime,
          updatedAt: connection.updatedAt || currentTime
        }
      })),
      history: versions.slice(0, 10).map(v => ({
        id: v.id,
        timestamp: v.timestamp,
        message: v.message,
        author: v.author,
        hash: v.hash
      }))
    };

    return gitData;
  }, [versions, generateHash]);

  return {
    versions,
    currentVersion,
    createVersion,
    getDiff,
    revertToVersion,
    exportGitCompatible
  };
};
