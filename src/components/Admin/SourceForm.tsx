import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ComponentTemplate, FunnelComponent } from '../../types/funnel';
import { MARKETING_CATEGORIES } from '../../data/marketingCategories';
import { toast } from 'sonner';

interface SourceFormProps {
  initialData?: Partial<ComponentTemplate>;
  onSubmit: (data: ComponentTemplate) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultSourceData: ComponentTemplate = {
  type: '' as FunnelComponent['type'], // Will be validated
  label: '',
  icon: '🔗', // Moved icon to root
  color: '#6B7280', // Moved color to root
  category: 'Other Sources', // Default category
  defaultProps: {
    title: '',
    description: '',
    status: 'draft' as FunnelComponent['data']['status'],
    properties: {},
  },
};

export const SourceForm: React.FC<SourceFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ComponentTemplate>(initialData ? { ...defaultSourceData, ...initialData } : defaultSourceData);
  const [propertiesJson, setPropertiesJson] = useState<string>(JSON.stringify(formData.defaultProps.properties, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultSourceData, ...initialData });
      setPropertiesJson(JSON.stringify(initialData.defaultProps?.properties || {}, null, 2));
    } else {
      setFormData(defaultSourceData);
      setPropertiesJson(JSON.stringify(defaultSourceData.defaultProps.properties, null, 2));
    }
  }, [initialData]);

  const handleChange = (field: keyof ComponentTemplate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDefaultPropsChange = (field: keyof ComponentTemplate['defaultProps'], value: any) => {
    setFormData(prev => ({
      ...prev,
      defaultProps: {
        ...prev.defaultProps,
        [field]: value,
      },
    }));
  };

  const handlePropertiesChange = (jsonString: string) => {
    setPropertiesJson(jsonString);
    try {
      const parsedProperties = JSON.parse(jsonString);
      handleDefaultPropsChange('properties', parsedProperties);
      setJsonError(null);
    } catch (error) {
      setJsonError('Invalid JSON format. Please check the syntax.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jsonError) {
      toast.error('Cannot save with invalid JSON in additional properties.');
      return;
    }
    // Ensure type is correctly set from label if not explicitly set
    const finalData = {
      ...formData,
      type: formData.type || formData.label.toLowerCase().replace(/\s+/g, '-') as FunnelComponent['type'],
    };
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <h2 className="text-xl font-semibold text-white mb-6">
        {initialData ? 'Edit Traffic Component' : 'Add New Traffic Component'}
      </h2>

      {/* Component Name (used as Type and Title) */}
      <div>
        <label htmlFor="component-name" className="block text-sm font-medium text-gray-300">
          Component Name
        </label>
        <Input
          id="component-name"
          value={formData.label}
          onChange={(e) => {
            handleChange('label', e.target.value);
            handleDefaultPropsChange('title', e.target.value);
            if (!formData.type) {
              handleChange('type', e.target.value.toLowerCase().replace(/\s+/g, '-') as FunnelComponent['type']);
            }
          }}
          placeholder="Unique name for the component (e.g., facebook-ads)"
          className="mt-1 bg-gray-800 border-gray-600 text-white"
          required
        />
      </div>

      {/* Component Description */}
      <div>
        <label htmlFor="component-description" className="block text-sm font-medium text-gray-300">
          Component Description
        </label>
        <Textarea
          id="component-description"
          value={formData.defaultProps.description || ''}
          onChange={(e) => handleDefaultPropsChange('description', e.target.value)}
          placeholder="Brief description of the component"
          className="mt-1 bg-gray-800 border-gray-600 text-white"
          rows={3}
        />
      </div>

      {/* Component Category */}
      <div>
        <label htmlFor="component-category" className="block text-sm font-medium text-gray-300">
          Component Category
        </label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleChange('category', value)}
        >
          <SelectTrigger className="mt-1 bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600 text-white">
            {MARKETING_CATEGORIES.map((cat) => (
              <SelectItem key={cat.key} value={cat.label} className="hover:bg-gray-700">
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Component Icon */}
        <div>
          <label htmlFor="component-icon" className="block text-sm font-medium text-gray-300">
            Component Icon
          </label>
          <Input
            id="component-icon"
            value={formData.icon || ''} // Access icon from formData root
            onChange={(e) => handleChange('icon', e.target.value)} // Use handleChange for root properties
            placeholder="Single emoji or character (e.g., 🚀)"
            className="mt-1 bg-gray-800 border-gray-600 text-white"
          />
        </div>

        {/* Component Color */}
        <div>
          <label htmlFor="component-color" className="block text-sm font-medium text-gray-300">
            Component Color
          </label>
          <Input
            id="component-color"
            type="color"
            value={formData.color || '#6B7280'} // Access color from formData root
            onChange={(e) => handleChange('color', e.target.value)} // Use handleChange for root properties
            placeholder="Hex color (e.g., #3B82F6)"
            className="mt-1 bg-gray-800 border-gray-600 text-white w-full h-10 p-1"
          />
        </div>
      </div>

      {/* Component Status */}
      <div>
        <label htmlFor="component-status" className="block text-sm font-medium text-gray-300">
          Component Status
        </label>
        <Select
          value={formData.defaultProps.status}
          onValueChange={(value: FunnelComponent['data']['status']) => handleDefaultPropsChange('status', value)}
        >
          <SelectTrigger className="mt-1 bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600 text-white">
            {['draft', 'active', 'inactive', 'test', 'published'].map((status) => (
              <SelectItem key={status} value={status} className="hover:bg-gray-700">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Additional Properties (JSON) */}
      <div>
        <legend className="text-sm font-medium text-gray-300">Additional Properties (JSON)</legend>
        <Textarea
          value={propertiesJson}
          onChange={(e) => handlePropertiesChange(e.target.value)}
          placeholder={'{\n  "api_key": "your_value_here",\n  "another_parameter": true\n}'}
          className="mt-1 bg-gray-800 border-gray-600 text-white font-mono text-xs"
          rows={5}
        />
        {jsonError && <p className="mt-1 text-xs text-red-400">{jsonError}</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="border-gray-600 hover:bg-gray-700">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !!jsonError} className="bg-blue-600 hover:bg-blue-700">
          {isLoading ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Component')}
        </Button>
      </div>
    </form>
  );
}; 