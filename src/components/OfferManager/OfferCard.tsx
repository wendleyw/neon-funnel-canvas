
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DollarSign, Gift, Shield, TrendingUp, Edit, ExternalLink } from 'lucide-react';
import { ProductOffer } from '../../types/launch';

interface OfferCardProps {
  offer: ProductOffer;
  onEdit: (offer: ProductOffer) => void;
  onViewSalesPage: (url: string) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onEdit,
  onViewSalesPage
}) => {
  const getTypeColor = (type: ProductOffer['type']) => {
    const colors = {
      'digital': 'bg-blue-500',
      'physical': 'bg-green-500',
      'service': 'bg-purple-500',
      'course': 'bg-orange-500',
      'subscription': 'bg-indigo-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const getTypeLabel = (type: ProductOffer['type']) => {
    const labels = {
      'digital': 'Digital',
      'physical': 'Físico',
      'service': 'Serviço',
      'course': 'Curso',
      'subscription': 'Assinatura'
    };
    return labels[type] || type;
  };

  const hasDiscount = offer.originalPrice && offer.originalPrice > offer.price;
  const discountPercent = hasDiscount 
    ? Math.round(((offer.originalPrice! - offer.price) / offer.originalPrice!) * 100)
    : 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg font-semibold">{offer.name}</CardTitle>
              <Badge className={getTypeColor(offer.type)}>
                {getTypeLabel(offer.type)}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{offer.description}</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(offer)}>
              <Edit className="w-4 h-4" />
            </Button>
            {offer.salesPageUrl && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onViewSalesPage(offer.salesPageUrl!)}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Imagem principal */}
        {offer.images.length > 0 && (
          <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={offer.images[0]} 
              alt={offer.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Preço */}
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: offer.currency
              }).format(offer.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: offer.currency
                  }).format(offer.originalPrice!)}
                </span>
                <Badge variant="destructive" className="text-xs">
                  -{discountPercent}%
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Proposta de Valor */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Proposta de Valor</h4>
          <p className="text-sm text-gray-600">{offer.valueProposition}</p>
        </div>

        {/* Bônus */}
        {offer.bonus.length > 0 && (
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-600">
              {offer.bonus.length} bônus inclusos
            </span>
          </div>
        )}

        {/* Garantia */}
        {offer.guarantee && (
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">
              Garantia de {offer.guarantee.duration} {offer.guarantee.unit}
            </span>
          </div>
        )}

        {/* Gatilhos Mentais Ativos */}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-gray-600">
            {offer.mentalTriggers.filter(trigger => trigger.active).length} gatilhos ativos
          </span>
        </div>

        {/* Features principais */}
        {offer.features.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Principais Features</h4>
            <div className="space-y-1">
              {offer.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                  <div className="w-1 h-1 bg-blue-500 rounded-full" />
                  {feature}
                </div>
              ))}
              {offer.features.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{offer.features.length - 3} features adicionais
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
