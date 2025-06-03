import { FunnelTemplate, DrawingShape, DrawingConnection } from '../types/drawing';

export const marketingFunnelTemplates: FunnelTemplate[] = [
  {
    id: 'classic-marketing-funnel',
    name: 'Classic Marketing Funnel',
    description: 'Traditional AIDA (Awareness, Interest, Desire, Action) marketing funnel',
    category: 'marketing',
    thumbnail: '🔸',
    metrics: {
      stages: 4,
      expectedConversionRate: 0.15
    },
    shapes: [
      {
        type: 'funnel',
        position: { x: 0, y: 0 },
        size: { width: 200, height: 80 },
        style: {
          fill: '#3B82F6',
          stroke: '#1E40AF',
          strokeWidth: 2,
          gradient: {
            type: 'linear',
            colors: ['#60A5FA', '#3B82F6'],
            direction: 180
          }
        },
        text: 'Awareness',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#FFFFFF',
          align: 'center',
          verticalAlign: 'middle'
        },
        funnelStage: 'awareness',
        conversionRate: 1.0,
        metrics: {
          visitors: 10000,
          conversions: 10000
        }
      },
      {
        type: 'funnel',
        position: { x: 0, y: 100 },
        size: { width: 160, height: 80 },
        style: {
          fill: '#10B981',
          stroke: '#059669',
          strokeWidth: 2,
          gradient: {
            type: 'linear',
            colors: ['#34D399', '#10B981'],
            direction: 180
          }
        },
        text: 'Interest',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#FFFFFF',
          align: 'center',
          verticalAlign: 'middle'
        },
        funnelStage: 'interest',
        conversionRate: 0.4,
        metrics: {
          visitors: 4000,
          conversions: 4000
        }
      },
      {
        type: 'funnel',
        position: { x: 0, y: 200 },
        size: { width: 120, height: 80 },
        style: {
          fill: '#F59E0B',
          stroke: '#D97706',
          strokeWidth: 2,
          gradient: {
            type: 'linear',
            colors: ['#FCD34D', '#F59E0B'],
            direction: 180
          }
        },
        text: 'Desire',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#FFFFFF',
          align: 'center',
          verticalAlign: 'middle'
        },
        funnelStage: 'consideration',
        conversionRate: 0.5,
        metrics: {
          visitors: 2000,
          conversions: 2000
        }
      },
      {
        type: 'funnel',
        position: { x: 0, y: 300 },
        size: { width: 80, height: 80 },
        style: {
          fill: '#EF4444',
          stroke: '#DC2626',
          strokeWidth: 2,
          gradient: {
            type: 'linear',
            colors: ['#F87171', '#EF4444'],
            direction: 180
          }
        },
        text: 'Action',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#FFFFFF',
          align: 'center',
          verticalAlign: 'middle'
        },
        funnelStage: 'purchase',
        conversionRate: 0.375,
        metrics: {
          visitors: 750,
          conversions: 750
        }
      }
    ],
    connections: [
      {
        from: {
          shapeId: 'shape-1',
          point: { x: 100, y: 80 },
          side: 'bottom'
        },
        to: {
          shapeId: 'shape-2',
          point: { x: 80, y: 0 },
          side: 'top'
        },
        style: {
          stroke: '#6B7280',
          strokeWidth: 2,
          arrowType: 'end',
          animated: true
        },
        label: {
          text: '40%',
          position: { x: 90, y: 90 },
          style: {
            fontSize: 12,
            color: '#9CA3AF',
            align: 'center'
          }
        }
      }
    ]
  },
  {
    id: 'saas-conversion-funnel',
    name: 'SaaS Conversion Funnel',
    description: 'Software as a Service customer acquisition and retention funnel',
    category: 'sales',
    thumbnail: '💻',
    metrics: {
      stages: 6,
      expectedConversionRate: 0.08
    },
    shapes: [
      {
        type: 'rectangle',
        position: { x: 0, y: 0 },
        size: { width: 220, height: 60 },
        style: {
          fill: '#8B5CF6',
          stroke: '#7C3AED',
          strokeWidth: 2,
          borderRadius: 8,
          gradient: {
            type: 'linear',
            colors: ['#A78BFA', '#8B5CF6'],
            direction: 180
          }
        },
        text: 'Website Visitors',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#FFFFFF',
          align: 'center',
          verticalAlign: 'middle'
        },
        funnelStage: 'awareness',
        conversionRate: 1.0,
        metrics: {
          visitors: 50000
        }
      },
      {
        type: 'rectangle',
        position: { x: 10, y: 80 },
        size: { width: 200, height: 60 },
        style: {
          fill: '#06B6D4',
          stroke: '#0891B2',
          strokeWidth: 2,
          borderRadius: 8,
          gradient: {
            type: 'linear',
            colors: ['#67E8F9', '#06B6D4'],
            direction: 180
          }
        },
        text: 'Trial Signups',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#FFFFFF',
          align: 'center',
          verticalAlign: 'middle'
        },
        funnelStage: 'interest',
        conversionRate: 0.12,
        metrics: {
          visitors: 6000
        }
      },
      {
        type: 'rectangle',
        position: { x: 20, y: 160 },
        size: { width: 180, height: 60 },
        style: {
          fill: '#10B981',
          stroke: '#059669',
          strokeWidth: 2,
          borderRadius: 8,
          gradient: {
            type: 'linear',
            colors: ['#6EE7B7', '#10B981'],
            direction: 180
          }
        },
        text: 'Active Users',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#FFFFFF',
          align: 'center',
          verticalAlign: 'middle'
        },
        funnelStage: 'consideration',
        conversionRate: 0.7,
        metrics: {
          visitors: 4200
        }
      },
      {
        type: 'rectangle',
        position: { x: 30, y: 240 },
        size: { width: 160, height: 60 },
        style: {
          fill: '#F59E0B',
          stroke: '#D97706',
          strokeWidth: 2,
          borderRadius: 8,
          gradient: {
            type: 'linear',
            colors: ['#FDE68A', '#F59E0B'],
            direction: 180
          }
        },
        text: 'Paid Subscribers',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#FFFFFF',
          align: 'center',
          verticalAlign: 'middle'
        },
        funnelStage: 'purchase',
        conversionRate: 0.15,
        metrics: {
          visitors: 630,
          revenue: 63000
        }
      },
      {
        type: 'rectangle',
        position: { x: 40, y: 320 },
        size: { width: 140, height: 60 },
        style: {
          fill: '#EF4444',
          stroke: '#DC2626',
          strokeWidth: 2,
          borderRadius: 8,
          gradient: {
            type: 'linear',
            colors: ['#FCA5A5', '#EF4444'],
            direction: 180
          }
        },
        text: 'Long-term Users',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#FFFFFF',
          align: 'center',
          verticalAlign: 'middle'
        },
        funnelStage: 'retention',
        conversionRate: 0.8,
        metrics: {
          visitors: 504,
          revenue: 151200
        }
      },
      {
        type: 'rectangle',
        position: { x: 50, y: 400 },
        size: { width: 120, height: 60 },
        style: {
          fill: '#EC4899',
          stroke: '#DB2777',
          strokeWidth: 2,
          borderRadius: 8,
          gradient: {
            type: 'linear',
            colors: ['#F9A8D4', '#EC4899'],
            direction: 180
          }
        },
        text: 'Advocates',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#FFFFFF',
          align: 'center',
          verticalAlign: 'middle'
        },
        funnelStage: 'advocacy',
        conversionRate: 0.3,
        metrics: {
          visitors: 151
        }
      }
    ],
    connections: []
  },
  {
    id: 'ecommerce-purchase-funnel',
    name: 'E-commerce Purchase Funnel',
    description: 'Online store customer journey from discovery to purchase',
    category: 'conversion',
    thumbnail: '🛒',
    metrics: {
      stages: 5,
      expectedConversionRate: 0.025
    },
    shapes: [
      {
        type: 'diamond',
        position: { x: 0, y: 0 },
        size: { width: 160, height: 80 },
        style: {
          fill: '#6366F1',
          stroke: '#4F46E5',
          strokeWidth: 2,
          gradient: {
            type: 'linear',
            colors: ['#818CF8', '#6366F1'],
            direction: 135
          }
        },
        text: 'Product Discovery',
        textStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          color: '#FFFFFF',
          align: 'center',
          verticalAlign: 'middle'
        },
        funnelStage: 'awareness',
        metrics: {
          visitors: 100000
        }
      },
      {
        type: 'circle',
        position: { x: 0, y: 100 },
        size: { width: 140, height: 140 },
        style: {
          fill: '#059669',
          stroke: '#047857',
          strokeWidth: 2,
          gradient: {
            type: 'radial',
            colors: ['#34D399', '#059669']
          }
        },
        text: 'Product View',
        textStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          color: '#FFFFFF',
          align: 'center',
          verticalAlign: 'middle'
        },
        funnelStage: 'interest',
        conversionRate: 0.15,
        metrics: {
          visitors: 15000
        }
      },
      {
        type: 'hexagon',
        position: { x: 0, y: 260 },
        size: { width: 120, height: 104 },
        style: {
          fill: '#DC2626',
          stroke: '#B91C1C',
          strokeWidth: 2,
          gradient: {
            type: 'linear',
            colors: ['#F87171', '#DC2626'],
            direction: 90
          }
        },
        text: 'Add to Cart',
        textStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          color: '#FFFFFF',
          align: 'center',
          verticalAlign: 'middle'
        },
        funnelStage: 'consideration',
        conversionRate: 0.25,
        metrics: {
          visitors: 3750
        }
      },
      {
        type: 'star',
        position: { x: 0, y: 384 },
        size: { width: 100, height: 100 },
        style: {
          fill: '#7C2D12',
          stroke: '#92400E',
          strokeWidth: 2,
          gradient: {
            type: 'radial',
            colors: ['#FBBF24', '#F59E0B']
          }
        },
        text: 'Checkout',
        textStyle: {
          fontSize: 11,
          fontWeight: 'bold',
          color: '#FFFFFF',
          align: 'center',
          verticalAlign: 'middle'
        },
        funnelStage: 'intent',
        conversionRate: 0.4,
        metrics: {
          visitors: 1500
        }
      },
      {
        type: 'rectangle',
        position: { x: 0, y: 504 },
        size: { width: 80, height: 60 },
        style: {
          fill: '#065F46',
          stroke: '#047857',
          strokeWidth: 2,
          borderRadius: 6,
          gradient: {
            type: 'linear',
            colors: ['#10B981', '#065F46'],
            direction: 180
          }
        },
        text: 'Purchase',
        textStyle: {
          fontSize: 11,
          fontWeight: 'bold',
          color: '#FFFFFF',
          align: 'center',
          verticalAlign: 'middle'
        },
        funnelStage: 'purchase',
        conversionRate: 0.67,
        metrics: {
          visitors: 1000,
          conversions: 1000,
          revenue: 85000
        }
      }
    ],
    connections: []
  }
];

export const getFunnelTemplateById = (id: string): FunnelTemplate | undefined => {
  return marketingFunnelTemplates.find(template => template.id === id);
};

export const getFunnelTemplatesByCategory = (category: FunnelTemplate['category']): FunnelTemplate[] => {
  return marketingFunnelTemplates.filter(template => template.category === category);
}; 