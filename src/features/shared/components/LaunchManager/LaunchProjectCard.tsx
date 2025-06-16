import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Calendar, Users, Target, TrendingUp } from 'lucide-react';
import { LaunchProject } from '../../../../types/launch';

interface LaunchProjectCardProps {
  project: LaunchProject;
}

export const LaunchProjectCard: React.FC<LaunchProjectCardProps> = ({ project }) => {
  return (
    <Card className="bg-gray-900 text-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
        <CardDescription className="text-gray-400">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-300">
            {new Date(project.dueDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-300">{project.targetAudience}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Target className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-300">{project.goal}</span>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-300">{project.expectedRevenue}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-blue-900 border-blue-600 text-blue-200">{project.status}</Badge>
        </div>
        <Button className="w-full bg-blue-500 hover:bg-blue-400 text-white">
          View Project
        </Button>
      </CardContent>
    </Card>
  );
};
