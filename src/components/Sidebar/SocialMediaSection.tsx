
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Instagram, Youtube } from 'lucide-react';
import { ComponentTemplate, FunnelComponent, Connection } from '../../types/funnel';
import { socialMediaTemplates } from '../../features/social-media/data/templates';
import { ComponentTemplateItem } from './ComponentTemplateItem';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

interface SocialMediaSectionProps {
  onDragStart: (e: React.DragEvent, template: ComponentTemplate) => void;
  onAddCompleteTemplate?: (components: FunnelComponent[], connections: Connection[]) => void;
}

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  onDragStart,
  onAddCompleteTemplate
}) => {
  const [favorites, setFavorites] = useState<string[]>(['instagram-post', 'instagram-story', 'youtube-video']);

  const toggleFavorite = (templateType: string) => {
    setFavorites(prev => 
      prev.includes(templateType) 
        ? prev.filter(t => t !== templateType)
        : [...prev, templateType]
    );
  };

  const createCompleteInstagramFlow = () => {
    const components: FunnelComponent[] = [];
    const connections: Connection[] = [];
    
    const instagramTemplates = socialMediaTemplates.filter(t => 
      t.type.startsWith('instagram-')
    );

    // Criar componentes em linha
    instagramTemplates.forEach((template, index) => {
      const component: FunnelComponent = {
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: template.type,
        position: {
          x: 100 + (index * 220),
          y: 200
        },
        connections: [],
        data: {
          ...template.defaultProps,
          title: template.defaultProps.title,
          description: template.defaultProps.description,
          status: template.defaultProps.status,
          properties: { ...template.defaultProps.properties }
        }
      };
      components.push(component);
    });

    // Conectar em sequência
    for (let i = 0; i < components.length - 1; i++) {
      connections.push({
        id: `connection-${Date.now()}-${i}`,
        from: components[i].id,
        to: components[i + 1].id,
        type: 'success',
        color: '#E4405F'
      });
    }

    if (onAddCompleteTemplate) {
      onAddCompleteTemplate(components, connections);
    }
  };

  const createCompleteYouTubeFlow = () => {
    const components: FunnelComponent[] = [];
    const connections: Connection[] = [];
    
    const youtubeTemplates = socialMediaTemplates.filter(t => 
      t.type.startsWith('youtube-')
    );

    youtubeTemplates.forEach((template, index) => {
      const component: FunnelComponent = {
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: template.type,
        position: {
          x: 100 + (index * 220),
          y: 350
        },
        connections: [],
        data: {
          ...template.defaultProps,
          title: template.defaultProps.title,
          description: template.defaultProps.description,
          status: template.defaultProps.status,
          properties: { ...template.defaultProps.properties }
        }
      };
      components.push(component);
    });

    // Conectar thumbnail -> video -> shorts
    for (let i = 0; i < components.length - 1; i++) {
      connections.push({
        id: `connection-${Date.now()}-${i}`,
        from: components[i].id,
        to: components[i + 1].id,
        type: 'success',
        color: '#FF0000'
      });
    }

    if (onAddCompleteTemplate) {
      onAddCompleteTemplate(components, connections);
    }
  };

  // Agrupar templates por plataforma
  const platformGroups = {
    Instagram: socialMediaTemplates.filter(t => t.type.startsWith('instagram-')),
    TikTok: socialMediaTemplates.filter(t => t.type.startsWith('tiktok-')),
    YouTube: socialMediaTemplates.filter(t => t.type.startsWith('youtube-')),
    Facebook: socialMediaTemplates.filter(t => t.type.startsWith('facebook-')),
    LinkedIn: socialMediaTemplates.filter(t => t.type.startsWith('linkedin-')),
    Twitter: socialMediaTemplates.filter(t => t.type.startsWith('twitter-'))
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
        Social Media
      </h3>

      {/* Quick Actions */}
      <div className="space-y-2">
        <Button
          onClick={createCompleteInstagramFlow}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium text-sm"
          size="sm"
        >
          <Instagram className="w-4 h-4 mr-2" />
          Flow Instagram Completo
        </Button>

        <Button
          onClick={createCompleteYouTubeFlow}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium text-sm"
          size="sm"
        >
          <Youtube className="w-4 h-4 mr-2" />
          Flow YouTube Completo
        </Button>
      </div>

      {/* Favoritos */}
      {favorites.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-yellow-400 uppercase tracking-wider">
            Favoritos
          </h4>
          {socialMediaTemplates
            .filter(template => favorites.includes(template.type))
            .map((template) => (
              <ComponentTemplateItem
                key={template.type}
                template={template}
                onDragStart={onDragStart}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
                isCompact={true}
              />
            ))}
        </div>
      )}

      {/* Templates por Plataforma */}
      <Accordion type="multiple" className="w-full space-y-1">
        {Object.entries(platformGroups).map(([platform, templates]) => (
          <AccordionItem 
            key={platform} 
            value={platform.toLowerCase()}
            className="border border-gray-700 rounded-lg bg-gray-900/50"
          >
            <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-gray-800/50 rounded-t-lg text-gray-300 text-sm">
              {platform}
            </AccordionTrigger>
            <AccordionContent className="px-2 pb-2">
              <div className="space-y-1 pt-1">
                {templates.map((template) => (
                  <ComponentTemplateItem
                    key={template.type}
                    template={template}
                    onDragStart={onDragStart}
                    isFavorite={favorites.includes(template.type)}
                    onToggleFavorite={toggleFavorite}
                    isCompact={true}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
