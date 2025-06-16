import React from 'react';
import { LaunchProject } from '../../../types/launch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../features/shared/ui/card';
import { Badge } from '../../../features/shared/ui/badge';
import { Button } from '../../../features/shared/ui/button';

interface PersonaCardProps {
  persona: LaunchProject['personas'][number];
}

export const PersonaCard: React.FC<PersonaCardProps> = ({ persona }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{persona.name}</CardTitle>
        <CardDescription>{persona.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div>
            <Badge>Age: {persona.age}</Badge>
          </div>
          <div>
            <Badge>Occupation: {persona.occupation}</Badge>
          </div>
          <div>
            <Badge>Goals: {persona.goals.join(', ')}</Badge>
          </div>
          <div>
            <Badge>Challenges: {persona.challenges.join(', ')}</Badge>
          </div>
        </div>
        <div className="mt-4">
          <Button>View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
};
