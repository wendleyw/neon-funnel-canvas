import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  FileText, 
  Download, 
  GitBranch, 
  Layers, 
  Share2,
  Code,
  Database,
  FileJson
} from 'lucide-react';
import { FunnelProject } from '../types/funnel';
import { useProjectIntegration } from '../hooks/useProjectIntegration';
import { useProjectVersioning } from '../hooks/useProjectVersioning';

interface AdvancedExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: FunnelProject;
}

const exportOptions = [
  { id: 'figma', name: 'Figma', description: 'For design and prototyping', icon: Layers, format: 'figma' },
  { id: 'miro', name: 'Miro', description: 'For visual collaboration', icon: Share2, format: 'miro' },
  { id: 'lucidchart', name: 'LucidChart', description: 'For professional diagrams', icon: GitBranch, format: 'lucidchart' },
  { id: 'drawio', name: 'Draw.io', description: 'For flowcharts', icon: Code, format: 'drawio' },
  { id: 'json', name: 'JSON', description: 'Structured data format', icon: FileJson, format: 'json' }
] as const;

export const AdvancedExportModal: React.FC<AdvancedExportModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const { exportProject, exportDocumentation, generateDocumentation } = useProjectIntegration();
  const { exportGitCompatible } = useProjectVersioning();

  const handleExport = (format: any) => {
    exportProject(project, format);
    setSelectedFormat(format);
  };

  const handleGitExport = () => {
    const gitData = exportGitCompatible(project);
    const blob = new Blob([JSON.stringify(gitData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}-git.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const projectStats = generateDocumentation(project);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Advanced Export</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Project Statistics */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5" />
                Project Statistics
              </CardTitle>
              <CardDescription className="text-gray-400">
                Information about the current project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {projectStats.overview.statistics.totalComponents}
                  </div>
                  <div className="text-sm text-gray-400">Components</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {projectStats.overview.statistics.totalConnections}
                  </div>
                  <div className="text-sm text-gray-400">Connections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {Object.keys(projectStats.overview.statistics.componentTypes).length}
                  </div>
                  <div className="text-sm text-gray-400">Types</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-400">Updated</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export options */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Export Formats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card 
                    key={option.id}
                    className={`bg-gray-800 border-gray-700 cursor-pointer transition-all hover:bg-gray-750 ${
                      selectedFormat === option.format ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleExport(option.format)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-6 h-6 text-blue-400" />
                        <div>
                          <h4 className="font-medium text-white">{option.name}</h4>
                          <p className="text-sm text-gray-400">{option.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Compatible
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Special options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Special Exports</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => exportDocumentation(project)}
                variant="outline"
                className="h-auto p-4 border-gray-600 bg-gray-800 hover:bg-gray-700 text-white justify-start"
              >
                <FileText className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Documentation</div>
                  <div className="text-sm text-gray-400">Generate complete documentation</div>
                </div>
              </Button>

              <Button
                onClick={handleGitExport}
                variant="outline"
                className="h-auto p-4 border-gray-600 bg-gray-800 hover:bg-gray-700 text-white justify-start"
              >
                <GitBranch className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Git Compatible</div>
                  <div className="text-sm text-gray-400">For version control</div>
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-700">
          <Button variant="outline" onClick={onClose} className="border-gray-600 text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
