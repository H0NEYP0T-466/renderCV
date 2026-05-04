import { pdf } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { ResumeDocument } from '../../templates/modern/ResumeDocument';

export function ExportButton() {
  const { state } = useResume();

  const handleExport = async () => {
    try {
      const blob = await pdf(
        <ResumeDocument data={state.data} sections={state.sections} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const name = state.data.header.name.trim() || 'resume';
      link.href = url;
      link.download = `${name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Failed to export PDF. Please try again.');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
      aria-label="Export resume as PDF"
    >
      <Download size={16} />
      <span className="hidden sm:inline">Export PDF</span>
    </button>
  );
}
