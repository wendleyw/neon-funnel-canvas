import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { User, Heart, Target, TrendingUp } from 'lucide-react';
import { LaunchProject } from '../../../../types/launch';

interface PersonaCardProps {
  persona: LaunchProject['personas'][number];
}

export const PersonaCard: React.FC<PersonaCardProps> = ({ persona }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-500" />
          <span>{persona.name}</span>
        </CardTitle>
        <CardDescription>{persona.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Badge variant="secondary">
              <Heart className="w-3 h-3 mr-1" />
              Motivations: {persona.motivations.join(', ')}
            </Badge>
          </div>
          <div>
            <Badge variant="secondary">
              <Target className="w-3 h-3 mr-1" />
              Goals: {persona.goals.join(', ')}
            </Badge>
          </div>
          <div>
            <Badge variant="secondary">
              <TrendingUp className="w-3 h-3 mr-1" />
              Challenges: {persona.challenges.join(', ')}
            </Badge>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
};
