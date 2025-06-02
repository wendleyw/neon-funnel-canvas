import React from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

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
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg text-white">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            placeholder="Enter component title..."
            required
            className="bg-gray-800/70 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder="Describe the component functionality..."
            rows={3}
            className="bg-gray-800/70 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">URL/Link</label>
          <Input
            value={formData.url}
            onChange={(e) => onInputChange('url', e.target.value)}
            placeholder="https://example.com"
            type="url"
            className="bg-gray-800/70 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Status</label>
          <Select value={formData.status} onValueChange={(value) => onInputChange('status', value)}>
            <SelectTrigger className="bg-gray-800/70 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="draft" className="text-white">Draft</SelectItem>
              <SelectItem value="active" className="text-white">Active</SelectItem>
              <SelectItem value="test" className="text-white">Test</SelectItem>
              <SelectItem value="published" className="text-white">Published</SelectItem>
              <SelectItem value="inactive" className="text-white">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}; 