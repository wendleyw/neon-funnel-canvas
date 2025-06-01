
import React from 'react';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface DigitalLaunchFieldsProps {
  componentType: string;
  properties: Record<string, any>;
  onPropertyChange: (key: string, value: any) => void;
}

export const DigitalLaunchFields: React.FC<DigitalLaunchFieldsProps> = ({
  componentType,
  properties,
  onPropertyChange
}) => {
  const addArrayItem = (key: string, newItem: string = '') => {
    const currentArray = properties[key] || [];
    onPropertyChange(key, [...currentArray, newItem]);
  };

  const removeArrayItem = (key: string, index: number) => {
    const currentArray = properties[key] || [];
    onPropertyChange(key, currentArray.filter((_: any, i: number) => i !== index));
  };

  const updateArrayItem = (key: string, index: number, value: string) => {
    const currentArray = properties[key] || [];
    const updatedArray = [...currentArray];
    updatedArray[index] = value;
    onPropertyChange(key, updatedArray);
  };

  const renderArrayField = (key: string, label: string, placeholder: string = '') => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-300">{label}</label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => addArrayItem(key)}
          className="text-gray-400 hover:text-white p-1"
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      {(properties[key] || []).map((item: string, index: number) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            value={item}
            onChange={(e) => updateArrayItem(key, index, e.target.value)}
            placeholder={placeholder}
            className="bg-gray-800 border-gray-700 text-white flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeArrayItem(key, index)}
            className="text-red-400 hover:text-red-300 p-1"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ))}
    </div>
  );

  switch (componentType) {
    case 'offer':
      return (
        <>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Produto Principal</label>
            <Input
              value={properties.mainProduct || ''}
              onChange={(e) => onPropertyChange('mainProduct', e.target.value)}
              placeholder="Nome do produto/serviço principal"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          {renderArrayField('bonuses', 'Bônus', 'Bônus adicional')}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Proposta de Valor</label>
            <Textarea
              value={properties.valueProposition || ''}
              onChange={(e) => onPropertyChange('valueProposition', e.target.value)}
              placeholder="Por que comprar AGORA?"
              className="bg-gray-800 border-gray-700 text-white"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Preço (R$)</label>
            <Input
              type="number"
              value={properties.price || 0}
              onChange={(e) => onPropertyChange('price', parseFloat(e.target.value))}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </>
      );

    case 'target-audience':
      return (
        <>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Avatar/Persona</label>
            <Textarea
              value={properties.avatar || ''}
              onChange={(e) => onPropertyChange('avatar', e.target.value)}
              placeholder="Descrição detalhada do cliente ideal"
              className="bg-gray-800 border-gray-700 text-white"
              rows={3}
            />
          </div>
          {renderArrayField('painPoints', 'Dores/Problemas', 'Problema que seu público enfrenta')}
          {renderArrayField('desires', 'Desejos/Objetivos', 'O que seu público deseja alcançar')}
          {renderArrayField('channels', 'Canais/Plataformas', 'Instagram, YouTube, TikTok...')}
        </>
      );

    case 'traffic-organic':
      return (
        <>
          {renderArrayField('platforms', 'Plataformas', 'Instagram, YouTube, TikTok...')}
          {renderArrayField('contentTypes', 'Tipos de Conteúdo', 'Posts, vídeos, lives, stories...')}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Frequência de Publicação</label>
            <Input
              value={properties.frequency || ''}
              onChange={(e) => onPropertyChange('frequency', e.target.value)}
              placeholder="Ex: 3x por semana"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          {renderArrayField('topics', 'Tópicos de Conteúdo', 'Assunto para o conteúdo')}
        </>
      );

    case 'traffic-paid':
      return (
        <>
          {renderArrayField('platforms', 'Plataformas de Anúncios', 'Facebook Ads, Google Ads...')}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Orçamento Diário (R$)</label>
            <Input
              type="number"
              value={properties.budget || 0}
              onChange={(e) => onPropertyChange('budget', parseFloat(e.target.value))}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          {renderArrayField('targetingCriteria', 'Critérios de Segmentação', 'Idade, interesses, comportamentos...')}
          {renderArrayField('adTypes', 'Tipos de Anúncio', 'Vídeo, carrossel, imagem...')}
        </>
      );

    case 'lead-capture':
      return (
        <>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Lead Magnet</label>
            <Input
              value={properties.leadMagnet || ''}
              onChange={(e) => onPropertyChange('leadMagnet', e.target.value)}
              placeholder="eBook, minicurso, checklist..."
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Headline Principal</label>
            <Input
              value={properties.headline || ''}
              onChange={(e) => onPropertyChange('headline', e.target.value)}
              placeholder="Título chamativo da página"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          {renderArrayField('formFields', 'Campos do Formulário', 'email, nome, telefone...')}
        </>
      );

    case 'webinar-vsl':
      return (
        <>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Tipo</label>
            <select
              value={properties.type || 'webinar'}
              onChange={(e) => onPropertyChange('type', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
            >
              <option value="webinar">Webinar</option>
              <option value="vsl">VSL (Video Sales Letter)</option>
              <option value="presentation">Apresentação</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Duração</label>
            <Input
              value={properties.duration || ''}
              onChange={(e) => onPropertyChange('duration', e.target.value)}
              placeholder="Ex: 60 minutos"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          {renderArrayField('outline', 'Roteiro/Outline', 'Tópico da apresentação')}
          {renderArrayField('objectionHandling', 'Tratamento de Objeções', 'Objeção comum e resposta')}
        </>
      );

    default:
      return null;
  }
};
