import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card';
import { Instagram, Youtube, Facebook, Linkedin, Twitter } from 'lucide-react';
import { FunnelComponent } from '../../../types/funnel';

interface SocialMediaSpecsProps {
  component: FunnelComponent;
}

export const SocialMediaSpecs: React.FC<SocialMediaSpecsProps> = ({
  component
}) => {
  const getPlatformIcon = () => {
    const type = component.type;
    if (type.includes('instagram-')) return <Instagram className="w-4 h-4" />;
    if (type.includes('youtube-')) return <Youtube className="w-4 h-4" />;
    if (type.includes('facebook-')) return <Facebook className="w-4 h-4" />;
    if (type.includes('linkedin-')) return <Linkedin className="w-4 h-4" />;
    if (type.includes('twitter-')) return <Twitter className="w-4 h-4" />;
    return null;
  };

  const getDimensionsInfo = () => {
    const props = component.data.properties;
    if (props?.dimensions && props?.aspectRatio) {
      return `${props.dimensions} (${props.aspectRatio})`;
    }
    return 'Dimensions not specified';
  };

  const getPlatformName = () => {
    return component.data.properties?.platform || component.type.split('-')[0];
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-white">
          {getPlatformIcon()}
          Platform Specifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-300">Dimensions</label>
            <p className="text-sm font-mono bg-gray-700 p-2 rounded text-gray-200">
              {getDimensionsInfo()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300">Platform</label>
            <p className="text-sm bg-gray-700 p-2 rounded text-gray-200 capitalize">
              {getPlatformName()}
            </p>
          </div>
        </div>
        
        {component.data.properties?.duration && (
          <div>
            <label className="text-sm font-medium text-gray-300">Duration</label>
            <p className="text-sm bg-gray-700 p-2 rounded text-gray-200">
              {component.data.properties.duration}
            </p>
          </div>
        )}

        {component.data.properties?.format && (
          <div>
            <label className="text-sm font-medium text-gray-300">Format</label>
            <p className="text-sm bg-gray-700 p-2 rounded text-gray-200">
              {component.data.properties.format}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 