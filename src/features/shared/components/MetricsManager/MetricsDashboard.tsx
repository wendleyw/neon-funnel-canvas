import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { LaunchProject } from '../../../../types/launch';

interface MetricsDashboardProps {
  project: LaunchProject;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ project }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Metrics</CardTitle>
        <CardDescription>Key performance indicators for your launch</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Placeholder for actual metrics */}
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Traffic</Badge>
          <span>{project.metrics?.traffic || 'N/A'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Conversion Rate</Badge>
          <span>{project.metrics?.conversionRate || 'N/A'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Revenue</Badge>
          <span>{project.metrics?.revenue || 'N/A'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Customer Acquisition Cost</Badge>
          <span>{project.metrics?.cac || 'N/A'}</span>
        </div>
        <Button>Update Metrics</Button>
      </CardContent>
    </Card>
  );
};
