import { ComponentTemplate } from '../types/funnel';

// Definição das ações de usuário organizadas por categorias
export interface UserAction extends ComponentTemplate {
  actionType: 'conversion' | 'engagement' | 'integration' | 'custom';
  userFriendlyName: string;
  iconEmoji: string;
}

// ========================
// CONVERSION ACTIONS (Ações de Conversão)
// ========================
export const conversionActions: UserAction[] = [
  {
    type: 'purchase',
    icon: '🛒',
    iconEmoji: '🛒',
    label: 'Purchase',
    userFriendlyName: 'Purchase',
    color: '#10B981',
    category: 'conversion-actions',
    actionType: 'conversion',
    title: 'Purchase Action',
    description: 'Customer makes a purchase',
    defaultProps: {
      title: 'Purchase Completed',
      description: 'User completed a purchase transaction',
      status: 'active',
      properties: {
        amount: 0,
        currency: 'USD',
        product_id: ''
      }
    }
  },
  {
    type: 'form-completion',
    icon: '📝',
    iconEmoji: '📝',
    label: 'Form Comp...',
    userFriendlyName: 'Form Completion',
    color: '#3B82F6',
    category: 'conversion-actions',
    actionType: 'conversion',
    title: 'Form Completion',
    description: 'User fills out a form',
    defaultProps: {
      title: 'Form Submitted',
      description: 'User completed form submission',
      status: 'active',
      properties: {
        form_type: 'lead_capture',
        fields_count: 3
      }
    }
  },
  {
    type: 'schedule-meeting',
    icon: '📅',
    iconEmoji: '📅',
    label: 'Schedule M...',
    userFriendlyName: 'Schedule Meeting',
    color: '#8B5CF6',
    category: 'conversion-actions',
    actionType: 'conversion',
    title: 'Meeting Scheduled',
    description: 'User schedules a meeting or appointment',
    defaultProps: {
      title: 'Meeting Scheduled',
      description: 'User booked an appointment',
      status: 'active',
      properties: {
        duration: 30,
        meeting_type: 'consultation'
      }
    }
  },
  {
    type: 'deal-won',
    icon: '🏆',
    iconEmoji: '🏆',
    label: 'Deal Won',
    userFriendlyName: 'Deal Won',
    color: '#F59E0B',
    category: 'conversion-actions',
    actionType: 'conversion',
    title: 'Deal Won',
    description: 'Sales deal is closed successfully',
    defaultProps: {
      title: 'Deal Closed Won',
      description: 'Sales opportunity was won',
      status: 'active',
      properties: {
        deal_value: 0,
        close_probability: 100
      }
    }
  }
];

// ========================
// ENGAGEMENT ACTIONS (Ações de Engajamento)
// ========================
export const engagementActions: UserAction[] = [
  {
    type: 'watch-video',
    icon: '📺',
    iconEmoji: '📺',
    label: 'Watch Video',
    userFriendlyName: 'Watch Video',
    color: '#EF4444',
    category: 'engagement-actions',
    actionType: 'engagement',
    title: 'Video Watched',
    description: 'User watches a video',
    defaultProps: {
      title: 'Video Viewed',
      description: 'User watched video content',
      status: 'active',
      properties: {
        watch_duration: 0,
        video_length: 0,
        completion_rate: 0
      }
    }
  },
  {
    type: 'link-click',
    icon: '🔗',
    iconEmoji: '🔗',
    label: 'Link Click',
    userFriendlyName: 'Link Click',
    color: '#06B6D4',
    category: 'engagement-actions',
    actionType: 'engagement',
    title: 'Link Clicked',
    description: 'User clicks on a link',
    defaultProps: {
      title: 'Link Clicked',
      description: 'User clicked on a link',
      status: 'active',
      properties: {
        destination_url: '',
        link_text: ''
      }
    }
  },
  {
    type: 'scroll',
    icon: '📜',
    iconEmoji: '📜',
    label: 'Scroll',
    userFriendlyName: 'Scroll',
    color: '#84CC16',
    category: 'engagement-actions',
    actionType: 'engagement',
    title: 'Page Scroll',
    description: 'User scrolls through content',
    defaultProps: {
      title: 'Page Scrolled',
      description: 'User scrolled through the page',
      status: 'active',
      properties: {
        scroll_depth: 0,
        page_height: 0
      }
    }
  },
  {
    type: 'button-click',
    icon: '🔘',
    iconEmoji: '🔘',
    label: 'Button Click',
    userFriendlyName: 'Button Click',
    color: '#F97316',
    category: 'engagement-actions',
    actionType: 'engagement',
    title: 'Button Clicked',
    description: 'User clicks a button',
    defaultProps: {
      title: 'Button Clicked',
      description: 'User interacted with a button',
      status: 'active',
      properties: {
        button_text: '',
        button_type: 'primary'
      }
    }
  },
  {
    type: 'deal-status',
    icon: '📊',
    iconEmoji: '📊',
    label: 'Deal Status',
    userFriendlyName: 'Deal Status',
    color: '#6366F1',
    category: 'engagement-actions',
    actionType: 'engagement',
    title: 'Deal Status Update',
    description: 'Deal status is updated',
    defaultProps: {
      title: 'Deal Status Changed',
      description: 'Deal status was updated',
      status: 'active',
      properties: {
        previous_status: '',
        new_status: '',
        deal_stage: ''
      }
    }
  }
];

// ========================
// INTEGRATION ACTIONS (Ações de Integração)
// ========================
export const integrationActions: UserAction[] = [
  {
    type: 'ghl-appointment',
    icon: '📞',
    iconEmoji: '📞',
    label: 'GHL Appoi...',
    userFriendlyName: 'GHL Appointment',
    color: '#10B981',
    category: 'integration-actions',
    actionType: 'integration',
    title: 'GHL Appointment',
    description: 'GoHighLevel appointment booking',
    defaultProps: {
      title: 'GHL Appointment Booked',
      description: 'Appointment created in GoHighLevel',
      status: 'active',
      properties: {
        calendar_id: '',
        appointment_type: 'consultation'
      }
    }
  },
  {
    type: 'ghl-order',
    icon: '🛍️',
    iconEmoji: '🛍️',
    label: 'GHL Order',
    userFriendlyName: 'GHL Order',
    color: '#3B82F6',
    category: 'integration-actions',
    actionType: 'integration',
    title: 'GHL Order',
    description: 'GoHighLevel order creation',
    defaultProps: {
      title: 'GHL Order Created',
      description: 'Order created in GoHighLevel',
      status: 'active',
      properties: {
        order_id: '',
        total_amount: 0
      }
    }
  },
  {
    type: 'ghl-opportunity-orange',
    icon: '🔸',
    iconEmoji: '🔸',
    label: 'GHL Oppor...',
    userFriendlyName: 'GHL Opportunity',
    color: '#F97316',
    category: 'integration-actions',
    actionType: 'integration',
    title: 'GHL Opportunity (Orange)',
    description: 'GoHighLevel opportunity - Orange status',
    defaultProps: {
      title: 'GHL Opportunity (Orange)',
      description: 'Opportunity created in GoHighLevel',
      status: 'active',
      properties: {
        pipeline: '',
        stage: 'qualified',
        value: 0
      }
    }
  },
  {
    type: 'ghl-opportunity-green',
    icon: '🔹',
    iconEmoji: '🔹',
    label: 'GHL Oppor...',
    userFriendlyName: 'GHL Opportunity',
    color: '#10B981',
    category: 'integration-actions',
    actionType: 'integration',
    title: 'GHL Opportunity (Green)',
    description: 'GoHighLevel opportunity - Green status',
    defaultProps: {
      title: 'GHL Opportunity (Green)',
      description: 'Opportunity closed in GoHighLevel',
      status: 'active',
      properties: {
        pipeline: '',
        stage: 'closed_won',
        value: 0
      }
    }
  },
  {
    type: 'hubspot-deal',
    icon: '🤝',
    iconEmoji: '🤝',
    label: 'Hubspot Deal',
    userFriendlyName: 'Hubspot Deal',
    color: '#FF7A59',
    category: 'integration-actions',
    actionType: 'integration',
    title: 'Hubspot Deal',
    description: 'HubSpot deal creation',
    defaultProps: {
      title: 'HubSpot Deal Created',
      description: 'Deal created in HubSpot',
      status: 'active',
      properties: {
        deal_stage: '',
        amount: 0,
        close_date: ''
      }
    }
  },
  {
    type: 'hubspot-deal-status',
    icon: '✅',
    iconEmoji: '✅',
    label: 'Hubspot De...',
    userFriendlyName: 'Hubspot Deal Status',
    color: '#10B981',
    category: 'integration-actions',
    actionType: 'integration',
    title: 'Hubspot Deal Status',
    description: 'HubSpot deal status update - Green',
    defaultProps: {
      title: 'HubSpot Deal Updated',
      description: 'Deal status updated in HubSpot',
      status: 'active',
      properties: {
        previous_stage: '',
        new_stage: '',
        win_probability: 100
      }
    }
  }
];

// ========================
// CUSTOM ACTIONS (Ações Personalizadas)
// ========================
export const customActions: UserAction[] = [
  {
    type: 'add-to-list',
    icon: '📋',
    iconEmoji: '📋',
    label: 'Add To List',
    userFriendlyName: 'Add To List',
    color: '#8B5CF6',
    category: 'custom-actions',
    actionType: 'custom',
    title: 'Add To List',
    description: 'Add user to a specific list',
    defaultProps: {
      title: 'Added to List',
      description: 'User was added to a list',
      status: 'active',
      properties: {
        list_name: '',
        list_type: 'email'
      }
    }
  },
  {
    type: 'contact',
    icon: '👤',
    iconEmoji: '👤',
    label: 'Contact',
    userFriendlyName: 'Contact',
    color: '#06B6D4',
    category: 'custom-actions',
    actionType: 'custom',
    title: 'Contact Action',
    description: 'Contact or communication action',
    defaultProps: {
      title: 'Contact Created',
      description: 'New contact was created',
      status: 'active',
      properties: {
        contact_type: 'lead',
        source: ''
      }
    }
  },
  {
    type: 'request-content',
    icon: '📄',
    iconEmoji: '📄',
    label: 'Request Co...',
    userFriendlyName: 'Request Content',
    color: '#84CC16',
    category: 'custom-actions',
    actionType: 'custom',
    title: 'Request Content',
    description: 'User requests content or consultation',
    defaultProps: {
      title: 'Content Requested',
      description: 'User requested content or consultation',
      status: 'draft',
      properties: {
        content_type: '',
        request_details: ''
      }
    }
  },
  {
    type: 'request-info',
    icon: 'ℹ️',
    iconEmoji: 'ℹ️',
    label: 'Request Info',
    userFriendlyName: 'Request Info',
    color: '#3B82F6',
    category: 'custom-actions',
    actionType: 'custom',
    title: 'Request Information',
    description: 'User requests information',
    defaultProps: {
      title: 'Information Requested',
      description: 'User requested additional information',
      status: 'draft',
      properties: {
        info_type: '',
        urgency: 'normal'
      }
    }
  },
  {
    type: 'popup',
    icon: '🔔',
    iconEmoji: '🔔',
    label: 'Popup',
    userFriendlyName: 'Popup',
    color: '#F59E0B',
    category: 'custom-actions',
    actionType: 'custom',
    title: 'Popup Displayed',
    description: 'Popup or modal displayed to user',
    defaultProps: {
      title: 'Popup Shown',
      description: 'Popup was displayed to user',
      status: 'active',
      properties: {
        popup_type: 'info',
        trigger: 'time_based'
      }
    }
  },
  {
    type: 'add-to-cart',
    icon: '🛒',
    iconEmoji: '🛒',
    label: 'Add To Cart',
    userFriendlyName: 'Add To Cart',
    color: '#EF4444',
    category: 'custom-actions',
    actionType: 'custom',
    title: 'Add To Cart',
    description: 'Product added to shopping cart',
    defaultProps: {
      title: 'Product Added to Cart',
      description: 'Item was added to shopping cart',
      status: 'active',
      properties: {
        product_id: '',
        quantity: 1,
        price: 0
      }
    }
  },
  {
    type: 'add-tag',
    icon: '🏷️',
    iconEmoji: '🏷️',
    label: 'Add Tag',
    userFriendlyName: 'Add Tag',
    color: '#6366F1',
    category: 'custom-actions',
    actionType: 'custom',
    title: 'Add Tag',
    description: 'Tag added to user or record',
    defaultProps: {
      title: 'Tag Added',
      description: 'Tag was applied to user',
      status: 'active',
      properties: {
        tag_name: '',
        tag_category: ''
      }
    }
  }
];

// Organização das ações por seções
export const actionSections = {
  conversion: {
    title: 'Conversion Actions',
    subtitle: 'Ações de Conversão',
    icon: '🎯',
    color: '#10B981',
    actions: conversionActions
  },
  engagement: {
    title: 'Engagement Actions',
    subtitle: 'Ações de Engajamento',
    icon: '⚡',
    color: '#3B82F6',
    actions: engagementActions
  },
  integration: {
    title: 'Integration Actions',
    subtitle: 'Ações de Integração',
    icon: '🔗',
    color: '#8B5CF6',
    actions: integrationActions
  },
  custom: {
    title: 'Custom Actions',
    subtitle: 'Ações Personalizadas',
    icon: '⚙️',
    color: '#F59E0B',
    actions: customActions
  }
};

// Exportar todas as ações em um array único
export const allUserActions: UserAction[] = [
  ...conversionActions,
  ...engagementActions,
  ...integrationActions,
  ...customActions
];

export default allUserActions; 