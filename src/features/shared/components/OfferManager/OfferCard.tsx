
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card';
import { Badge } from '@/features/shared/ui/badge';
import { Button } from '@/features/shared/ui/button';
import { DollarSign, Gift, Shield, TrendingUp, Edit, ExternalLink } from 'lucide-react';
import { ProductOffer } from '../../../types/launch';

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
      'digital': 'from-blue-500 to-cyan-500',
      'physical': 'from-green-500 to-emerald-500',
      'service': 'from-purple-500 to-violet-500',
      'course': 'from-orange-500 to-amber-500',
      'subscription': 'from-indigo-500 to-blue-500'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const getTypeGlow = (type: ProductOffer['type']) => {
    const glows = {
      'digital': 'shadow-blue-500/20',
      'physical': 'shadow-green-500/20',
      'service': 'shadow-purple-500/20',
      'course': 'shadow-orange-500/20',
      'subscription': 'shadow-indigo-500/20'
    };
    return glows[type] || 'shadow-gray-500/20';
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
    <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700/50 group relative overflow-hidden">
      {/* Neon border effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Inner glow baseado no tipo */}
      <div className={`absolute inset-[1px] rounded-lg bg-gradient-to-br ${getTypeColor(offer.type)} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">
                {offer.name}
              </CardTitle>
              <Badge className={`bg-gradient-to-r ${getTypeColor(offer.type)} text-white border-0 shadow-lg ${getTypeGlow(offer.type)}`}>
                {getTypeLabel(offer.type)}
              </Badge>
            </div>
            <p className="text-sm text-gray-300 line-clamp-2 group-hover:text-gray-200 transition-colors">
              {offer.description}
            </p>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(offer)}
              className="hover:bg-gray-700/50 hover:text-cyan-400 transition-all duration-200"
            >
              <Edit className="w-4 h-4" />
            </Button>
            {offer.salesPageUrl && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onViewSalesPage(offer.salesPageUrl!)}
                className="hover:bg-gray-700/50 hover:text-purple-400 transition-all duration-200"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Imagem principal com overlay */}
        {offer.images.length > 0 && (
          <div className="w-full h-32 bg-gray-800/50 rounded-lg overflow-hidden relative group/image border border-gray-700/30">
            <img 
              src={offer.images[0]} 
              alt={offer.name}
              className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        {/* Preço com efeito neon */}
        <div className="flex items-center gap-2 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
          <DollarSign className="w-5 h-5 text-green-400 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.5))' }} />
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-green-400" style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.3)' }}>
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
                <Badge variant="destructive" className="text-xs bg-gradient-to-r from-red-500 to-pink-500 animate-pulse">
                  -{discountPercent}%
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Proposta de Valor */}
        <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30 group-hover:border-gray-600/30 transition-colors">
          <h4 className="text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full" />
            Proposta de Valor
          </h4>
          <p className="text-sm text-gray-300">{offer.valueProposition}</p>
        </div>

        {/* Métricas com ícones brilhantes */}
        <div className="grid grid-cols-3 gap-2">
          {/* Bônus */}
          {offer.bonus.length > 0 && (
            <div className="flex items-center gap-2 bg-gray-800/30 rounded-lg p-2 border border-gray-700/30">
              <Gift className="w-4 h-4 text-purple-400 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 4px rgba(147, 51, 234, 0.5))' }} />
              <span className="text-xs text-gray-300">
                {offer.bonus.length} bônus
              </span>
            </div>
          )}

          {/* Garantia */}
          {offer.guarantee && (
            <div className="flex items-center gap-2 bg-gray-800/30 rounded-lg p-2 border border-gray-700/30">
              <Shield className="w-4 h-4 text-blue-400 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))' }} />
              <span className="text-xs text-gray-300">
                {offer.guarantee.duration}{offer.guarantee.unit.charAt(0)}
              </span>
            </div>
          )}

          {/* Gatilhos Mentais */}
          <div className="flex items-center gap-2 bg-gray-800/30 rounded-lg p-2 border border-gray-700/30">
            <TrendingUp className="w-4 h-4 text-orange-400 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 4px rgba(251, 146, 60, 0.5))' }} />
            <span className="text-xs text-gray-300">
              {offer.mentalTriggers.filter(trigger => trigger.active).length} gatilhos
            </span>
          </div>
        </div>

        {/* Features principais */}
        {offer.features.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-green-500 to-blue-500 rounded-full" />
              Principais Features
            </h4>
            <div className="space-y-1">
              {offer.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="text-xs text-gray-300 flex items-center gap-2 bg-gray-800/20 rounded px-2 py-1">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-sm" />
                  {feature}
                </div>
              ))}
              {offer.features.length > 3 && (
                <div className="text-xs text-gray-500 italic pl-3">
                  +{offer.features.length - 3} features adicionais
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Enhanced selection glow */}
      <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${getTypeGlow(offer.type)}`}
           style={{
             boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 20px rgba(59, 130, 246, 0.1), 0 0 40px rgba(147, 51, 234, 0.1)'
           }} />
    </Card>
  );
};
