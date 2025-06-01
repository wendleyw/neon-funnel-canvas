
import { useCallback } from 'react';
import { FunnelProject } from '../types/funnel';
import { toast } from 'sonner';

interface ExportFormat {
  figma: () => any;
  miro: () => any;
  lucidchart: () => any;
  drawio: () => any;
  json: () => any;
}

export const useProjectIntegration = () => {
  const exportToFormat = useCallback((project: FunnelProject, format: keyof ExportFormat) => {
    const formatters: ExportFormat = {
      figma: () => ({
        name: project.name,
        document: {
          id: project.id,
          name: project.name,
          type: "DOCUMENT",
          children: project.components.map(component => ({
            id: component.id,
            name: component.data.title,
            type: "FRAME",
            x: component.position.x,
            y: component.position.y,
            width: 200,
            height: 150,
            backgroundColor: getComponentColor(component.type),
            children: [{
              type: "TEXT",
              characters: component.data.title,
              style: {
                fontFamily: "Inter",
                fontSize: 14,
                fontWeight: 600
              }
            }]
          }))
        }
      }),

      miro: () => ({
        type: "board",
        name: project.name,
        widgets: [
          ...project.components.map(component => ({
            type: "card",
            id: component.id,
            x: component.position.x,
            y: component.position.y,
            width: 200,
            height: 150,
            title: component.data.title,
            description: component.data.description || '',
            style: {
              cardTheme: getComponentColor(component.type)
            }
          })),
          ...project.connections.map(connection => ({
            type: "line",
            id: connection.id,
            startWidget: { id: connection.from },
            endWidget: { id: connection.to },
            style: {
              lineColor: connection.customColor || '#6B7280',
              lineStyle: connection.animated ? 'dashed' : 'solid'
            }
          }))
        ]
      }),

      lucidchart: () => ({
        name: project.name,
        pages: [{
          id: "page1",
          name: "Main Flow",
          objects: [
            ...project.components.map(component => ({
              id: component.id,
              type: "shape",
              x: component.position.x,
              y: component.position.y,
              width: 200,
              height: 150,
              text: component.data.title,
              shapeType: getShapeType(component.type),
              style: {
                fill: getComponentColor(component.type),
                stroke: "#000000"
              }
            })),
            ...project.connections.map(connection => ({
              id: connection.id,
              type: "line",
              from: connection.from,
              to: connection.to,
              style: {
                stroke: connection.customColor || '#6B7280',
                strokeWidth: connection.animated ? 3 : 2
              }
            }))
          ]
        }]
      }),

      drawio: () => ({
        mxfile: {
          diagram: {
            mxGraphModel: {
              root: {
                mxCell: [
                  { id: "0" },
                  { id: "1", parent: "0" },
                  ...project.components.map(component => ({
                    id: component.id,
                    value: component.data.title,
                    style: `rounded=1;whiteSpace=wrap;html=1;fillColor=${getComponentColor(component.type)};`,
                    vertex: "1",
                    parent: "1",
                    mxGeometry: {
                      x: component.position.x,
                      y: component.position.y,
                      width: 200,
                      height: 150,
                      as: "geometry"
                    }
                  })),
                  ...project.connections.map(connection => ({
                    id: connection.id,
                    style: `edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${connection.customColor || '#6B7280'};`,
                    edge: "1",
                    parent: "1",
                    source: connection.from,
                    target: connection.to
                  }))
                ]
              }
            }
          }
        }
      }),

      json: () => project
    };

    return formatters[format]();
  }, []);

  const getComponentColor = useCallback((type: string): string => {
    const colors = {
      'landing-page': '#3B82F6',
      'opt-in': '#10B981',
      'sales-page': '#F59E0B',
      'checkout': '#EF4444',
      'thank-you': '#8B5CF6',
      'email': '#06B6D4',
      'webinar': '#F97316',
      'quiz': '#EC4899'
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  }, []);

  const getShapeType = useCallback((type: string): string => {
    const shapes = {
      'landing-page': 'rectangle',
      'opt-in': 'roundedRectangle',
      'sales-page': 'rectangle',
      'checkout': 'diamond',
      'thank-you': 'ellipse',
      'email': 'parallelogram',
      'webinar': 'hexagon',
      'quiz': 'triangle'
    };
    return shapes[type as keyof typeof shapes] || 'rectangle';
  }, []);

  const generateDocumentation = useCallback((project: FunnelProject) => {
    const stats = {
      totalComponents: project.components.length,
      totalConnections: project.connections.length,
      componentTypes: project.components.reduce((acc, comp) => {
        acc[comp.type] = (acc[comp.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      connectionTypes: project.connections.reduce((acc, conn) => {
        acc[conn.type] = (acc[conn.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return {
      title: `${project.name} - Documentação`,
      overview: {
        projectId: project.id,
        name: project.name,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        statistics: stats
      },
      components: project.components.map(comp => ({
        id: comp.id,
        name: comp.data.title,
        type: comp.type,
        description: comp.data.description || 'Sem descrição',
        position: comp.position,
        connections: {
          incoming: project.connections.filter(c => c.to === comp.id).length,
          outgoing: project.connections.filter(c => c.from === comp.id).length
        }
      })),
      flow: project.connections.map(conn => ({
        id: conn.id,
        from: project.components.find(c => c.id === conn.from)?.data.title || 'Unknown',
        to: project.components.find(c => c.id === conn.to)?.data.title || 'Unknown',
        type: conn.type,
        animated: conn.animated
      }))
    };
  }, []);

  const downloadFile = useCallback((data: any, filename: string, mimeType: string = 'application/json') => {
    const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
  }, []);

  const exportProject = useCallback((project: FunnelProject, format: keyof ExportFormat) => {
    try {
      const exportData = exportToFormat(project, format);
      const filename = `${project.name.replace(/\s+/g, '-').toLowerCase()}.${format === 'json' ? 'json' : format}`;
      
      downloadFile(exportData, filename);
      toast.success(`Projeto exportado para ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao exportar projeto');
    }
  }, [exportToFormat, downloadFile]);

  const exportDocumentation = useCallback((project: FunnelProject) => {
    try {
      const docs = generateDocumentation(project);
      const filename = `${project.name.replace(/\s+/g, '-').toLowerCase()}-docs.json`;
      
      downloadFile(docs, filename);
      toast.success('Documentação exportada');
    } catch (error) {
      console.error('Erro ao exportar documentação:', error);
      toast.error('Erro ao exportar documentação');
    }
  }, [generateDocumentation, downloadFile]);

  return {
    exportProject,
    exportDocumentation,
    exportToFormat,
    generateDocumentation
  };
};
