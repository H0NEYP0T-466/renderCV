import { useResume } from '../../context/ResumeContext';
import { TemplateRenderer } from '../../templates/TemplateRenderer';

export function PreviewPanel() {
  const { state } = useResume();

  return (
    <div className="h-full overflow-y-auto bg-gray-200 flex justify-center py-6">
      <TemplateRenderer templateId={state.activeTemplate} />
    </div>
  );
}
