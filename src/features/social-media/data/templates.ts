import { ComponentTemplate } from '../../../types/funnel';

export const socialMediaTemplates: ComponentTemplate[] = [
  // Instagram
  {
    type: 'instagram-post',
    icon: '📸',
    label: 'Instagram Post',
    color: '#E4405F',
    category: 'social-media',
    defaultProps: {
      title: 'Instagram Post',
      description: 'Post quadrado 1080x1080px',
      status: 'draft',
      properties: {
        dimensions: '1080x1080',
        aspectRatio: '1:1',
        platform: 'Instagram',
        type: 'Post',
        caption: '',
        hashtags: [],
        location: '',
        collaborators: []
      }
    }
  },
  {
    type: 'instagram-story',
    icon: '📱',
    label: 'Instagram Story',
    color: '#E4405F',
    category: 'social-media',
    defaultProps: {
      title: 'Instagram Story',
      description: 'Story vertical 1080x1920px',
      status: 'draft',
      properties: {
        dimensions: '1080x1920',
        aspectRatio: '9:16',
        platform: 'Instagram',
        type: 'Story',
        duration: '15s',
        stickers: [],
        polls: [],
        questions: []
      }
    }
  },
  {
    type: 'instagram-reels',
    icon: '🎬',
    label: 'Instagram Reels',
    color: '#E4405F',
    category: 'social-media',
    defaultProps: {
      title: 'Instagram Reels',
      description: 'Vídeo vertical 1080x1920px, até 90s',
      status: 'draft',
      properties: {
        dimensions: '1080x1920',
        aspectRatio: '9:16',
        platform: 'Instagram',
        type: 'Reels',
        duration: '15-90s',
        music: '',
        effects: [],
        trending: false
      }
    }
  },
  {
    type: 'instagram-carousel',
    icon: '📚',
    label: 'Instagram Carousel',
    color: '#E4405F',
    category: 'social-media',
    defaultProps: {
      title: 'Instagram Carousel',
      description: 'Múltiplas imagens 1080x1080px',
      status: 'draft',
      properties: {
        dimensions: '1080x1080',
        aspectRatio: '1:1',
        platform: 'Instagram',
        type: 'Carousel',
        slides: [],
        maxSlides: 10,
        swipeDirection: 'horizontal'
      }
    }
  },

  // TikTok
  {
    type: 'tiktok-video',
    icon: '🎵',
    label: 'TikTok Video',
    color: '#000000',
    category: 'social-media',
    defaultProps: {
      title: 'TikTok Video',
      description: 'Vídeo vertical 1080x1920px, até 10min',
      status: 'draft',
      properties: {
        dimensions: '1080x1920',
        aspectRatio: '9:16',
        platform: 'TikTok',
        type: 'Video',
        duration: '15s-10min',
        music: '',
        effects: [],
        trends: [],
        duet: false,
        stitch: false
      }
    }
  },

  // YouTube
  {
    type: 'youtube-short',
    icon: '📹',
    label: 'YouTube Shorts',
    color: '#FF0000',
    category: 'social-media',
    defaultProps: {
      title: 'YouTube Shorts',
      description: 'Vídeo vertical 1080x1920px, até 60s',
      status: 'draft',
      properties: {
        dimensions: '1080x1920',
        aspectRatio: '9:16',
        platform: 'YouTube',
        type: 'Shorts',
        duration: 'até 60s',
        music: '',
        captions: true,
        thumbnailAuto: true
      }
    }
  },
  {
    type: 'youtube-video',
    icon: '🎥',
    label: 'YouTube Video',
    color: '#FF0000',
    category: 'social-media',
    defaultProps: {
      title: 'YouTube Video',
      description: 'Vídeo horizontal 1920x1080px',
      status: 'draft',
      properties: {
        dimensions: '1920x1080',
        aspectRatio: '16:9',
        platform: 'YouTube',
        type: 'Video',
        duration: 'ilimitado',
        quality: '1080p',
        monetization: false,
        endScreen: [],
        cards: []
      }
    }
  },
  {
    type: 'youtube-thumbnail',
    icon: '🖼️',
    label: 'YouTube Thumbnail',
    color: '#FF0000',
    category: 'social-media',
    defaultProps: {
      title: 'YouTube Thumbnail',
      description: 'Miniatura 1280x720px',
      status: 'draft',
      properties: {
        dimensions: '1280x720',
        aspectRatio: '16:9',
        platform: 'YouTube',
        type: 'Thumbnail',
        fileSize: 'max 2MB',
        format: 'JPG, GIF, PNG',
        clickable: true
      }
    }
  },

  // Facebook
  {
    type: 'facebook-post',
    icon: '👥',
    label: 'Facebook Post',
    color: '#1877F2',
    category: 'social-media',
    defaultProps: {
      title: 'Facebook Post',
      description: 'Post 1200x630px',
      status: 'draft',
      properties: {
        dimensions: '1200x630',
        aspectRatio: '1.91:1',
        platform: 'Facebook',
        type: 'Post',
        audience: 'public',
        scheduling: false,
        boosting: false
      }
    }
  },
  {
    type: 'facebook-ad',
    icon: '📢',
    label: 'Facebook Ad',
    color: '#1877F2',
    category: 'social-media',
    defaultProps: {
      title: 'Facebook Ad',
      description: 'Anúncio 1200x628px',
      status: 'draft',
      properties: {
        dimensions: '1200x628',
        aspectRatio: '1.91:1',
        platform: 'Facebook',
        type: 'Ad',
        objective: '',
        audience: '',
        budget: 0,
        duration: ''
      }
    }
  },

  // LinkedIn
  {
    type: 'linkedin-post',
    icon: '💼',
    label: 'LinkedIn Post',
    color: '#0077B5',
    category: 'social-media',
    defaultProps: {
      title: 'LinkedIn Post',
      description: 'Post profissional 1200x627px',
      status: 'draft',
      properties: {
        dimensions: '1200x627',
        aspectRatio: '1.91:1',
        platform: 'LinkedIn',
        type: 'Post',
        professional: true,
        industry: '',
        networking: true
      }
    }
  },

  // Twitter/X
  {
    type: 'twitter-post',
    icon: '🐦',
    label: 'Twitter/X Post',
    color: '#1DA1F2',
    category: 'social-media',
    defaultProps: {
      title: 'Twitter/X Post',
      description: 'Post 1200x675px',
      status: 'draft',
      properties: {
        dimensions: '1200x675',
        aspectRatio: '16:9',
        platform: 'Twitter/X',
        type: 'Post',
        characterLimit: 280,
        thread: false,
        hashtags: [],
        mentions: []
      }
    }
  }
];
