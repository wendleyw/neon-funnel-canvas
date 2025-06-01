
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
    <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700/50 group relative overflow-hidden">
      {/* Neon border effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Inner glow */}
      <div className="absolute inset-[1px] rounded-lg bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-12 h-12 ring-2 ring-gray-700 group-hover:ring-cyan-500/50 transition-all duration-300">
                <AvatarImage src={persona.avatar} alt={persona.name} />
                <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-purple-600 text-white font-semibold">
                  {persona.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* Avatar glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-white group-hover:text-cyan-100 transition-colors">
                {persona.name}
              </CardTitle>
              {persona.age && (
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  {persona.age} anos
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(persona)}
              className="hover:bg-gray-700/50 hover:text-cyan-400 transition-all duration-200"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onLink(persona.id)}
              className="hover:bg-gray-700/50 hover:text-purple-400 transition-all duration-200"
            >
              <Link className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-300 mt-2 group-hover:text-gray-200 transition-colors">
          {persona.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Demografia */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-200 flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full" />
            Demografia
          </h4>
          <div className="flex flex-wrap gap-2">
            {persona.demographics.location && (
              <div className="flex items-center gap-1 text-xs text-gray-300 bg-gray-800/50 px-2 py-1 rounded-md border border-gray-700/50">
                <MapPin className="w-3 h-3 text-cyan-400" />
                {persona.demographics.location}
              </div>
            )}
            {persona.demographics.profession && (
              <div className="flex items-center gap-1 text-xs text-gray-300 bg-gray-800/50 px-2 py-1 rounded-md border border-gray-700/50">
                <Briefcase className="w-3 h-3 text-purple-400" />
                {persona.demographics.profession}
              </div>
            )}
          </div>
        </div>

        {/* Dores principais */}
        {persona.pains.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.5))' }} />
              Principais Dores
            </h4>
            <div className="space-y-1">
              {persona.pains.slice(0, 3).map((pain, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20 transition-colors">
                  {pain}
                </Badge>
              ))}
              {persona.pains.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-700/50 text-gray-300">
                  +{persona.pains.length - 3} mais
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Sonhos principais */}
        {persona.dreams.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-200 flex items-center gap-2">
              <Heart className="w-4 h-4 text-green-400 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.5))' }} />
              Principais Sonhos
            </h4>
            <div className="space-y-1">
              {persona.dreams.slice(0, 3).map((dream, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-green-500/10 border-green-500/30 text-green-300 hover:bg-green-500/20 transition-colors">
                  {dream}
                </Badge>
              ))}
              {persona.dreams.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-700/50 text-gray-300">
                  +{persona.dreams.length - 3} mais
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Métricas com visual melhorado */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30 group-hover:border-cyan-500/30 transition-colors">
            <h4 className="text-xs font-medium text-gray-400 mb-1">Mensagens-chave</h4>
            <p className="text-sm text-cyan-400 font-semibold">
              {persona.keyMessages.length} configuradas
            </p>
          </div>
          
          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30 group-hover:border-purple-500/30 transition-colors">
            <h4 className="text-xs font-medium text-gray-400 mb-1">Conexões</h4>
            <div className="flex gap-2 text-xs">
              <span className="text-purple-400 font-semibold">{persona.linkedProducts.length} produtos</span>
              <span className="text-gray-500">•</span>
              <span className="text-cyan-400 font-semibold">{persona.linkedCampaigns.length} campanhas</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Selection glow effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
           style={{
             boxShadow: '0 0 0 1px rgba(6, 182, 212, 0.3), 0 0 20px rgba(6, 182, 212, 0.1), 0 0 40px rgba(147, 51, 234, 0.1)'
           }} />
    </Card>
  );
};
