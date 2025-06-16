import React from 'react';
import { LaunchProject } from '../../../types/launch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../features/shared/ui/card';
import { Badge } from '../../../features/shared/ui/badge';
import { Button } from '../../../features/shared/ui/button';
import { Edit, Trash2, DollarSign, Clock, Target } from 'lucide-react';

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  validUntil?: string;
  type: 'product' | 'service' | 'course' | 'ebook';
  status: 'active' | 'inactive' | 'expired';
  tags: string[];
}

interface OfferCardProps {
  offer: Offer;
  onEdit: (offer: Offer) => void;
  onDelete: (offerId: string) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onEdit,
  onDelete
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product': return '📦';
      case 'service': return '🛠️';
      case 'course': return '🎓';
      case 'ebook': return '📚';
      default: return '💼';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getTypeIcon(offer.type)}</span>
            <div>
              <CardTitle className="text-lg">{offer.title}</CardTitle>
              <Badge className={getStatusColor(offer.status)} variant="secondary">
                {offer.status}
              </Badge>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(offer)}
            >
              <Edit size={14} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(offer.id)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-2">
          {offer.description}
        </p>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <DollarSign size={16} className="text-green-600" />
            <span className="font-semibold text-green-600">
              R$ {offer.price.toFixed(2)}
            </span>
            {offer.originalPrice && offer.originalPrice > offer.price && (
              <span className="text-gray-500 line-through">
                R$ {offer.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {offer.discount && (
            <div className="flex items-center space-x-1">
              <Target size={16} className="text-orange-600" />
              <span className="text-orange-600 font-medium">
                -{offer.discount}%
              </span>
            </div>
          )}
        </div>
        
        {offer.validUntil && (
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock size={16} />
            <span>Válido até: {new Date(offer.validUntil).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
        
        {offer.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {offer.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {offer.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{offer.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
