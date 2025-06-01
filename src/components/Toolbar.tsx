import React from 'react';

interface ToolbarProps {
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onClear: () => void;
  projectName: string;
  onProjectNameChange: (name: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  onLoad,
  onExport,
  onClear,
  projectName,
  onProjectNameChange
}) => {
  return (
    <div className="h-12 bg-black border-b border-gray-800 flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded px-3 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600"
          placeholder="Project Name"
        />
      </div>

      {/* Center Section */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onSave}
          className="bg-white hover:bg-gray-200 text-black px-3 py-1 rounded text-sm font-medium transition-colors"
        >
          Save
        </button>
        <button
          onClick={onLoad}
          className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
        >
          Load
        </button>
        <button
          onClick={onExport}
          className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
        >
          Export
        </button>
        <button
          onClick={onClear}
          className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        <div className="text-gray-400 text-xs">
          Components: <span className="text-white font-medium">0</span>
        </div>
      </div>
    </div>
  );
};
