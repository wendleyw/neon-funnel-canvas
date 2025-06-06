import React, { useState, useCallback } from 'react';
import { useTaskManager } from '@/features/shared/hooks/useTaskManager';
import { 
  YouTubeResolution, 
  YouTubeAspectRatio, 
  YOUTUBE_RESOLUTIONS,
  CreateYouTubeVideoInput,
  OptimizeVideoSpecsInput,
  GenerateThumbnailInput,
  CreateYouTubeBannerInput
} from '../../tasks/youtube-management';
import { FunnelComponent } from '../../../types/funnel';
import { Button } from '@/features/shared/ui/button';
import { Input } from '@/features/shared/ui/input';
import { Textarea } from '@/features/shared/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/features/shared/ui/tabs';
import { Badge } from '@/features/shared/ui/badge';
import { 
  Play, 
  MonitorPlay, 
  Image, 
  User, 
  Settings, 
  Zap,
  Youtube,
  Monitor,
  Smartphone,
  Tv,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface YouTubeCreatorProps {
  onComponentCreate: (component: FunnelComponent) => void;
  workspaceId?: string;
  projectId?: string;
  userId?: string;
}

export const YouTubeCreator: React.FC<YouTubeCreatorProps> = ({
  onComponentCreate,
  workspaceId = 'default',
  projectId = 'default',
  userId = 'user'
}) => {
  
  const { executeTask, isExecuting } = useTaskManager({
    userId,
    workspaceId,
    projectId
  });

  // State for form data
  const [activeTab, setActiveTab] = useState('video');
  const [videoData, setVideoData] = useState<Partial<CreateYouTubeVideoInput>>({
    title: '',
    description: '',
    resolution: 'HD_1080p',
    videoType: 'standard',
    category: 'Entertainment',
    tags: [],
    visibility: 'public',
    monetization: false
  });
  
  const [tagsInput, setTagsInput] = useState('');
  
  const [bannerData, setBannerData] = useState<Partial<CreateYouTubeBannerInput>>({
    channelName: '',
    description: '',
    style: 'professional',
    brandColors: ['#FF0000'],
    includeSchedule: false,
    socialLinks: []
  });

  const [selectedResolution, setSelectedResolution] = useState<YouTubeResolution>('HD_1080p');
  const [optimizationLevel, setOptimizationLevel] = useState<'basic' | 'standard' | 'professional' | 'broadcast'>('standard');
  const [targetAudience, setTargetAudience] = useState<'mobile' | 'desktop' | 'tv' | 'all'>('all');

  // Resolution groups for easier selection
  const resolutionGroups = {
    'Ultra HD (4K+)': ['8K_4320p', '4K_2160p', '2K_1440p'] as YouTubeResolution[],
    'HD Standard': ['HD_1080p', 'HD_720p'] as YouTubeResolution[],
    'SD/Mobile': ['SD_480p', 'SD_360p', 'SD_240p'] as YouTubeResolution[],
    'Vertical/Shorts': ['Vertical_1080x1920'] as YouTubeResolution[],
    'Legacy': ['Legacy_640x480'] as YouTubeResolution[]
  };

  const handleCreateVideo = useCallback(async () => {
    if (!videoData.title || !videoData.description) {
      toast.error('Título e descrição são obrigatórios');
      return;
    }

    try {
      const result = await executeTask('youtube.create-video', {
        ...videoData,
        position: { x: Math.random() * 300, y: Math.random() * 300 },
        tags: tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0)
      } as CreateYouTubeVideoInput);

      if (result.success && result.data) {
        onComponentCreate(result.data as FunnelComponent);
        toast.success(`🎥 Componente YouTube criado!`, {
          description: `${result.metadata?.resolution} - ${result.metadata?.dimensions}`
        });
        
        // Reset form
        setVideoData({
          title: '',
          description: '',
          resolution: 'HD_1080p',
          videoType: 'standard',
          category: 'Entertainment',
          tags: [],
          visibility: 'public',
          monetization: false
        });
        setTagsInput('');
      } else {
        toast.error('Erro ao criar componente', {
          description: result.error
        });
      }
    } catch (error) {
      console.error('Error creating YouTube component:', error);
      toast.error('Erro inesperado ao criar componente');
    }
  }, [videoData, tagsInput, executeTask, onComponentCreate]);

  const handleCreateBanner = useCallback(async () => {
    if (!bannerData.channelName) {
      toast.error('Nome do canal é obrigatório');
      return;
    }

    try {
      const result = await executeTask('youtube.create-banner', {
        ...bannerData,
        position: { x: Math.random() * 300, y: Math.random() * 300 }
      } as CreateYouTubeBannerInput);

      if (result.success && result.data) {
        onComponentCreate(result.data as FunnelComponent);
        toast.success(`🎨 Banner do YouTube criado!`, {
          description: `${result.metadata?.dimensions} - ${bannerData.style}`
        });
        
        // Reset form
        setBannerData({
          channelName: '',
          description: '',
          style: 'professional',
          brandColors: ['#FF0000'],
          includeSchedule: false,
          socialLinks: []
        });
      } else {
        toast.error('Erro ao criar banner', {
          description: result.error
        });
      }
    } catch (error) {
      console.error('Error creating YouTube banner:', error);
      toast.error('Erro inesperado ao criar banner');
    }
  }, [bannerData, executeTask, onComponentCreate]);

  const handleOptimizeSpecs = useCallback(async () => {
    try {
      const result = await executeTask('youtube.optimize-specs', {
        componentId: 'temp',
        targetResolution: selectedResolution,
        optimizationLevel,
        targetAudience
      } as OptimizeVideoSpecsInput);

      if (result.success && result.data) {
        const { optimizedSpecs, recommendations } = result.data as { optimizedSpecs: Record<string, unknown>; recommendations: string[] };
        
        // Show optimization results
        toast.success('✨ Especificações otimizadas!', {
          description: `${optimizedSpecs.dimensions} - ${optimizedSpecs.codec}`
        });

        // Display recommendations
        recommendations.forEach((rec, index) => {
          setTimeout(() => {
            toast.info(rec, { duration: 5000 });
          }, index * 1000);
        });
      }
    } catch (error) {
      console.error('Error optimizing specs:', error);
      toast.error('Erro ao otimizar especificações');
    }
  }, [selectedResolution, optimizationLevel, targetAudience, executeTask]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="w-6 h-6 text-red-500" />
            YouTube Creator Studio
          </CardTitle>
          <CardDescription>
            Crie componentes otimizados para YouTube com especificações técnicas precisas
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Vídeo
              </TabsTrigger>
              <TabsTrigger value="banner" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Banner
              </TabsTrigger>
              <TabsTrigger value="optimizer" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Otimizador
              </TabsTrigger>
              <TabsTrigger value="specs" className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Especificações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="video" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Título do Vídeo</label>
                    <Input
                      value={videoData.title || ''}
                      onChange={(e) => setVideoData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Como criar vídeos incríveis para YouTube..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Descrição</label>
                    <Textarea
                      value={videoData.description || ''}
                      onChange={(e) => setVideoData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descrição detalhada do seu vídeo..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Tags (separadas por vírgula)</label>
                    <Input
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="youtube, tutorial, marketing, digital..."
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Resolução</label>
                    <select
                      value={videoData.resolution || 'HD_1080p'}
                      onChange={(e) => setVideoData(prev => ({ ...prev, resolution: e.target.value as YouTubeResolution }))}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      {Object.entries(resolutionGroups).map(([group, resolutions]) => (
                        <optgroup key={group} label={group}>
                          {resolutions.map(resolution => {
                            const specs = YOUTUBE_RESOLUTIONS[resolution];
                            return (
                              <option key={resolution} value={resolution}>
                                {resolution.replace('_', ' ')} - {specs.width}x{specs.height} ({specs.aspectRatio})
                              </option>
                            );
                          })}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Tipo de Vídeo</label>
                    <select
                      value={videoData.videoType || 'standard'}
                      onChange={(e) => setVideoData(prev => ({ ...prev, videoType: e.target.value as CreateYouTubeVideoInput['videoType'] }))}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="standard">Vídeo Padrão</option>
                      <option value="short">YouTube Shorts</option>
                      <option value="premiere">Estreia</option>
                      <option value="live">Transmissão ao Vivo</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Categoria</label>
                    <select
                      value={videoData.category || 'Entertainment'}
                      onChange={(e) => setVideoData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="Entertainment">Entretenimento</option>
                      <option value="Education">Educação</option>
                      <option value="Gaming">Games</option>
                      <option value="Technology">Tecnologia</option>
                      <option value="Music">Música</option>
                      <option value="Sports">Esportes</option>
                      <option value="Business">Negócios</option>
                      <option value="Lifestyle">Estilo de Vida</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={videoData.monetization || false}
                        onChange={(e) => setVideoData(prev => ({ ...prev, monetization: e.target.checked }))}
                      />
                      <span className="text-sm">Monetização</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleCreateVideo} 
                  disabled={isExecuting || !videoData.title || !videoData.description}
                  className="flex items-center gap-2"
                >
                  {isExecuting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Criar Componente de Vídeo
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="banner" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nome do Canal</label>
                    <Input
                      value={bannerData.channelName || ''}
                      onChange={(e) => setBannerData(prev => ({ ...prev, channelName: e.target.value }))}
                      placeholder="Meu Canal Incrível"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Descrição do Canal</label>
                    <Textarea
                      value={bannerData.description || ''}
                      onChange={(e) => setBannerData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Canal dedicado a conteúdo de qualidade..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Estilo do Banner</label>
                    <select
                      value={bannerData.style || 'professional'}
                      onChange={(e) => setBannerData(prev => ({ ...prev, style: e.target.value as CreateYouTubeBannerInput['style'] }))}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="minimal">Minimalista</option>
                      <option value="creative">Criativo</option>
                      <option value="professional">Profissional</option>
                      <option value="gaming">Gaming</option>
                      <option value="lifestyle">Lifestyle</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={bannerData.includeSchedule || false}
                        onChange={(e) => setBannerData(prev => ({ ...prev, includeSchedule: e.target.checked }))}
                      />
                      <span className="text-sm">Incluir cronograma de uploads</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">📐 Especificações do Banner</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-blue-800">
                  <div>📱 <strong>Área Segura:</strong> 1546x423px</div>
                  <div>💻 <strong>Desktop:</strong> 2560x423px</div>
                  <div>📺 <strong>TV:</strong> 2560x1440px</div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleCreateBanner} 
                  disabled={isExecuting || !bannerData.channelName}
                  className="flex items-center gap-2"
                >
                  {isExecuting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Image className="w-4 h-4" />
                      Criar Banner do Canal
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="optimizer" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Resolução Alvo</label>
                  <select
                    value={selectedResolution}
                    onChange={(e) => setSelectedResolution(e.target.value as YouTubeResolution)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    {Object.entries(resolutionGroups).map(([group, resolutions]) => (
                      <optgroup key={group} label={group}>
                        {resolutions.map(resolution => {
                          const specs = YOUTUBE_RESOLUTIONS[resolution];
                          return (
                            <option key={resolution} value={resolution}>
                              {resolution.replace('_', ' ')} - {specs.width}x{specs.height}
                            </option>
                          );
                        })}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Nível de Otimização</label>
                  <select
                    value={optimizationLevel}
                    onChange={(e) => setOptimizationLevel(e.target.value as OptimizeVideoSpecsInput['optimizationLevel'])}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="basic">Básico</option>
                    <option value="standard">Padrão</option>
                    <option value="professional">Profissional</option>
                    <option value="broadcast">Broadcast</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Público Alvo</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as OptimizeVideoSpecsInput['targetAudience'])}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="all">Todos os Dispositivos</option>
                    <option value="mobile">Mobile</option>
                    <option value="desktop">Desktop</option>
                    <option value="tv">TV</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={handleOptimizeSpecs} 
                  disabled={isExecuting}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {isExecuting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Otimizando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Otimizar Especificações
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="specs" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(resolutionGroups).map(([group, resolutions]) => (
                  <Card key={group}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        {group === 'Ultra HD (4K+)' && <Tv className="w-4 h-4" />}
                        {group === 'HD Standard' && <Monitor className="w-4 h-4" />}
                        {group === 'SD/Mobile' && <Smartphone className="w-4 h-4" />}
                        {group === 'Vertical/Shorts' && <Play className="w-4 h-4" />}
                        {group === 'Legacy' && <MonitorPlay className="w-4 h-4" />}
                        {group}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {resolutions.map(resolution => {
                        const specs = YOUTUBE_RESOLUTIONS[resolution];
                        return (
                          <div key={resolution} className="p-2 rounded border">
                            <div className="font-medium text-sm">{resolution.replace('_', ' ')}</div>
                            <div className="text-xs text-gray-600">
                              {specs.width}x{specs.height} ({specs.aspectRatio})
                            </div>
                            <Badge 
                              variant={specs.aspectRatio === '9:16' ? 'destructive' : 'default'}
                              className="text-xs mt-1"
                            >
                              {specs.aspectRatio === '9:16' ? 'Shorts' : 'Padrão'}
                            </Badge>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-medium mb-3">🎯 Recomendações Gerais do YouTube</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <strong>Resolução Mínima:</strong> 1280x720 (16:9) ou 640x480 (4:3)
                  </div>
                  <div>
                    <strong>Tamanho Máximo:</strong> 256 GB ou 12 horas
                  </div>
                  <div>
                    <strong>Banner do Canal:</strong> 2560x1440 pixels
                  </div>
                  <div>
                    <strong>Foto de Perfil:</strong> 800x800 pixels
                  </div>
                  <div>
                    <strong>Shorts:</strong> 1080x1920 pixels (9:16)
                  </div>
                  <div>
                    <strong>Thumbnails:</strong> 1280x720 pixels mínimo
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 