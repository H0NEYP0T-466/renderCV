import { useState, useRef } from 'react';
import { ResumeProvider, useResume } from './context/ResumeContext';
import { EditorPanel } from './components/editor/EditorPanel';
import { PreviewPanel } from './components/preview/PreviewPanel';
import { ExportButton } from './components/export/ExportButton';
import { exampleResume } from './data/exampleResume';
import { FileText, Edit3, Upload, Download, Trash2, Eye } from 'lucide-react';

function AppContent() {
  const { loadResume, resetResume, exportJSON, importJSON } = useResume();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadExample = () => {
    if (confirm('Load example resume? This will replace your current data.')) {
      loadResume(exampleResume);
    }
  };

  const handleClear = () => {
    if (confirm('Clear all resume data? This cannot be undone.')) {
      resetResume();
    }
  };

  const handleExportJSON = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (!importJSON(text)) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <FileText size={24} className="text-blue-600" />
          <h1 className="text-lg font-bold text-gray-900 hidden sm:block">renderCV</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadExample}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Load example resume"
          >
            <Upload size={14} />
            <span className="hidden md:inline">Load Example</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Export as JSON"
          >
            <Download size={14} />
            <span className="hidden md:inline">Export JSON</span>
          </button>
          <button
            onClick={handleImportJSON}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Import from JSON"
          >
            <Upload size={14} />
            <span className="hidden md:inline">Import JSON</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
            title="Clear all data"
          >
            <Trash2 size={14} />
            <span className="hidden md:inline">Clear</span>
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <ExportButton />
        </div>
      </header>

      {/* Mobile/Tablet Tab Bar */}
      <div className="lg:hidden bg-white border-b border-gray-200 flex shrink-0">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            activeTab === 'edit'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Edit3 size={16} />
          Edit
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            activeTab === 'preview'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Eye size={16} />
          Preview
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div
          className={`${
            activeTab === 'edit' ? 'flex' : 'hidden'
          } lg:flex flex-col w-full lg:w-[45%] border-r border-gray-200 bg-gray-50`}
        >
          <EditorPanel />
        </div>
        <div
          className={`${
            activeTab === 'preview' ? 'flex' : 'hidden'
          } lg:flex flex-col w-full lg:w-[55%] bg-gray-200`}
        >
          <PreviewPanel />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ResumeProvider>
      <AppContent />
    </ResumeProvider>
  );
}
