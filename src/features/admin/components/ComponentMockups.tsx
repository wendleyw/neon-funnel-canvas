import React from 'react';

// Sistema de mockups visuais para components no canvas
export const COMPONENT_MOCKUPS = {
  // Pages - Mockups de páginas
  'landing-page-pro': {
    preview: (
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg shadow-lg">
        <div className="h-3 bg-blue-600 rounded mb-3"></div>
        <div className="h-8 bg-gray-200 rounded mb-3"></div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="h-6 bg-gray-100 rounded"></div>
          <div className="h-6 bg-blue-100 rounded"></div>
        </div>
        <div className="h-4 bg-blue-600 rounded"></div>
      </div>
    ),
    name: 'Landing Page Pro',
    type: 'page'
  },

  'checkout-pro': {
    preview: (
      <div className="w-full h-full bg-white p-4 rounded-lg shadow-lg border-2 border-green-200">
        <div className="h-2 bg-green-600 rounded mb-3"></div>
        <div className="space-y-2 mb-3">
          <div className="h-6 bg-gray-100 rounded"></div>
          <div className="h-6 bg-gray-100 rounded"></div>
          <div className="h-6 bg-gray-100 rounded"></div>
        </div>
        <div className="h-8 bg-green-600 rounded"></div>
      </div>
    ),
    name: 'Checkout Pro',
    type: 'page'
  },

  'product-launch': {
    preview: (
      <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 p-4 rounded-lg shadow-lg text-white">
        <div className="h-2 bg-white/30 rounded mb-3"></div>
        <div className="h-12 bg-white/20 rounded mb-3"></div>
        <div className="h-6 bg-white/30 rounded mb-3"></div>
        <div className="h-4 bg-yellow-400 rounded"></div>
      </div>
    ),
    name: 'Product Launch',
    type: 'page'
  },

  'basic-landing': {
    preview: (
      <div className="w-full h-full bg-white p-4 rounded-lg shadow-md border">
        <div className="h-2 bg-gray-800 rounded mb-3"></div>
        <div className="h-8 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-300 rounded mb-3"></div>
        <div className="h-6 bg-gray-800 rounded"></div>
      </div>
    ),
    name: 'Basic Landing',
    type: 'page'
  },

  // Actions - Mockups de ações
  'email-capture': {
    preview: (
      <div className="w-full h-full bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
        <div className="h-2 bg-blue-600 rounded mb-2"></div>
        <div className="h-6 bg-white border rounded mb-2"></div>
        <div className="h-6 bg-blue-600 rounded"></div>
      </div>
    ),
    name: 'Email Capture',
    type: 'action'
  },

  'payment-processing': {
    preview: (
      <div className="w-full h-full bg-green-50 p-3 rounded-lg border-2 border-green-200">
        <div className="h-2 bg-green-600 rounded mb-2"></div>
        <div className="grid grid-cols-2 gap-1 mb-2">
          <div className="h-4 bg-white border rounded"></div>
          <div className="h-4 bg-white border rounded"></div>
        </div>
        <div className="h-6 bg-green-600 rounded"></div>
      </div>
    ),
    name: 'Payment Processing',
    type: 'action'
  },

  'smart-email-sequence': {
    preview: (
      <div className="w-full h-full bg-purple-50 p-3 rounded-lg border-2 border-purple-200">
        <div className="h-2 bg-purple-600 rounded mb-2"></div>
        <div className="space-y-1 mb-2">
          <div className="h-1 bg-purple-300 rounded"></div>
          <div className="h-1 bg-purple-300 rounded"></div>
          <div className="h-1 bg-purple-300 rounded"></div>
        </div>
        <div className="h-4 bg-purple-600 rounded"></div>
      </div>
    ),
    name: 'Email Sequence',
    type: 'action'
  },

  // Sources - Mockups de fontes
  'facebook-ads': {
    preview: (
      <div className="w-full h-full bg-blue-600 p-3 rounded-lg text-white">
        <div className="h-2 bg-white/30 rounded mb-2"></div>
        <div className="h-6 bg-white/20 rounded mb-2"></div>
        <div className="h-4 bg-white/30 rounded"></div>
      </div>
    ),
    name: 'Facebook Ads',
    type: 'source'
  },

  'instagram-ads': {
    preview: (
      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-lg text-white">
        <div className="h-2 bg-white/30 rounded mb-2"></div>
        <div className="h-8 bg-white/20 rounded mb-1"></div>
        <div className="h-3 bg-white/30 rounded"></div>
      </div>
    ),
    name: 'Instagram Ads',
    type: 'source'
  },

  'google-ads': {
    preview: (
      <div className="w-full h-full bg-white p-3 rounded-lg border-2 border-yellow-400">
        <div className="h-2 bg-blue-600 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-2 bg-green-600 rounded mb-1"></div>
        <div className="h-2 bg-red-600 rounded"></div>
      </div>
    ),
    name: 'Google Ads',
    type: 'source'
  },

  'youtube-ads': {
    preview: (
      <div className="w-full h-full bg-red-600 p-3 rounded-lg text-white">
        <div className="h-8 bg-white/20 rounded mb-2"></div>
        <div className="h-2 bg-white/30 rounded mb-1"></div>
        <div className="h-2 bg-white/30 rounded"></div>
      </div>
    ),
    name: 'YouTube Ads',
    type: 'source'
  },

  'instagram-feed': {
    preview: (
      <div className="w-full h-full bg-white p-3 rounded-lg border border-gray-200">
        <div className="grid grid-cols-3 gap-1 mb-2">
          <div className="h-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded"></div>
          <div className="h-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded"></div>
          <div className="h-4 bg-gradient-to-br from-pink-400 to-red-400 rounded"></div>
        </div>
        <div className="h-2 bg-gray-200 rounded"></div>
      </div>
    ),
    name: 'Instagram Feed',
    type: 'source'
  },

  'youtube-video': {
    preview: (
      <div className="w-full h-full bg-black p-3 rounded-lg">
        <div className="h-8 bg-red-600 rounded mb-1 flex items-center justify-center">
          <div className="w-0 h-0 border-l-4 border-l-white border-y-2 border-y-transparent"></div>
        </div>
        <div className="h-2 bg-gray-600 rounded"></div>
      </div>
    ),
    name: 'YouTube Video',
    type: 'source'
  }
};

// Função para buscar mockup por nome do componente
export const getMockupByName = (componentName: string): typeof COMPONENT_MOCKUPS[keyof typeof COMPONENT_MOCKUPS] | null => {
  const key = componentName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  // Mapeamento direto
  if (COMPONENT_MOCKUPS[key as keyof typeof COMPONENT_MOCKUPS]) {
    return COMPONENT_MOCKUPS[key as keyof typeof COMPONENT_MOCKUPS];
  }
  
  // Busca por palavras-chave
  if (componentName.toLowerCase().includes('landing')) {
    if (componentName.toLowerCase().includes('pro')) {
      return COMPONENT_MOCKUPS['landing-page-pro'];
    }
    return COMPONENT_MOCKUPS['basic-landing'];
  }
  
  if (componentName.toLowerCase().includes('checkout')) {
    return COMPONENT_MOCKUPS['checkout-pro'];
  }
  
  if (componentName.toLowerCase().includes('product') && componentName.toLowerCase().includes('launch')) {
    return COMPONENT_MOCKUPS['product-launch'];
  }
  
  if (componentName.toLowerCase().includes('email')) {
    if (componentName.toLowerCase().includes('sequence')) {
      return COMPONENT_MOCKUPS['smart-email-sequence'];
    }
    return COMPONENT_MOCKUPS['email-capture'];
  }
  
  if (componentName.toLowerCase().includes('payment')) {
    return COMPONENT_MOCKUPS['payment-processing'];
  }
  
  if (componentName.toLowerCase().includes('facebook')) {
    return COMPONENT_MOCKUPS['facebook-ads'];
  }
  
  if (componentName.toLowerCase().includes('instagram')) {
    if (componentName.toLowerCase().includes('feed')) {
      return COMPONENT_MOCKUPS['instagram-feed'];
    }
    return COMPONENT_MOCKUPS['instagram-ads'];
  }
  
  if (componentName.toLowerCase().includes('google')) {
    return COMPONENT_MOCKUPS['google-ads'];
  }
  
  if (componentName.toLowerCase().includes('youtube')) {
    if (componentName.toLowerCase().includes('video')) {
      return COMPONENT_MOCKUPS['youtube-video'];
    }
    return COMPONENT_MOCKUPS['youtube-ads'];
  }
  
  return null;
};

// Função para obter mockup por tipo como fallback
export const getMockupByType = (type: 'source' | 'page' | 'action'): typeof COMPONENT_MOCKUPS[keyof typeof COMPONENT_MOCKUPS] => {
  switch (type) {
    case 'page':
      return COMPONENT_MOCKUPS['basic-landing'];
    case 'action':
      return COMPONENT_MOCKUPS['email-capture'];
    case 'source':
      return COMPONENT_MOCKUPS['facebook-ads'];
    default:
      return COMPONENT_MOCKUPS['basic-landing'];
  }
};

// Componente para exibir o mockup
export const ComponentMockup: React.FC<{
  componentName?: string;
  type?: 'source' | 'page' | 'action';
  className?: string;
  customMockupUrl?: string; // Nova prop para mockup personalizado
}> = ({ componentName, type = 'page', className = 'w-24 h-16', customMockupUrl }) => {
  
  // Priorizar mockup personalizado se disponível
  if (customMockupUrl) {
    return (
      <div className={`${className} relative overflow-hidden rounded border`}>
        <img 
          src={customMockupUrl} 
          alt={componentName || 'Custom mockup'} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback para mockup padrão se imagem personalizada falhar
            e.currentTarget.style.display = 'none';
            // Mostrar o mockup padrão
            const fallbackElement = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallbackElement) {
              fallbackElement.style.display = 'block';
            }
          }}
        />
        {/* Fallback para mockup padrão (inicialmente oculto) */}
        <div className="w-full h-full absolute top-0 left-0" style={{ display: 'none' }}>
          {(() => {
            const mockup = componentName 
              ? getMockupByName(componentName) 
              : getMockupByType(type);
            return mockup?.preview || (
              <div className="bg-gray-200 rounded border-2 border-dashed border-gray-400 flex items-center justify-center w-full h-full">
                <span className="text-xs text-gray-500">No Preview</span>
              </div>
            );
          })()}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-1 py-0.5 rounded-b">
          {componentName || 'Custom Template'}
        </div>
      </div>
    );
  }
  
  // Usar mockup padrão quando não há mockup personalizado
  const mockup = componentName 
    ? getMockupByName(componentName) 
    : getMockupByType(type);
  
  if (!mockup) {
    return (
      <div className={`${className} bg-gray-200 rounded border-2 border-dashed border-gray-400 flex items-center justify-center`}>
        <span className="text-xs text-gray-500">No Preview</span>
      </div>
    );
  }
  
  return (
    <div className={`${className} relative`}>
      {mockup.preview}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-1 py-0.5 rounded-b">
        {mockup.name}
      </div>
    </div>
  );
}; 