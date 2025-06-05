export interface MarketingCategory {
  key: string;
  label: string;
  icon: string;
  color: string;
  description?: string;
  count?: number;
}

export const MARKETING_CATEGORIES: MarketingCategory[] = [
  { 
    key: 'lead-capture', 
    label: 'Lead Capture', 
    icon: 'Zap', 
    color: '#3B82F6',
    description: 'Convert visitors into leads'
  },
  { 
    key: 'sales', 
    label: 'Sales Pages', 
    icon: 'TrendingUp', 
    color: '#10B981',
    description: 'Convert leads into customers'
  },
  { 
    key: 'booking', 
    label: 'Booking', 
    icon: 'Calendar', 
    color: '#F59E0B',
    description: 'Schedule appointments and calls'
  },
  { 
    key: 'social-media', 
    label: 'Social Media', 
    icon: 'Instagram', 
    color: '#E4405F',
    description: 'Social platform content'
  },
  { 
    key: 'engagement', 
    label: 'Engagement', 
    icon: 'Heart', 
    color: '#EC4899',
    description: 'Increase user interaction'
  },
  { 
    key: 'webinar', 
    label: 'Webinar', 
    icon: 'Video', 
    color: '#8B5CF6',
    description: 'Live and recorded presentations'
  },
  { 
    key: 'content', 
    label: 'Content', 
    icon: 'FileText', 
    color: '#06B6D4',
    description: 'Educational and informational'
  },
  { 
    key: 'membership', 
    label: 'Membership', 
    icon: 'Users', 
    color: '#84CC16',
    description: 'Exclusive member content'
  },
  { 
    key: 'confirmation', 
    label: 'Confirmation', 
    icon: 'CheckCircle', 
    color: '#22C55E',
    description: 'Success and thank you pages'
  },
  { 
    key: 'popup', 
    label: 'Popups', 
    icon: 'Square', 
    color: '#F97316',
    description: 'Overlay and modal content'
  },
  { 
    key: 'other-sources', 
    label: 'Other Sources', 
    icon: 'Package',
    color: '#6B7280',
    description: 'Miscellaneous or other sources'
  },
  // Add a generic 'Other Sources' category if needed by SourceForm, or ensure SourceForm handles it.
  // For now, keeping the original list from PagesTab.tsx
]; 