
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Edit, Trash2, User, MapPin, Briefcase } from 'lucide-react';

export interface Persona {
  id: string;
  name: string;
  age: number;
  occupation: string;
  location: string;
  description: string;
  painPoints: string[];
  goals: string[];
  preferredChannels: string[];
  avatar?: string;
}

interface PersonaCardProps {
  persona: Persona;
  onEdit: (persona: Persona) => void;
  onDelete: (personaId: string) => void;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({
  persona,
  onEdit,
  onDelete
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {persona.avatar ? (
              <img
                src={persona.avatar}
                alt={persona.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={24} className="text-gray-500" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{persona.name}</CardTitle>
              <p className="text-sm text-gray-500">{persona.age} anos</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(persona)}
            >
              <Edit size={14} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(persona.id)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Briefcase size={16} className="text-blue-600" />
            <span>{persona.occupation}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <MapPin size={16} className="text-green-600" />
            <span>{persona.location}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {persona.description}
        </p>
        
        {persona.painPoints.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-700 mb-1">Dores:</h4>
            <div className="flex flex-wrap gap-1">
              {persona.painPoints.slice(0, 2).map((pain, index) => (
                <Badge key={index} variant="outline" className="text-xs text-red-600 border-red-200">
                  {pain}
                </Badge>
              ))}
              {persona.painPoints.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{persona.painPoints.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {persona.goals.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-1">Objetivos:</h4>
            <div className="flex flex-wrap gap-1">
              {persona.goals.slice(0, 2).map((goal, index) => (
                <Badge key={index} variant="outline" className="text-xs text-green-600 border-green-200">
                  {goal}
                </Badge>
              ))}
              {persona.goals.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{persona.goals.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {persona.preferredChannels.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-blue-700 mb-1">Canais:</h4>
            <div className="flex flex-wrap gap-1">
              {persona.preferredChannels.slice(0, 3).map((channel, index) => (
                <Badge key={index} variant="outline" className="text-xs text-blue-600 border-blue-200">
                  {channel}
                </Badge>
              ))}
              {persona.preferredChannels.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{persona.preferredChannels.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
