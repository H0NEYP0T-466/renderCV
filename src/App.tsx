import { useState, useRef } from 'react';
import { ResumeProvider, useResume } from './context/ResumeContext';
import { EditorPanel } from './components/editor/EditorPanel';
import { PreviewPanel } from './components/preview/PreviewPanel';
import { ExportButton } from './components/export/ExportButton';
import { exampleResume } from './data/exampleResume';
import { FileText, Edit3, Upload, Download, Trash2, Eye } from 'lucide-react';
import './App.css';

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
    <div className="app-layout">
      <header className="app-header">
        <div className="header-left">
          <FileText size={24} className="header-logo" />
          <h1 className="header-title">renderCV</h1>
        </div>
        <div className="header-actions">
          <button onClick={handleLoadExample} className="header-btn" title="Load example resume">
            <Upload size={14} />
            <span className="header-btn__label">Load Example</span>
          </button>
          <button onClick={handleExportJSON} className="header-btn" title="Export as JSON">
            <Download size={14} />
            <span className="header-btn__label">Export JSON</span>
          </button>
          <button onClick={handleImportJSON} className="header-btn" title="Import from JSON">
            <Upload size={14} />
            <span className="header-btn__label">Import JSON</span>
          </button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden-input" />
          <button onClick={handleClear} className="header-btn header-btn--danger" title="Clear all data">
            <Trash2 size={14} />
            <span className="header-btn__label">Clear</span>
          </button>
          <div className="header-divider" />
          <ExportButton />
        </div>
      </header>

      <div className="tab-bar">
        <button
          onClick={() => setActiveTab('edit')}
          className={`tab-btn ${activeTab === 'edit' ? 'tab-btn--active' : ''}`}
        >
          <Edit3 size={16} />
          Edit
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`tab-btn ${activeTab === 'preview' ? 'tab-btn--active' : ''}`}
        >
          <Eye size={16} />
          Preview
        </button>
      </div>

      <div className="app-main">
        <div className={`editor-pane ${activeTab !== 'edit' ? 'pane--hidden-mobile' : ''}`}>
          <EditorPanel />
        </div>
        <div className={`preview-pane ${activeTab !== 'preview' ? 'pane--hidden-mobile' : ''}`}>
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
