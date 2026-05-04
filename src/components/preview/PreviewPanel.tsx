import { useResume } from '../../context/ResumeContext';
import { TemplateRenderer } from '../../templates/TemplateRenderer';
import './PreviewPanel.css';

export function PreviewPanel() {
  const { state } = useResume();
  return (
    <div className="preview-panel">
      <TemplateRenderer templateId={state.activeTemplate} />
    </div>
  );
}
