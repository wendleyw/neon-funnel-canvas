import { ComponentTemplate } from '../types/funnel';

export const MARKETING_COMPONENT_TEMPLATES: ComponentTemplate[] = [
  // ========================
  // PAID TRAFFIC SOURCES
  // ========================
  {
    type: 'facebook-ads',
    icon: 'Facebook',
    label: 'Facebook Ads',
    color: '#1877F2',
    category: 'traffic-sources-paid',
    title: 'Facebook Advertising',
    description: 'Facebook ad campaigns',
    defaultProps: {
      title: 'Facebook Ads Campaign',
      description: 'Targeted advertising on Facebook',
      status: 'draft',
      properties: {
        budget_daily: 50,
        target_audience: 'lookalike'
      }
    }
  },
  
  {
    type: 'instagram-ads',
    icon: 'Instagram',
    label: 'Instagram Ads',
    color: '#E4405F',
    category: 'traffic-sources-paid',
    title: 'Instagram Advertising',
    description: 'Instagram ad campaigns',
    defaultProps: {
      title: 'Instagram Ads Campaign',
      description: 'Visual advertising on Instagram',
      status: 'draft',
      properties: {
        budget_daily: 40,
        ad_format: 'stories_feed'
      }
    }
  },

  {
    type: 'google-ads',
    icon: 'Search',
    label: 'Google Ads',
    color: '#4285F4',
    category: 'traffic-sources-paid',
    title: 'Google Advertising',
    description: 'Google search & display ads',
    defaultProps: {
      title: 'Google Ads Campaign',
      description: 'Search and display advertising',
      status: 'draft',
      properties: {
        campaign_type: 'search',
        quality_score: 8
      }
    }
  },

  {
    type: 'bing-ads',
    icon: 'Search',
    label: 'Bing Ads',
    color: '#F25022',
    category: 'traffic-sources-paid',
    title: 'Bing Advertising',
    description: 'Microsoft Bing ad campaigns',
    defaultProps: {
      title: 'Bing Ads Campaign',
      description: 'Microsoft search advertising',
      status: 'draft',
      properties: {
        budget_daily: 30,
        quality_score: 7
      }
    }
  },

  {
    type: 'youtube-ads',
    icon: 'Video',
    label: 'YouTube Ads',
    color: '#FF0000',
    category: 'traffic-sources-paid',
    title: 'YouTube Advertising',
    description: 'YouTube video advertising',
    defaultProps: {
      title: 'YouTube Ads Campaign',
      description: 'Video advertising on YouTube',
      status: 'draft',
      properties: {
        budget_daily: 60,
        ad_format: 'video'
      }
    }
  },

  {
    type: 'linkedin-ads',
    icon: 'Linkedin',
    label: 'LinkedIn Ads',
    color: '#0077B5',
    category: 'traffic-sources-paid',
    title: 'LinkedIn Advertising',
    description: 'Professional B2B advertising',
    defaultProps: {
      title: 'LinkedIn Ads Campaign',
      description: 'Professional B2B advertising',
      status: 'draft',
      properties: {
        budget_daily: 80,
        target_type: 'b2b'
      }
    }
  },

  {
    type: 'tiktok-ads',
    icon: 'Music',
    label: 'TikTok Ads',
    color: '#000000',
    category: 'traffic-sources-paid',
    title: 'TikTok Advertising',
    description: 'TikTok video advertising',
    defaultProps: {
      title: 'TikTok Ads Campaign',
      description: 'Short-form video advertising',
      status: 'draft',
      properties: {
        budget_daily: 35,
        ad_format: 'video'
      }
    }
  },

  {
    type: 'twitter-ads',
    icon: 'Twitter',
    label: 'X Ads',
    color: '#000000',
    category: 'traffic-sources-paid',
    title: 'X/Twitter Advertising',
    description: 'X (Twitter) advertising campaigns',
    defaultProps: {
      title: 'X Ads Campaign',
      description: 'Social media advertising on X',
      status: 'draft',
      properties: {
        budget_daily: 30,
        campaign_objective: 'engagement'
      }
    }
  },

  {
    type: 'pinterest-ads',
    icon: 'Pin',
    label: 'Pinterest Ads',
    color: '#BD081C',
    category: 'traffic-sources-paid',
    title: 'Pinterest Advertising',
    description: 'Pinterest visual advertising',
    defaultProps: {
      title: 'Pinterest Ads Campaign',
      description: 'Visual discovery advertising',
      status: 'draft',
      properties: {
        budget_daily: 25,
        ad_format: 'pin'
      }
    }
  },

  {
    type: 'snapchat-ads',
    icon: 'Camera',
    label: 'Snapchat Ads',
    color: '#FFFC00',
    category: 'traffic-sources-paid',
    title: 'Snapchat Advertising',
    description: 'Snapchat ad campaigns',
    defaultProps: {
      title: 'Snapchat Ads Campaign',
      description: 'AR and visual advertising on Snapchat',
      status: 'draft',
      properties: {
        budget_daily: 45,
        target_age: '18-34'
      }
    }
  },

  {
    type: 'reddit-ads',
    icon: 'MessageSquare',
    label: 'Reddit Ads',
    color: '#FF4500',
    category: 'traffic-sources-paid',
    title: 'Reddit Advertising',
    description: 'Reddit promoted posts and advertising',
    defaultProps: {
      title: 'Reddit Ads Campaign',
      description: 'Community-targeted advertising',
      status: 'draft',
      properties: {
        budget_daily: 35,
        targeting: 'subreddit'
      }
    }
  },

  // ========================
  // SEARCH TRAFFIC SOURCES
  // ========================
  {
    type: 'google-organic',
    icon: 'Globe',
    label: 'Google',
    color: '#4285F4',
    category: 'traffic-sources-search',
    title: 'Google Organic',
    description: 'Google organic search traffic',
    defaultProps: {
      title: 'Google Organic Search',
      description: 'Natural search traffic from Google',
      status: 'active',
      properties: {
        search_volume: 'high',
        ranking_keywords: 25
      }
    }
  },

  {
    type: 'bing-organic',
    icon: 'Search',
    label: 'Bing',
    color: '#F25022',
    category: 'traffic-sources-search',
    title: 'Bing Organic',
    description: 'Bing organic search traffic',
    defaultProps: {
      title: 'Bing Organic Search',
      description: 'Natural search traffic from Bing',
      status: 'active',
      properties: {
        search_volume: 'medium',
        ranking_keywords: 15
      }
    }
  },

  {
    type: 'youtube-organic',
    icon: 'Video',
    label: 'YouTube',
    color: '#FF0000',
    category: 'traffic-sources-search',
    title: 'YouTube Organic',
    description: 'YouTube organic search traffic',
    defaultProps: {
      title: 'YouTube Organic',
      description: 'Video search traffic from YouTube',
      status: 'active',
      properties: {
        video_views: 5000,
        subscriber_growth: 120
      }
    }
  },

  {
    type: 'all-search',
    icon: 'Search',
    label: 'All Search',
    color: '#6B7280',
    category: 'traffic-sources-search',
    title: 'All Search Engines',
    description: 'Combined search engine traffic',
    defaultProps: {
      title: 'All Search Traffic',
      description: 'Combined organic search traffic',
      status: 'active',
      properties: {
        total_searches: 8500,
        avg_position: 12
      }
    }
  },

  // ========================
  // SOCIAL TRAFFIC SOURCES
  // ========================
  {
    type: 'facebook-organic',
    icon: 'Facebook',
    label: 'Facebook Organic',
    color: '#1877F2',
    category: 'traffic-sources-social',
    title: 'Facebook Organic',
    description: 'Organic Facebook posts and engagement',
    defaultProps: {
      title: 'Facebook Organic',
      description: 'Organic social media traffic',
      status: 'active',
      properties: {
        followers: 2500,
        engagement_rate: 3.2
      }
    }
  },

  {
    type: 'instagram-organic',
    icon: 'Instagram',
    label: 'Instagram Organic',
    color: '#E4405F',
    category: 'traffic-sources-social',
    title: 'Instagram Organic',
    description: 'Organic Instagram posts and stories',
    defaultProps: {
      title: 'Instagram Organic',
      description: 'Organic visual content traffic',
      status: 'active',
      properties: {
        followers: 3200,
        engagement_rate: 4.1
      }
    }
  },

  {
    type: 'pinterest-organic',
    icon: 'Pin',
    label: 'Pinterest Organic',
    color: '#BD081C',
    category: 'traffic-sources-social',
    title: 'Pinterest Organic',
    description: 'Organic Pinterest pins and boards',
    defaultProps: {
      title: 'Pinterest Organic',
      description: 'Visual discovery traffic',
      status: 'active',
      properties: {
        monthly_views: 15000,
        saves: 450
      }
    }
  },

  {
    type: 'reddit-organic',
    icon: 'MessageSquare',
    label: 'Reddit',
    color: '#FF4500',
    category: 'traffic-sources-social',
    title: 'Reddit Organic',
    description: 'Community-driven marketing on Reddit',
    defaultProps: {
      title: 'Reddit Community',
      description: 'Organic community engagement',
      status: 'active',
      properties: {
        subreddits: 8,
        karma_score: 2500
      }
    }
  },

  {
    type: 'linkedin-organic',
    icon: 'Linkedin',
    label: 'LinkedIn Organic',
    color: '#0077B5',
    category: 'traffic-sources-social',
    title: 'LinkedIn Organic',
    description: 'Professional organic content on LinkedIn',
    defaultProps: {
      title: 'LinkedIn Organic',
      description: 'Professional networking traffic',
      status: 'active',
      properties: {
        connections: 1200,
        post_views: 3500
      }
    }
  },

  {
    type: 'tiktok-organic',
    icon: 'Music',
    label: 'TikTok Organic',
    color: '#000000',
    category: 'traffic-sources-social',
    title: 'TikTok Organic',
    description: 'Organic TikTok videos and trends',
    defaultProps: {
      title: 'TikTok Organic',
      description: 'Short-form video content',
      status: 'active',
      properties: {
        followers: 4500,
        avg_views: 12000
      }
    }
  },

  {
    type: 'x-organic',
    icon: 'Twitter',
    label: 'X Organic',
    color: '#000000',
    category: 'traffic-sources-social',
    title: 'X Organic',
    description: 'Organic posts and engagement on X',
    defaultProps: {
      title: 'X Organic',
      description: 'Social conversation traffic',
      status: 'active',
      properties: {
        followers: 1800,
        engagement_rate: 2.8
      }
    }
  },

  // ========================
  // MESSAGING SOURCES
  // ========================
  {
    type: 'whatsapp-business',
    icon: 'MessageCircle',
    label: 'WhatsApp',
    color: '#25D366',
    category: 'traffic-sources-messaging',
    title: 'WhatsApp Business',
    description: 'WhatsApp Business messaging',
    defaultProps: {
      title: 'WhatsApp Campaign',
      description: 'Direct messaging and business catalog',
      status: 'active',
      properties: {
        contacts: 2000,
        message_rate: 85
      }
    }
  },

  {
    type: 'telegram-marketing',
    icon: 'Send',
    label: 'Telegram',
    color: '#0088CC',
    category: 'traffic-sources-messaging',
    title: 'Telegram Marketing',
    description: 'Telegram channels and groups',
    defaultProps: {
      title: 'Telegram Channel',
      description: 'Community and broadcast messaging',
      status: 'active',
      properties: {
        subscribers: 5000,
        engagement_rate: 12
      }
    }
  },

  {
    type: 'facebook-messenger',
    icon: 'MessageCircle',
    label: 'Messenger',
    color: '#0084FF',
    category: 'traffic-sources-messaging',
    title: 'Facebook Messenger',
    description: 'Facebook Messenger marketing',
    defaultProps: {
      title: 'Messenger Campaign',
      description: 'Chatbot and direct messaging',
      status: 'active',
      properties: {
        subscribers: 1500,
        open_rate: 90
      }
    }
  },

  {
    type: 'slack-marketing',
    icon: 'Hash',
    label: 'Slack',
    color: '#4A154B',
    category: 'traffic-sources-messaging',
    title: 'Slack Marketing',
    description: 'Slack community and workspace marketing',
    defaultProps: {
      title: 'Slack Community',
      description: 'Professional community engagement',
      status: 'active',
      properties: {
        workspace_members: 800,
        active_channels: 15
      }
    }
  },

  {
    type: 'sms-marketing',
    icon: 'MessageSquare',
    label: 'SMS',
    color: '#E91E63',
    category: 'traffic-sources-messaging',
    title: 'SMS Marketing',
    description: 'Text message marketing campaigns',
    defaultProps: {
      title: 'SMS Campaign',
      description: 'Direct text messaging',
      status: 'active',
      properties: {
        subscribers: 3000,
        open_rate: 98
      }
    }
  },

  {
    type: 'chatbot-marketing',
    icon: 'Bot',
    label: 'Chatbot',
    color: '#3F51B5',
    category: 'traffic-sources-messaging',
    title: 'Chatbot Marketing',
    description: 'Automated chatbot interactions',
    defaultProps: {
      title: 'Chatbot Campaign',
      description: 'Automated customer interactions',
      status: 'active',
      properties: {
        conversations: 500,
        conversion_rate: 15
      }
    }
  },

  // ========================
  // OTHER SOURCES
  // ========================
  {
    type: 'email-marketing',
    icon: 'Mail',
    label: 'Email',
    color: '#EF4444',
    category: 'traffic-sources-other',
    title: 'Email Marketing',
    description: 'Email campaign traffic',
    defaultProps: {
      title: 'Email Campaign',
      description: 'Traffic from email marketing',
      status: 'active',
      properties: {
        list_size: 5000,
        open_rate: 25
      }
    }
  },

  {
    type: 'direct-traffic',
    icon: 'MousePointer',
    label: 'Direct',
    color: '#374151',
    category: 'traffic-sources-other',
    title: 'Direct Traffic',
    description: 'Direct website visits',
    defaultProps: {
      title: 'Direct Traffic',
      description: 'Users typing URL directly',
      status: 'active',
      properties: {
        monthly_visits: 2500,
        bounce_rate: 45
      }
    }
  },

  {
    type: 'affiliate-marketing',
    icon: 'Users',
    label: 'Affiliates',
    color: '#8B5CF6',
    category: 'traffic-sources-other',
    title: 'Affiliate Marketing',
    description: 'Traffic from affiliate partners',
    defaultProps: {
      title: 'Affiliate Program',
      description: 'Partner-driven traffic',
      status: 'active',
      properties: {
        commission_rate: 15,
        active_affiliates: 25
      }
    }
  },

  // ========================
  // OFFLINE SOURCES
  // ========================
  {
    type: 'job-interview',
    icon: 'Users',
    label: 'Job Interview',
    color: '#3B82F6',
    category: 'traffic-sources-offline',
    title: 'Job Interview',
    description: 'Networking through job interviews',
    defaultProps: {
      title: 'Job Interview Campaign',
      description: 'Professional networking opportunities',
      status: 'active',
      properties: {
        interviews_monthly: 8,
        conversion_rate: 25
      }
    }
  },

  {
    type: 'print-advertising',
    icon: 'Newspaper',
    label: 'Print Ad',
    color: '#6B7280',
    category: 'traffic-sources-offline',
    title: 'Print Advertising',
    description: 'Newspaper and magazine ads',
    defaultProps: {
      title: 'Print Campaign',
      description: 'Traditional print advertising',
      status: 'active',
      properties: {
        circulation: 50000,
        ad_size: 'half_page'
      }
    }
  },

  {
    type: 'event-marketing',
    icon: 'Calendar',
    label: 'Conference',
    color: '#8B5CF6',
    category: 'traffic-sources-offline',
    title: 'Event Marketing',
    description: 'Conference and event marketing',
    defaultProps: {
      title: 'Event Campaign',
      description: 'Live event marketing',
      status: 'active',
      properties: {
        attendees: 500,
        booth_size: 'standard'
      }
    }
  },

  {
    type: 'online-meeting',
    icon: 'Monitor',
    label: 'Online Meeting',
    color: '#059669',
    category: 'traffic-sources-offline',
    title: 'Online Meeting',
    description: 'Virtual meetings and presentations',
    defaultProps: {
      title: 'Online Meeting Campaign',
      description: 'Virtual networking and presentations',
      status: 'active',
      properties: {
        meetings_weekly: 12,
        avg_attendees: 25
      }
    }
  },

  {
    type: 'banner-advertising',
    icon: 'Square',
    label: 'Banner',
    color: '#F59E0B',
    category: 'traffic-sources-offline',
    title: 'Banner Advertising',
    description: 'Physical banner advertisements',
    defaultProps: {
      title: 'Banner Campaign',
      description: 'Physical banner displays',
      status: 'active',
      properties: {
        locations: 15,
        impressions_daily: 5000
      }
    }
  },

  {
    type: 'direct-mail',
    icon: 'Mail',
    label: 'Direct Mail',
    color: '#DC2626',
    category: 'traffic-sources-offline',
    title: 'Direct Mail',
    description: 'Physical direct mail campaigns',
    defaultProps: {
      title: 'Direct Mail Campaign',
      description: 'Targeted postal marketing',
      status: 'active',
      properties: {
        pieces_sent: 2500,
        response_rate: 3.2
      }
    }
  },

  {
    type: 'tv-advertising',
    icon: 'Monitor',
    label: 'TV Ad',
    color: '#3B82F6',
    category: 'traffic-sources-offline',
    title: 'TV Advertising',
    description: 'Television commercial campaigns',
    defaultProps: {
      title: 'TV Campaign',
      description: 'Television advertising',
      status: 'active',
      properties: {
        viewers: 200000,
        commercial_length: 30
      }
    }
  },

  {
    type: 'biz-directory',
    icon: 'Building',
    label: 'Biz Directory',
    color: '#6366F1',
    category: 'traffic-sources-offline',
    title: 'Business Directory',
    description: 'Business directory listings',
    defaultProps: {
      title: 'Business Directory',
      description: 'Professional directory listings',
      status: 'active',
      properties: {
        directories: 25,
        monthly_leads: 45
      }
    }
  },

  {
    type: 'workshop-seminar',
    icon: 'GraduationCap',
    label: 'Workshop',
    color: '#8B5CF6',
    category: 'traffic-sources-offline',
    title: 'Workshop & Seminar',
    description: 'Educational workshops and seminars',
    defaultProps: {
      title: 'Workshop Campaign',
      description: 'Educational events and training',
      status: 'active',
      properties: {
        events_quarterly: 6,
        attendees: 150
      }
    }
  },

  {
    type: 'radio-advertising',
    icon: 'Radio',
    label: 'Radio',
    color: '#F97316',
    category: 'traffic-sources-offline',
    title: 'Radio Advertising',
    description: 'Radio commercial campaigns',
    defaultProps: {
      title: 'Radio Campaign',
      description: 'Audio advertising',
      status: 'active',
      properties: {
        listeners: 75000,
        spot_duration: 30
      }
    }
  },

  {
    type: 'guest-blog',
    icon: 'FileText',
    label: 'Guest Blog',
    color: '#10B981',
    category: 'traffic-sources-offline',
    title: 'Guest Blog',
    description: 'Guest blogging opportunities',
    defaultProps: {
      title: 'Guest Blog Campaign',
      description: 'Guest content and thought leadership',
      status: 'active',
      properties: {
        posts_monthly: 4,
        avg_traffic: 850
      }
    }
  },

  {
    type: 'job-site',
    icon: 'Briefcase',
    label: 'Job Site',
    color: '#3B82F6',
    category: 'traffic-sources-offline',
    title: 'Job Site',
    description: 'Job board and career site listings',
    defaultProps: {
      title: 'Job Site Campaign',
      description: 'Recruitment and career marketing',
      status: 'active',
      properties: {
        job_posts: 15,
        applications: 125
      }
    }
  },

  {
    type: 'meeting-networking',
    icon: 'Handshake',
    label: 'Meeting',
    color: '#6B7280',
    category: 'traffic-sources-offline',
    title: 'Networking Meeting',
    description: 'Business networking meetings',
    defaultProps: {
      title: 'Networking Campaign',
      description: 'Professional networking events',
      status: 'active',
      properties: {
        meetings_monthly: 8,
        contacts_made: 45
      }
    }
  },

  {
    type: 'billboard-advertising',
    icon: 'Square',
    label: 'Billboard',
    color: '#FBBF24',
    category: 'traffic-sources-offline',
    title: 'Billboard Advertising',
    description: 'Outdoor billboard campaigns',
    defaultProps: {
      title: 'Billboard Campaign',
      description: 'Outdoor advertising',
      status: 'active',
      properties: {
        daily_impressions: 25000,
        location: 'highway'
      }
    }
  },

  {
    type: 'business-card',
    icon: 'CreditCard',
    label: 'Business Card',
    color: '#6B7280',
    category: 'traffic-sources-offline',
    title: 'Business Card',
    description: 'Business card networking',
    defaultProps: {
      title: 'Business Card Campaign',
      description: 'Traditional business card distribution',
      status: 'active',
      properties: {
        cards_distributed: 500,
        follow_ups: 25
      }
    }
  },

  {
    type: 'career-site',
    icon: 'Building',
    label: 'Career Site',
    color: '#059669',
    category: 'traffic-sources-offline',
    title: 'Career Site',
    description: 'Corporate career page traffic',
    defaultProps: {
      title: 'Career Site Campaign',
      description: 'Employee recruitment marketing',
      status: 'active',
      properties: {
        monthly_visitors: 1200,
        applications: 85
      }
    }
  },

  {
    type: 'phone-marketing',
    icon: 'Phone',
    label: 'Phone',
    color: '#3B82F6',
    category: 'traffic-sources-offline',
    title: 'Phone Marketing',
    description: 'Telephone marketing campaigns',
    defaultProps: {
      title: 'Phone Campaign',
      description: 'Direct phone marketing',
      status: 'active',
      properties: {
        call_list: 1000,
        conversion_rate: 5
      }
    }
  },

  {
    type: 'report-marketing',
    icon: 'FileBarChart',
    label: 'Report',
    color: '#8B5CF6',
    category: 'traffic-sources-offline',
    title: 'Report Marketing',
    description: 'Industry reports and whitepapers',
    defaultProps: {
      title: 'Report Campaign',
      description: 'Research reports and industry insights',
      status: 'active',
      properties: {
        downloads: 350,
        leads_generated: 85
      }
    }
  },

  {
    type: 'qr-code',
    icon: 'QrCode',
    label: 'QR Code',
    color: '#000000',
    category: 'traffic-sources-offline',
    title: 'QR Code Marketing',
    description: 'QR code campaigns',
    defaultProps: {
      title: 'QR Code Campaign',
      description: 'Bridge between offline and digital',
      status: 'active',
      properties: {
        scans: 450,
        conversion_rate: 12
      }
    }
  },

  // ========================
  // CRM SOURCES
  // ========================
  {
    type: 'ontraport-crm',
    icon: 'Database',
    label: 'Ontraport',
    color: '#FF6B35',
    category: 'traffic-sources-crm',
    title: 'Ontraport CRM',
    description: 'Ontraport CRM integration',
    defaultProps: {
      title: 'Ontraport Integration',
      description: 'All-in-one business automation',
      status: 'active',
      properties: {
        contacts: 5000,
        automation_sequences: 15
      }
    }
  },

  {
    type: 'keap-crm',
    icon: 'TrendingUp',
    label: 'Keap',
    color: '#2ECC40',
    category: 'traffic-sources-crm',
    title: 'Keap CRM',
    description: 'Keap (formerly Infusionsoft) CRM',
    defaultProps: {
      title: 'Keap Integration',
      description: 'Small business CRM and automation',
      status: 'active',
      properties: {
        contacts: 7500,
        sales_pipeline: 35000
      }
    }
  },

  {
    type: 'hubspot-crm',
    icon: 'Database',
    label: 'HubSpot',
    color: '#FF7A59',
    category: 'traffic-sources-crm',
    title: 'HubSpot CRM',
    description: 'HubSpot CRM integration',
    defaultProps: {
      title: 'HubSpot Integration',
      description: 'CRM-driven traffic and leads',
      status: 'active',
      properties: {
        contacts: 10000,
        pipeline_value: 50000
      }
    }
  },

  {
    type: 'salesforce-crm',
    icon: 'Cloud',
    label: 'Salesforce',
    color: '#00A1E0',
    category: 'traffic-sources-crm',
    title: 'Salesforce CRM',
    description: 'Salesforce CRM integration',
    defaultProps: {
      title: 'Salesforce Integration',
      description: 'Enterprise CRM traffic',
      status: 'active',
      properties: {
        opportunities: 250,
        forecast_accuracy: 85
      }
    }
  },

  {
    type: 'pipedrive-crm',
    icon: 'TrendingUp',
    label: 'Pipedrive',
    color: '#2ECC40',
    category: 'traffic-sources-crm',
    title: 'Pipedrive CRM',
    description: 'Pipedrive CRM integration',
    defaultProps: {
      title: 'Pipedrive Integration',
      description: 'Sales pipeline traffic',
      status: 'active',
      properties: {
        deals: 150,
        win_rate: 25
      }
    }
  },

  {
    type: 'mailchimp-crm',
    icon: 'Mail',
    label: 'Mailchimp',
    color: '#FFE01B',
    category: 'traffic-sources-crm',
    title: 'Mailchimp Integration',
    description: 'Mailchimp email automation',
    defaultProps: {
      title: 'Mailchimp Campaign',
      description: 'Email automation traffic',
      status: 'active',
      properties: {
        subscribers: 8000,
        automation_rate: 15
      }
    }
  },

  {
    type: 'intercom-crm',
    icon: 'MessageSquare',
    label: 'Intercom',
    color: '#1F8DED',
    category: 'traffic-sources-crm',
    title: 'Intercom CRM',
    description: 'Intercom customer messaging',
    defaultProps: {
      title: 'Intercom Integration',
      description: 'Customer messaging and support',
      status: 'active',
      properties: {
        conversations: 1200,
        resolution_time: 45
      }
    }
  },

  {
    type: 'marketo-crm',
    icon: 'Target',
    label: 'Marketo',
    color: '#5C4C9F',
    category: 'traffic-sources-crm',
    title: 'Marketo CRM',
    description: 'Adobe Marketo automation',
    defaultProps: {
      title: 'Marketo Integration',
      description: 'Enterprise marketing automation',
      status: 'active',
      properties: {
        leads: 15000,
        programs: 25
      }
    }
  },

  {
    type: 'constant-contact-crm',
    icon: 'Mail',
    label: 'Constant Contact',
    color: '#1582C4',
    category: 'traffic-sources-crm',
    title: 'Constant Contact',
    description: 'Email marketing and automation',
    defaultProps: {
      title: 'Constant Contact Campaign',
      description: 'Email marketing platform',
      status: 'active',
      properties: {
        subscribers: 6000,
        open_rate: 22
      }
    }
  },

  {
    type: 'activecampaign-crm',
    icon: 'Zap',
    label: 'Active Campaign',
    color: '#356AE6',
    category: 'traffic-sources-crm',
    title: 'ActiveCampaign CRM',
    description: 'Customer experience automation',
    defaultProps: {
      title: 'ActiveCampaign Integration',
      description: 'Advanced email automation',
      status: 'active',
      properties: {
        contacts: 12000,
        automations: 45
      }
    }
  },

  {
    type: 'drip-crm',
    icon: 'Droplets',
    label: 'Drip',
    color: '#EA4C89',
    category: 'traffic-sources-crm',
    title: 'Drip CRM',
    description: 'E-commerce CRM and automation',
    defaultProps: {
      title: 'Drip Integration',
      description: 'E-commerce focused automation',
      status: 'active',
      properties: {
        subscribers: 8500,
        revenue_per_email: 0.45
      }
    }
  },

  // ========================
  // WEBINAR & CONTENT SOURCES
  // ========================
  {
    type: 'webinar-traffic',
    icon: 'MonitorPlay',
    label: 'Webinar',
    color: '#8B5CF6',
    category: 'traffic-sources-content',
    title: 'Webinar Traffic',
    description: 'Webinar registrations and events',
    defaultProps: {
      title: 'Webinar Series',
      description: 'Educational webinars and virtual events',
      status: 'active',
      properties: {
        attendees: 150,
        conversion_rate: 8
      }
    }
  },

  {
    type: 'podcast-marketing',
    icon: 'Mic',
    label: 'Podcast',
    color: '#6B46C1',
    category: 'traffic-sources-content',
    title: 'Podcast Marketing',
    description: 'Podcast-driven traffic',
    defaultProps: {
      title: 'Podcast Strategy',
      description: 'Traffic from podcast appearances',
      status: 'active',
      properties: {
        episodes_monthly: 4,
        avg_downloads: 1500
      }
    }
  },

  {
    type: 'content-marketing',
    icon: 'FileText',
    label: 'Content',
    color: '#10B981',
    category: 'traffic-sources-content',
    title: 'Content Marketing',
    description: 'Blog and content-driven traffic',
    defaultProps: {
      title: 'Content Strategy',
      description: 'Traffic from valuable content',
      status: 'active',
      properties: {
        monthly_posts: 8,
        avg_traffic: 2500
      }
    }
  },

  {
    type: 'influencer-marketing',
    icon: 'Star',
    label: 'Influencer',
    color: '#F59E0B',
    category: 'traffic-sources-content',
    title: 'Influencer Marketing',
    description: 'Influencer collaboration traffic',
    defaultProps: {
      title: 'Influencer Campaign',
      description: 'Traffic from influencer partnerships',
      status: 'draft',
      properties: {
        influencer_count: 3,
        reach: 50000
      }
    }
  },

  {
    type: 'referral-traffic',
    icon: 'Link',
    label: 'Referral',
    color: '#6366F1',
    category: 'traffic-sources-content',
    title: 'Referral Traffic',
    description: 'Traffic from external websites',
    defaultProps: {
      title: 'Referral Sources',
      description: 'Traffic from partner websites',
      status: 'active',
      properties: {
        referring_domains: 15,
        monthly_referrals: 800
      }
    }
  },

  // ========================
  // CAPTURA DE LEADS (ESSENCIAIS)
  // ========================
  {
    type: 'landing-page',
    icon: '🎯',
    label: 'Landing Page',
    color: '#3B82F6',
    category: 'lead-capture',
    title: 'Landing Page',
    description: 'High-converting landing page',
    defaultProps: {
      title: 'Landing Page',
      description: 'Focused page for conversions',
      status: 'draft',
      properties: {
        conversion_goal: 'lead_capture'
      }
    }
  },

  {
    type: 'lead-magnet',
    icon: '🧲',
    label: 'Lead Magnet',
    color: '#10B981',
    category: 'lead-capture',
    title: 'Lead Magnet',
    description: 'Free content for leads',
    defaultProps: {
      title: 'Lead Magnet',
      description: 'Valuable free content',
      status: 'draft',
      properties: {
        magnet_type: 'ebook'
      }
    }
  },

  {
    type: 'webinar',
    icon: '🎥',
    label: 'Webinar',
    color: '#8B5CF6',
    category: 'lead-capture',
    title: 'Webinar',
    description: 'Educational webinar',
    defaultProps: {
      title: 'Webinar',
      description: 'Live educational session',
      status: 'draft',
      properties: {
        duration_minutes: 60
      }
    }
  },

  // ========================
  // NUTRIÇÃO (ESSENCIAIS)
  // ========================
  {
    type: 'email-sequence',
    icon: '📧',
    label: 'Email Sequence',
    color: '#EF4444',
    category: 'nurturing',
    title: 'Email Sequence',
    description: 'Automated email series',
    defaultProps: {
      title: 'Email Sequence',
      description: 'Automated nurturing emails',
      status: 'draft',
      properties: {
        email_count: 7
      }
    }
  },

  // ========================
  // VENDAS (ESSENCIAIS)
  // ========================
  {
    type: 'sales-page',
    icon: '📈',
    label: 'Sales Page',
    color: '#DC2626',
    category: 'sales-conversion',
    title: 'Sales Page',
    description: 'High-converting sales page',
    defaultProps: {
      title: 'Sales Page',
      description: 'Detailed sales page',
      status: 'draft',
      properties: {
        price_point: 'mid_ticket'
      }
    }
  },

  {
    type: 'checkout',
    icon: '🛒',
    label: 'Checkout',
    color: '#059669',
    category: 'sales-conversion',
    title: 'Checkout',
    description: 'Checkout process',
    defaultProps: {
      title: 'Checkout',
      description: 'Payment process',
      status: 'draft',
      properties: {
        checkout_type: 'one_page'
      }
    }
  },

  // ========================
  // FASE 2: DIAGRAMAS (MÍNIMOS)
  // ========================
  {
    type: 'funnel-stage',
    icon: '🎯',
    label: 'Funnel Stage',
    color: '#3B82F6',
    category: 'funnel-diagrams',
    diagramType: 'marketing-funnel',
    title: 'Funnel Stage',
    description: 'Stage with metrics',
    defaultProps: {
      title: 'Awareness Stage',
      description: 'Top of funnel stage',
      status: 'active',
      metrics: {
        visitors: 10000,
        conversions: 1000,
        conversionRate: 10
      },
      properties: {
        stage_type: 'awareness'
      }
    }
  },

  {
    type: 'journey-stage',
    icon: '🗺️',
    label: 'Journey Stage',
    color: '#8B5CF6',
    category: 'journey-maps',
    diagramType: 'customer-journey',
    title: 'Journey Stage',
    description: 'Customer journey stage',
    defaultProps: {
      title: 'Awareness',
      description: 'Customer becomes aware',
      status: 'active',
      journey: {
        stage: 'awareness',
        emotion: 'neutral',
        intensity: 3
      },
      properties: {
        duration: '1-2 weeks'
      }
    }
  },

  {
    type: 'flow-process',
    icon: '⚙️',
    label: 'Process Step',
    color: '#3B82F6',
    category: 'process-flows',
    diagramType: 'process-flow',
    title: 'Process Step',
    description: 'Process action step',
    defaultProps: {
      title: 'Process Data',
      description: 'Process and validate data',
      status: 'active',
      process: {
        flowType: 'process',
        responsible: 'system'
      },
      properties: {
        automation_level: 'automated'
      }
    }
  },

  // ========================
  // SOCIAL MEDIA (NOVO)
  // ========================
  {
    type: 'instagram-grid',
    icon: '📱',
    label: 'Instagram Grid',
    color: '#E4405F',
    category: 'social-media',
    title: 'Instagram Grid',
    description: 'Preview and manage your Instagram posts before publishing',
    defaultProps: {
      title: 'Instagram Grid',
      description: 'Visual content planner for Instagram',
      status: 'active',
      properties: {
        posts_count: 9,
        engagement_rate: 4.2,
        upcoming_posts: 3,
        grid_layout: '3x3'
      }
    }
  },

  // ========================
  // OTHER SITES SOURCES
  // ========================
  {
    type: 'zoho-site',
    icon: 'Building',
    label: 'Zoho',
    color: '#C9302C',
    category: 'traffic-sources-other-sites',
    title: 'Zoho Platform',
    description: 'Zoho business suite integration',
    defaultProps: {
      title: 'Zoho Integration',
      description: 'Business application suite',
      status: 'active',
      properties: {
        apps_connected: 8,
        data_sync: 'daily'
      }
    }
  },

  {
    type: 'yelp-site',
    icon: 'Star',
    label: 'Yelp',
    color: '#D32323',
    category: 'traffic-sources-other-sites',
    title: 'Yelp Business',
    description: 'Yelp business listings and reviews',
    defaultProps: {
      title: 'Yelp Business Profile',
      description: 'Local business discovery',
      status: 'active',
      properties: {
        reviews: 125,
        rating: 4.3
      }
    }
  },

  {
    type: 'zendesk-site',
    icon: 'HeadphonesIcon',
    label: 'Zendesk',
    color: '#03363D',
    category: 'traffic-sources-other-sites',
    title: 'Zendesk Support',
    description: 'Customer support platform',
    defaultProps: {
      title: 'Zendesk Integration',
      description: 'Customer service and support',
      status: 'active',
      properties: {
        tickets: 350,
        satisfaction: 92
      }
    }
  },

  {
    type: 'drift-site',
    icon: 'MessageCircle',
    label: 'Drift',
    color: '#2D88FF',
    category: 'traffic-sources-other-sites',
    title: 'Drift Conversations',
    description: 'Conversational marketing platform',
    defaultProps: {
      title: 'Drift Integration',
      description: 'Live chat and conversational AI',
      status: 'active',
      properties: {
        conversations: 280,
        qualification_rate: 15
      }
    }
  },

  {
    type: 'gotomeeting-site',
    icon: 'VideoIcon',
    label: 'GoToMeeting',
    color: '#FF6900',
    category: 'traffic-sources-other-sites',
    title: 'GoToMeeting',
    description: 'Video conferencing platform',
    defaultProps: {
      title: 'GoToMeeting Integration',
      description: 'Web conferencing and meetings',
      status: 'active',
      properties: {
        meetings_monthly: 45,
        attendees: 320
      }
    }
  },

  {
    type: 'amazon-site',
    icon: 'ShoppingCart',
    label: 'Amazon',
    color: '#FF9900',
    category: 'traffic-sources-other-sites',
    title: 'Amazon Marketplace',
    description: 'Amazon e-commerce integration',
    defaultProps: {
      title: 'Amazon Integration',
      description: 'E-commerce marketplace traffic',
      status: 'active',
      properties: {
        products: 25,
        monthly_sales: 150
      }
    }
  },

  {
    type: 'zoom-site',
    icon: 'Video',
    label: 'Zoom',
    color: '#2D8CFF',
    category: 'traffic-sources-other-sites',
    title: 'Zoom Meetings',
    description: 'Video conferencing platform',
    defaultProps: {
      title: 'Zoom Integration',
      description: 'Video meetings and webinars',
      status: 'active',
      properties: {
        meetings: 60,
        participants: 450
      }
    }
  },

  {
    type: 'gmail-site',
    icon: 'Mail',
    label: 'Gmail',
    color: '#EA4335',
    category: 'traffic-sources-other-sites',
    title: 'Gmail Integration',
    description: 'Gmail email integration',
    defaultProps: {
      title: 'Gmail Integration',
      description: 'Email communication tracking',
      status: 'active',
      properties: {
        emails_tracked: 500,
        open_rate: 28
      }
    }
  },

  {
    type: 'spotify-site',
    icon: 'Music',
    label: 'Spotify',
    color: '#1DB954',
    category: 'traffic-sources-other-sites',
    title: 'Spotify Advertising',
    description: 'Spotify audio advertising',
    defaultProps: {
      title: 'Spotify Campaign',
      description: 'Audio streaming advertising',
      status: 'active',
      properties: {
        impressions: 25000,
        completion_rate: 85
      }
    }
  },

  {
    type: 'snapchat-site',
    icon: 'Camera',
    label: 'Snapchat',
    color: '#FFFC00',
    category: 'traffic-sources-other-sites',
    title: 'Snapchat Platform',
    description: 'Snapchat social platform',
    defaultProps: {
      title: 'Snapchat Integration',
      description: 'AR and social content',
      status: 'active',
      properties: {
        snaps: 180,
        views: 8500
      }
    }
  },

  {
    type: 'clutch-site',
    icon: 'Award',
    label: 'Clutch',
    color: '#FF3D2E',
    category: 'traffic-sources-other-sites',
    title: 'Clutch Reviews',
    description: 'B2B service reviews platform',
    defaultProps: {
      title: 'Clutch Profile',
      description: 'B2B reviews and ratings',
      status: 'active',
      properties: {
        reviews: 45,
        rating: 4.8
      }
    }
  },

  {
    type: 'googlemaps-site',
    icon: 'MapPin',
    label: 'Google Maps',
    color: '#4285F4',
    category: 'traffic-sources-other-sites',
    title: 'Google Maps Business',
    description: 'Google Maps business listing',
    defaultProps: {
      title: 'Google Maps Integration',
      description: 'Local business discovery',
      status: 'active',
      properties: {
        views: 1250,
        actions: 95
      }
    }
  },

  // ========================
  // CUSTOM UPLOADED ICONS
  // ========================
  {
    type: 'custom-uploaded-icon',
    icon: 'Plus',
    label: 'Custom Icon',
    color: '#6B7280',
    category: 'custom-icons',
    title: 'Custom Uploaded Icon',
    description: 'Upload your own custom icons',
    defaultProps: {
      title: 'Custom Icon',
      description: 'Upload and use your own traffic source icons',
      status: 'draft',
      properties: {
        custom_icon_url: '',
        icon_type: 'uploaded'
      }
    }
  }
];

// Organizar templates por categoria SIMPLIFICADO
export const TEMPLATE_CATEGORIES = {
  'traffic-sources': {
    label: '🚀 Traffic Sources',
    description: 'Generate traffic',
    color: '#3B82F6'
  },
  'lead-capture': {
    label: '🎯 Lead Capture',
    description: 'Capture leads',
    color: '#10B981'
  },
  'nurturing': {
    label: '🤝 Nurturing', 
    description: 'Nurture relationships',
    color: '#F59E0B'
  },
  'sales-conversion': {
    label: '🎯 Sales',
    description: 'Convert to sales',
    color: '#EF4444'
  },
  'social-media': {
    label: '📱 Social Media',
    description: 'Social media management',
    color: '#E4405F'
  },
  
  // Fase 2 - Apenas essenciais
  'funnel-diagrams': {
    label: '🎯 Funnel Diagrams',
    description: 'Funnel with metrics',
    color: '#3B82F6'
  },
  'journey-maps': {
    label: '🗺️ Journey Maps',
    description: 'Customer journey',
    color: '#8B5CF6'
  },
  'process-flows': {
    label: '⚡ Process Flows',
    description: 'Process diagrams',
    color: '#F59E0B'
  }
};

export default MARKETING_COMPONENT_TEMPLATES;
