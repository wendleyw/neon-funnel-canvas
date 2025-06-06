import React from 'react';
import { Input } from '@/features/shared/ui/input';
import { Textarea } from '@/features/shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/features/shared/ui/select';

interface BasicInfoFormProps {
  formData: {
    title: string;
    description: string;
    url: string;
    status: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Title</label>
        <div className="modal-form-field">
          <Input
            value={formData.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            placeholder="Enter component title..."
            required
            className="modal-form-input"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Description</label>
        <div className="modal-form-field">
          <Textarea
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder="Describe the component functionality..."
            rows={3}
            className="modal-form-textarea"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">URL/Link</label>
        <div className="modal-form-field">
          <Input
            value={formData.url}
            onChange={(e) => onInputChange('url', e.target.value)}
            placeholder="https://example.com"
            type="url"
            className="modal-form-input"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Status</label>
        <div className="modal-form-field">
          <Select value={formData.status} onValueChange={(value) => onInputChange('status', value)}>
            <SelectTrigger className="modal-form-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="draft" className="text-white hover:bg-gray-700">Draft</SelectItem>
              <SelectItem value="active" className="text-white hover:bg-gray-700">Active</SelectItem>
              <SelectItem value="test" className="text-white hover:bg-gray-700">Test</SelectItem>
              <SelectItem value="published" className="text-white hover:bg-gray-700">Published</SelectItem>
              <SelectItem value="inactive" className="text-white hover:bg-gray-700">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}; 