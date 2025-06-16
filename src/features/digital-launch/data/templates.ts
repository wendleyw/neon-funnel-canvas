import { ComponentTemplate } from '../../../types/funnel';

export const digitalLaunchTemplates: ComponentTemplate[] = [
  {
    id: 'sales-page-template',
    name: 'High-Converting Sales Page',
    type: 'sales-page',
    category: 'digital-launch',
    icon: '🛒',
    description: 'Complete sales page template for digital product launches',
    data: {
      title: 'High-Converting Sales Page',
      description: 'Complete sales page template for digital product launches',
      status: 'draft' as const,
      properties: {
        mainProduct: 'Digital Course',
        bonuses: [],
        valueProposition: 'Transform your life in 30 days',
        guarantee: '30-day money-back guarantee',
        price: 297,
        urgencyFactor: 'Limited time offer',
        testimonials: [],
        socialProof: '',
        callToAction: 'Get Instant Access Now',
        paymentOptions: ['credit-card', 'paypal'],
        deliveryMethod: 'instant',
        supportLevel: 'email',
        refundPolicy: '30-day refund',
        privacyPolicy: 'We respect your privacy',
        termsOfService: 'Standard terms apply'
      }
    }
  },
  {
    id: 'landing-page-template',
    name: 'Lead Magnet Landing Page',
    type: 'landing-page',
    category: 'digital-launch',
    icon: '📄',
    description: 'Optimized landing page for lead generation',
    data: {
      title: 'Lead Magnet Landing Page',
      description: 'Optimized landing page for lead generation',
      status: 'draft' as const,
      properties: {
        leadMagnet: 'Free eBook',
        headline: 'Get Your Free Guide',
        subheadline: 'Learn the secrets to success',
        formFields: ['email'],
        thankYouMessage: 'Thank you for subscribing!',
        privacyNote: 'We will never spam you',
        deliveryMethod: 'email',
        followUpSequence: 'welcome-series'
      }
    }
  },
  {
    id: 'webinar-registration-template',
    name: 'Webinar Registration Page',
    type: 'webinar-page',
    category: 'digital-launch',
    icon: '🎥',
    description: 'Registration page for webinar or online event',
    data: {
      title: 'Webinar Registration Page',
      description: 'Registration page for webinar or online event',
      status: 'draft' as const,
      properties: {
        webinarTitle: 'Master Class: How to Succeed',
        presenter: 'John Expert',
        date: '2023-12-15T18:00:00Z',
        duration: '60 minutes',
        benefits: [
          'Learn proven strategies',
          'Get expert insights',
          'Implement immediately'
        ],
        formFields: ['name', 'email'],
        reminderEmails: true,
        replayAvailable: true,
        timezone: 'user'
      }
    }
  },
  {
    id: 'thank-you-page-template',
    name: 'Thank You Page',
    type: 'thank-you-page',
    category: 'digital-launch',
    icon: '🙏',
    description: 'Confirmation page after form submission',
    data: {
      title: 'Thank You Page',
      description: 'Confirmation page after form submission',
      status: 'draft' as const,
      properties: {
        headline: 'Thank You for Signing Up!',
        message: 'Check your email for confirmation',
        nextSteps: [
          'Check your inbox',
          'Add us to your contacts',
          'Follow us on social media'
        ],
        socialLinks: {
          facebook: '',
          instagram: '',
          twitter: ''
        },
        upsell: {
          enabled: false,
          product: '',
          price: 0
        }
      }
    }
  },
  {
    id: 'email-sequence-template',
    name: 'Launch Email Sequence',
    type: 'email-sequence',
    category: 'digital-launch',
    icon: '📧',
    description: 'Complete email sequence for product launch',
    data: {
      title: 'Launch Email Sequence',
      description: 'Complete email sequence for product launch',
      status: 'draft' as const,
      properties: {
        emails: [
          {
            subject: 'Introducing our new product',
            timing: 'day-0',
            content: 'Introduction email content'
          },
          {
            subject: 'The benefits of our solution',
            timing: 'day-2',
            content: 'Benefits email content'
          },
          {
            subject: 'Customer success stories',
            timing: 'day-4',
            content: 'Testimonials email content'
          },
          {
            subject: 'Limited time offer ending soon',
            timing: 'day-6',
            content: 'Urgency email content'
          },
          {
            subject: 'Last chance: Offer expires today',
            timing: 'day-7',
            content: 'Final call email content'
          }
        ],
        automationPlatform: 'generic',
        segmentation: {
          enabled: false,
          segments: []
        }
      }
    }
  },
  {
    id: 'upsell-page-template',
    name: 'One-Click Upsell Page',
    type: 'upsell-page',
    category: 'digital-launch',
    icon: '⬆️',
    description: 'Upsell offer page after initial purchase',
    data: {
      title: 'One-Click Upsell Page',
      description: 'Upsell offer page after initial purchase',
      status: 'draft' as const,
      properties: {
        headline: 'Wait! Special One-Time Offer',
        product: 'Premium Add-on',
        originalPrice: 197,
        discountedPrice: 97,
        benefits: [
          'Enhance your results',
          'Save time with premium tools',
          'Get priority support'
        ],
        timeLimit: '15 minutes',
        guaranteeExtension: '+30 days',
        oneClickPurchase: true
      }
    }
  },
  {
    id: 'downsell-page-template',
    name: 'Downsell Offer Page',
    type: 'downsell-page',
    category: 'digital-launch',
    icon: '⬇️',
    description: 'Alternative offer after upsell rejection',
    data: {
      title: 'Downsell Offer Page',
      description: 'Alternative offer after upsell rejection',
      status: 'draft' as const,
      properties: {
        headline: 'Here\'s Another Great Option',
        product: 'Basic Add-on',
        price: 47,
        features: [
          'Core functionality',
          'Essential tools',
          'Standard support'
        ],
        comparison: {
          enabled: true,
          upsellProduct: 'Premium Add-on',
          differences: [
            'Fewer templates',
            'Standard vs. Priority support',
            'No advanced features'
          ]
        }
      }
    }
  },
  {
    id: 'order-form-template',
    name: 'Optimized Order Form',
    type: 'order-form',
    category: 'digital-launch',
    icon: '🛍️',
    description: 'High-converting checkout page',
    data: {
      title: 'Optimized Order Form',
      description: 'High-converting checkout page',
      status: 'draft' as const,
      properties: {
        productName: 'Digital Product',
        price: 297,
        paymentOptions: ['credit-card', 'paypal'],
        formFields: [
          'name',
          'email',
          'address',
          'payment'
        ],
        orderBumps: [
          {
            name: 'Quick-Start Guide',
            price: 27,
            description: 'Get started faster with our quick implementation guide'
          }
        ],
        guaranteeBadge: true,
        securityBadges: true,
        testimonials: true
      }
    }
  },
  {
    id: 'membership-area-template',
    name: 'Member Access Portal',
    type: 'membership-area',
    category: 'digital-launch',
    icon: '🔐',
    description: 'Secure content delivery platform',
    data: {
      title: 'Member Access Portal',
      description: 'Secure content delivery platform',
      status: 'draft' as const,
      properties: {
        welcomeMessage: 'Welcome to your member area!',
        modules: [
          {
            title: 'Getting Started',
            lessons: [
              'Welcome & Overview',
              'How to Use This Course',
              'Setting Expectations'
            ]
          },
          {
            title: 'Core Training',
            lessons: [
              'Fundamentals',
              'Advanced Strategies',
              'Implementation Guide'
            ]
          }
        ],
        features: [
          'Progress tracking',
          'Downloadable resources',
          'Community access'
        ],
        supportAccess: true,
        certificateCompletion: true
      }
    }
  },
  {
    id: 'affiliate-center-template',
    name: 'Affiliate Resource Center',
    type: 'affiliate-center',
    category: 'digital-launch',
    icon: '🤝',
    description: 'Resources for promotional partners',
    data: {
      title: 'Affiliate Resource Center',
      description: 'Resources for promotional partners',
      status: 'draft' as const,
      properties: {
        commission: '50%',
        cookieDuration: '60 days',
        paymentSchedule: 'Monthly',
        minimumPayout: '$100',
        marketingMaterials: [
          'Email swipes',
          'Social media posts',
          'Banner ads',
          'Product images'
        ],
        affiliateManager: {
          name: 'Sarah Support',
          email: 'affiliates@example.com'
        },
        leaderboardEnabled: true,
        bonusPrizes: true
      }
    }
  }
];
