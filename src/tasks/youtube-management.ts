import { Task, TaskCategory, TaskContext, TaskResult } from './index';
import { FunnelComponent, ComponentTemplate } from '../types/funnel';

// YouTube-specific component types
export interface YouTubeComponent extends FunnelComponent {
  type: 'youtube-video' | 'youtube-short' | 'youtube-thumbnail' | 'youtube-banner' | 'youtube-profile';
  data: FunnelComponent['data'] & {
    youtubeData: {
      videoId?: string;
      channelId?: string;
      resolution: YouTubeResolution;
      aspectRatio: YouTubeAspectRatio;
      duration?: number;
      uploadDate?: string;
      views?: number;
      likes?: number;
      comments?: number;
      thumbnail?: {
        url: string;
        quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres';
      };
      videoSpecs: {
        format: 'MP4' | 'MOV' | 'AVI' | 'FLV' | 'WebM' | 'MPEG-4';
        codec: 'H.264' | 'H.265' | 'VP9' | 'AV1';
        frameRate: 24 | 25 | 30 | 48 | 50 | 60;
        bitrate?: string;
        audioCodec?: 'AAC' | 'MP3' | 'Opus';
      };
      seoData: {
        title: string;
        description: string;
        tags: string[];
        category: string;
        language: string;
        captions?: boolean;
      };
    };
  };
}

// YouTube resolutions and aspect ratios based on user specifications
export type YouTubeResolution = 
  | '8K_4320p' | '4K_2160p' | '2K_1440p' | 'HD_1080p' | 'HD_720p' 
  | 'SD_480p' | 'SD_360p' | 'SD_240p' | 'Vertical_1080x1920' | 'Legacy_640x480';

export type YouTubeAspectRatio = '16:9' | '9:16' | '4:3' | '1:1';

// Resolution mapping with exact specifications
export const YOUTUBE_RESOLUTIONS: Record<YouTubeResolution, { width: number; height: number; aspectRatio: YouTubeAspectRatio }> = {
  '8K_4320p': { width: 7680, height: 4320, aspectRatio: '16:9' },
  '4K_2160p': { width: 3840, height: 2160, aspectRatio: '16:9' },
  '2K_1440p': { width: 2560, height: 1440, aspectRatio: '16:9' },
  'HD_1080p': { width: 1920, height: 1080, aspectRatio: '16:9' },
  'HD_720p': { width: 1280, height: 720, aspectRatio: '16:9' },
  'SD_480p': { width: 854, height: 480, aspectRatio: '16:9' },
  'SD_360p': { width: 640, height: 360, aspectRatio: '16:9' },
  'SD_240p': { width: 426, height: 240, aspectRatio: '16:9' },
  'Vertical_1080x1920': { width: 1080, height: 1920, aspectRatio: '9:16' },
  'Legacy_640x480': { width: 640, height: 480, aspectRatio: '4:3' }
};

// Input types for YouTube tasks
export interface CreateYouTubeVideoInput {
  title: string;
  description: string;
  resolution: YouTubeResolution;
  aspectRatio?: YouTubeAspectRatio;
  videoType: 'standard' | 'short' | 'premiere' | 'live';
  category: string;
  tags: string[];
  position: { x: number; y: number };
  thumbnailStyle?: 'auto' | 'custom';
  monetization?: boolean;
  visibility?: 'public' | 'unlisted' | 'private' | 'scheduled';
}

export interface OptimizeVideoSpecsInput {
  componentId: string;
  targetResolution: YouTubeResolution;
  optimizationLevel: 'basic' | 'standard' | 'professional' | 'broadcast';
  targetAudience: 'mobile' | 'desktop' | 'tv' | 'all';
}

export interface GenerateThumbnailInput {
  componentId: string;
  style: 'minimal' | 'bold' | 'gaming' | 'educational' | 'lifestyle' | 'business';
  includeText: boolean;
  textOverlay?: string;
  colorScheme: 'brand' | 'high-contrast' | 'youtube-style' | 'custom';
  aspectRatio: '16:9' | '1:1';
}

export interface CreateYouTubeBannerInput {
  channelName: string;
  description: string;
  brandColors: string[];
  style: 'minimal' | 'creative' | 'professional' | 'gaming' | 'lifestyle';
  includeSchedule?: boolean;
  socialLinks?: string[];
  position: { x: number; y: number };
}

// YouTube-specific tasks
export const createYouTubeVideoTask: Task<CreateYouTubeVideoInput, YouTubeComponent> = {
  id: 'youtube.create-video',
  name: 'Create YouTube Video Component',
  description: 'Creates a YouTube video component with proper specifications',
  category: TaskCategory.COMPONENT_MANAGEMENT,
  
  validate: (input) => {
    return !!(input.title && input.resolution && input.category && 
              YOUTUBE_RESOLUTIONS[input.resolution]);
  },

  execute: async (input, context): Promise<TaskResult<YouTubeComponent>> => {
    try {
      const resolutionSpecs = YOUTUBE_RESOLUTIONS[input.resolution];
      const aspectRatio = input.aspectRatio || resolutionSpecs.aspectRatio;

      // Determine video type specific properties
      const isShort = input.videoType === 'short' || aspectRatio === '9:16';
      const maxDuration = isShort ? 60 : 43200; // 60s for Shorts, 12h for regular videos

      const newComponent: YouTubeComponent = {
        id: `youtube-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: isShort ? 'youtube-short' : 'youtube-video',
        position: input.position,
        connections: [],
        data: {
          title: input.title,
          description: input.description,
          image: '',
          url: '',
          status: 'draft',
          properties: {
            videoType: input.videoType,
            monetization: input.monetization || false,
            visibility: input.visibility || 'public'
          },
          youtubeData: {
            resolution: input.resolution,
            aspectRatio: aspectRatio,
            duration: 0,
            videoSpecs: {
              format: 'MP4',
              codec: resolutionSpecs.width >= 1920 ? 'H.265' : 'H.264',
              frameRate: aspectRatio === '9:16' ? 30 : 60,
              bitrate: calculateOptimalBitrate(input.resolution),
              audioCodec: 'AAC'
            },
            seoData: {
              title: input.title,
              description: input.description,
              tags: input.tags,
              category: input.category,
              language: 'pt-BR',
              captions: true
            }
          }
        }
      };

      return {
        success: true,
        data: newComponent,
        metadata: {
          resolution: input.resolution,
          dimensions: `${resolutionSpecs.width}x${resolutionSpecs.height}`,
          aspectRatio: aspectRatio,
          videoType: input.videoType,
          isShort: isShort,
          maxDuration: maxDuration,
          recommendedUploadSize: calculateFileSize(input.resolution)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create YouTube video: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const optimizeVideoSpecsTask: Task<OptimizeVideoSpecsInput, { optimizedSpecs: Record<string, unknown>; recommendations: string[] }> = {
  id: 'youtube.optimize-specs',
  name: 'Optimize Video Specifications',
  description: 'Optimizes video specifications based on target resolution and audience',
  category: TaskCategory.COMPONENT_MANAGEMENT,
  
  validate: (input) => {
    return !!(input.componentId && input.targetResolution && YOUTUBE_RESOLUTIONS[input.targetResolution]);
  },

  execute: async (input, context): Promise<TaskResult<{ optimizedSpecs: Record<string, unknown>; recommendations: string[] }>> => {
    try {
      const resolutionSpecs = YOUTUBE_RESOLUTIONS[input.targetResolution];
      const recommendations: string[] = [];

      // Generate optimization recommendations
      const optimizedSpecs = {
        resolution: input.targetResolution,
        dimensions: `${resolutionSpecs.width}x${resolutionSpecs.height}`,
        aspectRatio: resolutionSpecs.aspectRatio,
        format: 'MP4',
        codec: getOptimalCodec(input.targetResolution, input.optimizationLevel),
        frameRate: getOptimalFrameRate(input.targetResolution, input.targetAudience),
        bitrate: calculateOptimalBitrate(input.targetResolution, input.optimizationLevel),
        audioCodec: 'AAC',
        audioBitrate: '128 kbps'
      };

      // Add specific recommendations
      if (resolutionSpecs.aspectRatio === '9:16') {
        recommendations.push('📱 Formato vertical detectado - otimizado para YouTube Shorts');
        recommendations.push('⏱️ Duração máxima recomendada: 60 segundos');
        recommendations.push('🎯 Use texto grande e elementos centralizados para melhor visualização mobile');
      }

      if (resolutionSpecs.width >= 2560) {
        recommendations.push('🎬 Alta resolução detectada - considere usar codificação H.265 para melhor compressão');
        recommendations.push('💾 Arquivo resultante será grande - planeje tempo de upload adequado');
      }

      if (input.targetAudience === 'mobile') {
        recommendations.push('📱 Otimizado para mobile - use elementos maiores e menos texto');
      }

      recommendations.push(`📊 Tamanho estimado do arquivo: ${calculateFileSize(input.targetResolution)}`);
      recommendations.push(`🎭 Resolução: ${resolutionSpecs.width}x${resolutionSpecs.height} (${resolutionSpecs.aspectRatio})`);

      return {
        success: true,
        data: { optimizedSpecs, recommendations },
        metadata: {
          targetResolution: input.targetResolution,
          optimizationLevel: input.optimizationLevel,
          targetAudience: input.targetAudience
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to optimize video specs: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const generateThumbnailTask: Task<GenerateThumbnailInput, { thumbnailUrl: string; specifications: Record<string, unknown> }> = {
  id: 'youtube.generate-thumbnail',
  name: 'Generate YouTube Thumbnail',
  description: 'Generates optimized thumbnail for YouTube video',
  category: TaskCategory.COMPONENT_MANAGEMENT,
  
  validate: (input) => {
    return !!(input.componentId && input.style && input.aspectRatio);
  },

  execute: async (input, context): Promise<TaskResult<{ thumbnailUrl: string; specifications: Record<string, unknown> }>> => {
    try {
      // Thumbnail specifications based on aspect ratio
      const thumbnailSpecs = input.aspectRatio === '16:9' 
        ? { width: 1280, height: 720, minSize: { width: 640, height: 360 } }
        : { width: 1080, height: 1080, minSize: { width: 640, height: 640 } };

      const specifications = {
        dimensions: `${thumbnailSpecs.width}x${thumbnailSpecs.height}`,
        aspectRatio: input.aspectRatio,
        format: 'JPG/PNG',
        maxFileSize: '2MB',
        minDimensions: `${thumbnailSpecs.minSize.width}x${thumbnailSpecs.minSize.height}`,
        colorSpace: 'sRGB',
        style: input.style,
        includeText: input.includeText,
        textOverlay: input.textOverlay,
        colorScheme: input.colorScheme
      };

      // Generate thumbnail URL (in real implementation, this would call an image generation service)
      const thumbnailUrl = `https://api.thumbnailgenerator.com/generate?` +
        `style=${input.style}&` +
        `width=${thumbnailSpecs.width}&` +
        `height=${thumbnailSpecs.height}&` +
        `text=${encodeURIComponent(input.textOverlay || '')}&` +
        `scheme=${input.colorScheme}`;

      return {
        success: true,
        data: { thumbnailUrl, specifications },
        metadata: {
          componentId: input.componentId,
          style: input.style,
          dimensions: specifications.dimensions,
          aspectRatio: input.aspectRatio
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to generate thumbnail: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const createYouTubeBannerTask: Task<CreateYouTubeBannerInput, YouTubeComponent> = {
  id: 'youtube.create-banner',
  name: 'Create YouTube Channel Banner',
  description: 'Creates a YouTube channel banner with optimal specifications',
  category: TaskCategory.COMPONENT_MANAGEMENT,
  
  validate: (input) => {
    return !!(input.channelName && input.style && input.position);
  },

  execute: async (input, context): Promise<TaskResult<YouTubeComponent>> => {
    try {
      const bannerComponent: YouTubeComponent = {
        id: `youtube-banner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'youtube-banner',
        position: input.position,
        connections: [],
        data: {
          title: `Banner: ${input.channelName}`,
          description: input.description,
          image: '',
          url: '',
          status: 'draft',
          properties: {
            channelName: input.channelName,
            style: input.style,
            brandColors: input.brandColors,
            includeSchedule: input.includeSchedule || false,
            socialLinks: input.socialLinks || []
          },
          youtubeData: {
            resolution: 'Banner_2560x1440' as YouTubeResolution,
            aspectRatio: '16:9',
            videoSpecs: {
              format: 'MP4',
              codec: 'H.264',
              frameRate: 30
            },
            seoData: {
              title: input.channelName,
              description: input.description,
              tags: ['channel-art', 'banner', 'branding'],
              category: 'Channel Branding',
              language: 'pt-BR'
            }
          }
        }
      };

      return {
        success: true,
        data: bannerComponent,
        metadata: {
          channelName: input.channelName,
          style: input.style,
          dimensions: '2560x1440',
          safeArea: '1546x423',
          recommendations: [
            '📱 Área segura: 1546x423 pixels (centro)',
            '💻 Visível em desktop: 2560x423 pixels',
            '📺 Visível em TV: 2560x1440 pixels',
            '🎨 Use elementos importantes na área segura'
          ]
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create YouTube banner: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

// Helper functions
function calculateOptimalBitrate(resolution: YouTubeResolution, level: string = 'standard'): string {
  const baseRates = {
    '8K_4320p': { basic: '80000', standard: '100000', professional: '150000', broadcast: '200000' },
    '4K_2160p': { basic: '35000', standard: '45000', professional: '65000', broadcast: '85000' },
    '2K_1440p': { basic: '16000', standard: '20000', professional: '30000', broadcast: '40000' },
    'HD_1080p': { basic: '8000', standard: '10000', professional: '15000', broadcast: '20000' },
    'HD_720p': { basic: '4000', standard: '5000', professional: '7500', broadcast: '10000' },
    'SD_480p': { basic: '2000', standard: '2500', professional: '3500', broadcast: '5000' },
    'SD_360p': { basic: '1000', standard: '1500', professional: '2000', broadcast: '3000' },
    'SD_240p': { basic: '500', standard: '750', professional: '1000', broadcast: '1500' },
    'Vertical_1080x1920': { basic: '6000', standard: '8000', professional: '12000', broadcast: '16000' },
    'Legacy_640x480': { basic: '1500', standard: '2000', professional: '2500', broadcast: '3500' }
  };

  const rates = baseRates[resolution];
  return `${rates[level as keyof typeof rates]} kbps`;
}

function getOptimalCodec(resolution: YouTubeResolution, level: string): string {
  const specs = YOUTUBE_RESOLUTIONS[resolution];
  if (level === 'broadcast' || specs.width >= 2560) {
    return 'H.265 (HEVC)';
  }
  if (level === 'professional' || specs.width >= 1920) {
    return 'H.264 (AVC)';
  }
  return 'H.264 (AVC)';
}

function getOptimalFrameRate(resolution: YouTubeResolution, audience: string): number {
  const specs = YOUTUBE_RESOLUTIONS[resolution];
  
  if (specs.aspectRatio === '9:16') {
    return 30; // Shorts typically 30fps
  }
  
  if (audience === 'gaming' || specs.width >= 1920) {
    return 60;
  }
  
  return 30;
}

function calculateFileSize(resolution: YouTubeResolution): string {
  const specs = YOUTUBE_RESOLUTIONS[resolution];
  const pixelCount = specs.width * specs.height;
  
  // Rough estimation: higher resolution = larger file
  if (pixelCount >= 33177600) return '500MB-2GB'; // 8K+
  if (pixelCount >= 8294400) return '200MB-1GB';  // 4K
  if (pixelCount >= 3686400) return '100MB-500MB'; // 2K
  if (pixelCount >= 2073600) return '50MB-200MB';  // 1080p
  if (pixelCount >= 921600) return '25MB-100MB';   // 720p
  return '10MB-50MB'; // SD and below
}

// Export all YouTube management tasks
export const youtubeManagementTasks = [
  createYouTubeVideoTask,
  optimizeVideoSpecsTask,
  generateThumbnailTask,
  createYouTubeBannerTask
]; 