
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { MapPin, Briefcase, Heart, AlertTriangle, Edit, Link } from 'lucide-react';
import { Persona } from '../../types/launch';

interface PersonaCardProps {
  persona: Persona;
  onEdit: (persona: Persona) => void;
  onLink: (personaId: string) => void;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({
  persona,
  onEdit,
  onLink
}) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={persona.avatar} alt={persona.name} />
              <AvatarFallback>
                {persona.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold">{persona.name}</CardTitle>
              {persona.age && (
                <p className="text-sm text-gray-600">{persona.age} anos</p>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(persona)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onLink(persona.id)}>
              <Link className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{persona.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Demografia */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Demografia</h4>
          <div className="flex flex-wrap gap-2">
            {persona.demographics.location && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <MapPin className="w-3 h-3" />
                {persona.demographics.location}
              </div>
            )}
            {persona.demographics.profession && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Briefcase className="w-3 h-3" />
                {persona.demographics.profession}
              </div>
            )}
          </div>
        </div>

        {/* Dores principais */}
        {persona.pains.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Principais Dores
            </h4>
            <div className="space-y-1">
              {persona.pains.slice(0, 3).map((pain, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {pain}
                </Badge>
              ))}
              {persona.pains.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{persona.pains.length - 3} mais
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Sonhos principais */}
        {persona.dreams.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Heart className="w-4 h-4 text-green-500" />
              Principais Sonhos
            </h4>
            <div className="space-y-1">
              {persona.dreams.slice(0, 3).map((dream, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {dream}
                </Badge>
              ))}
              {persona.dreams.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{persona.dreams.length - 3} mais
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Mensagens-chave */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Mensagens-chave</h4>
          <p className="text-xs text-gray-600">
            {persona.keyMessages.length} mensagens configuradas
          </p>
        </div>

        {/* Produtos/Campanhas linkados */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Conexões</h4>
          <div className="flex gap-4 text-xs text-gray-600">
            <span>{persona.linkedProducts.length} produtos</span>
            <span>{persona.linkedCampaigns.length} campanhas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
