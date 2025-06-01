
import { ComponentTemplate } from '../types/funnel';

export const componentTemplates: ComponentTemplate[] = [
  {
    type: 'landing-page',
    icon: '🏠',
    label: 'Landing Page',
    color: 'bg-blue-500',
    defaultData: {
      title: 'Landing Page',
      description: 'Capture leads with compelling offers',
      properties: {
        headline: 'Your Amazing Offer',
        cta: 'Get Started Now',
        conversionRate: 15
      }
    }
  },
  {
    type: 'quiz',
    icon: '❓',
    label: 'Interactive Quiz',
    color: 'bg-purple-500',
    defaultData: {
      title: 'Quiz',
      description: 'Engage users with interactive questions',
      properties: {
        questions: 5,
        completionRate: 75,
        segmentation: true
      }
    }
  },
  {
    type: 'form',
    icon: '📝',
    label: 'Contact Form',
    color: 'bg-green-500',
    defaultData: {
      title: 'Contact Form',
      description: 'Collect user information',
      properties: {
        fields: ['name', 'email', 'phone'],
        conversionRate: 25
      }
    }
  },
  {
    type: 'email-sequence',
    icon: '📧',
    label: 'Email Sequence',
    color: 'bg-yellow-500',
    defaultData: {
      title: 'Email Sequence',
      description: 'Nurture leads with automated emails',
      properties: {
        emails: 7,
        openRate: 22,
        clickRate: 3.5
      }
    }
  },
  {
    type: 'checkout',
    icon: '💳',
    label: 'Checkout Page',
    color: 'bg-red-500',
    defaultData: {
      title: 'Checkout',
      description: 'Complete the sale',
      properties: {
        price: 97,
        conversionRate: 8,
        upsells: true
      }
    }
  },
  {
    type: 'automation',
    icon: '⚡',
    label: 'Marketing Automation',
    color: 'bg-indigo-500',
    defaultData: {
      title: 'Automation',
      description: 'Trigger-based actions',
      properties: {
        triggers: ['email_open', 'page_visit', 'form_submit'],
        actions: ['send_email', 'add_tag', 'move_stage']
      }
    }
  },
  {
    type: 'analytics',
    icon: '📊',
    label: 'Analytics',
    color: 'bg-pink-500',
    defaultData: {
      title: 'Analytics',
      description: 'Track performance metrics',
      properties: {
        metrics: ['conversion_rate', 'traffic', 'revenue'],
        dashboard: true
      }
    }
  },
  {
    type: 'segmentation',
    icon: '🎯',
    label: 'Audience Segmentation',
    color: 'bg-cyan-500',
    defaultData: {
      title: 'Segmentation',
      description: 'Target specific audiences',
      properties: {
        segments: ['new_visitors', 'returning_customers', 'high_value'],
        criteria: 'behavior'
      }
    }
  },
  {
    type: 'conversion',
    icon: '🎉',
    label: 'Conversion Page',
    color: 'bg-emerald-500',
    defaultData: {
      title: 'Conversion',
      description: 'Success page and next steps',
      properties: {
        thankYouMessage: 'Thank you for your purchase!',
        nextSteps: 'Check your email for next steps',
        retention: true
      }
    }
  }
];
