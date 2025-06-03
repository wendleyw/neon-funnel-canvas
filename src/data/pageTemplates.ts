export interface PageTemplate {
  id: string;
  label: string;
  description: string;
  category: string;
  previewUrl: string;
  type: string;
  color: string;
  tags: string[];
}

export const pageTemplates: PageTemplate[] = [
  // Lead Capture Pages
  {
    id: 'generic-page',
    label: 'Generic Page',
    description: 'Basic landing page template',
    category: 'lead-capture',
    previewUrl: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=200&h=150&fit=crop&crop=top',
    type: 'landing-page',
    color: '#3B82F6',
    tags: ['basic', 'simple', 'generic']
  },
  {
    id: 'download-page',
    label: 'Download',
    description: 'Download page for digital products',
    category: 'lead-capture',
    previewUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=150&fit=crop&crop=top',
    type: 'download-page',
    color: '#10B981',
    tags: ['download', 'digital', 'product']
  },
  {
    id: 'opt-in',
    label: 'Opt In',
    description: 'Email signup and lead magnet page',
    category: 'lead-capture',
    previewUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop&crop=top',
    type: 'opt-in-page',
    color: '#8B5CF6',
    tags: ['email', 'signup', 'lead magnet']
  },
  {
    id: 'order-page',
    label: 'Order Page',
    description: 'Product order and checkout page',
    category: 'sales',
    previewUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=150&fit=crop&crop=top',
    type: 'order-page',
    color: '#EF4444',
    tags: ['order', 'checkout', 'purchase']
  },
  {
    id: 'sales-page',
    label: 'Sales Page',
    description: 'Long-form sales page',
    category: 'sales',
    previewUrl: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=200&h=150&fit=crop&crop=top',
    type: 'sales-page',
    color: '#DC2626',
    tags: ['sales', 'conversion', 'long-form']
  },
  {
    id: 'sales-page-short',
    label: 'Sales Page Short',
    description: 'Short-form sales page',
    category: 'sales',
    previewUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=200&h=150&fit=crop&crop=top',
    type: 'sales-page-short',
    color: '#F59E0B',
    tags: ['sales', 'short', 'concise']
  },
  {
    id: 'calendar',
    label: 'Calendar',
    description: 'Appointment booking calendar',
    category: 'booking',
    previewUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=150&fit=crop&crop=top',
    type: 'calendar-page',
    color: '#06B6D4',
    tags: ['calendar', 'booking', 'appointment']
  },

  // Engagement Pages
  {
    id: 'survey',
    label: 'Survey',
    description: 'Customer feedback survey',
    category: 'engagement',
    previewUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=200&h=150&fit=crop&crop=top',
    type: 'survey-page',
    color: '#8B5CF6',
    tags: ['survey', 'feedback', 'form']
  },
  {
    id: 'upsell-oto',
    label: 'Upsell OTO',
    description: 'One-time offer upsell page',
    category: 'sales',
    previewUrl: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=200&h=150&fit=crop&crop=top',
    type: 'upsell-page',
    color: '#F59E0B',
    tags: ['upsell', 'oto', 'offer']
  },
  {
    id: 'webinar-live',
    label: 'Webinar Live',
    description: 'Live webinar registration',
    category: 'webinar',
    previewUrl: 'https://images.unsplash.com/photo-1611403119860-57c4937ef987?w=200&h=150&fit=crop&crop=top',
    type: 'webinar-live',
    color: '#EF4444',
    tags: ['webinar', 'live', 'registration']
  },
  {
    id: 'webinar-replay',
    label: 'Webinar Replay',
    description: 'Webinar replay page',
    category: 'webinar',
    previewUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200&h=150&fit=crop&crop=top',
    type: 'webinar-replay',
    color: '#8B5CF6',
    tags: ['webinar', 'replay', 'recorded']
  },
  {
    id: 'blog-post',
    label: 'Blog Post',
    description: 'Blog article page',
    category: 'content',
    previewUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=150&fit=crop&crop=top',
    type: 'blog-page',
    color: '#6B7280',
    tags: ['blog', 'article', 'content']
  },
  {
    id: 'members-area',
    label: 'Members Area',
    description: 'Members-only content area',
    category: 'membership',
    previewUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=150&fit=crop&crop=top',
    type: 'members-page',
    color: '#059669',
    tags: ['members', 'exclusive', 'content']
  },
  {
    id: 'thank-you',
    label: 'Thank You',
    description: 'Thank you confirmation page',
    category: 'confirmation',
    previewUrl: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=200&h=150&fit=crop&crop=top',
    type: 'thank-you-page',
    color: '#10B981',
    tags: ['thank you', 'confirmation', 'success']
  },
  {
    id: 'popup',
    label: 'Popup',
    description: 'Modal popup or overlay',
    category: 'popup',
    previewUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=200&h=150&fit=crop&crop=top',
    type: 'popup-modal',
    color: '#7C3AED',
    tags: ['popup', 'modal', 'overlay']
  }
];

// Category metadata
export const PAGE_CATEGORIES = {
  'lead-capture': {
    label: 'Lead Capture',
    description: 'Pages for capturing leads',
    color: '#3B82F6',
    icon: '🎯'
  },
  'sales': {
    label: 'Sales',
    description: 'Sales and conversion pages',
    color: '#EF4444',
    icon: '💰'
  },
  'webinar': {
    label: 'Webinar',
    description: 'Webinar-related pages',
    color: '#8B5CF6',
    icon: '🎥'
  },
  'engagement': {
    label: 'Engagement',
    description: 'User engagement pages',
    color: '#10B981',
    icon: '💬'
  },
  'booking': {
    label: 'Booking',
    description: 'Appointment and booking pages',
    color: '#06B6D4',
    icon: '📅'
  },
  'content': {
    label: 'Content',
    description: 'Content and blog pages',
    color: '#6B7280',
    icon: '📝'
  },
  'membership': {
    label: 'Membership',
    description: 'Member-exclusive pages',
    color: '#059669',
    icon: '👥'
  },
  'confirmation': {
    label: 'Confirmation',
    description: 'Confirmation and thank you pages',
    color: '#10B981',
    icon: '✅'
  },
  'popup': {
    label: 'Popup',
    description: 'Modal and popup pages',
    color: '#7C3AED',
    icon: '📋'
  }
}; 