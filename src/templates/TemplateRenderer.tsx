import { ModernPreview } from './modern/Preview';

interface TemplateRendererProps {
  templateId: string;
}

export function TemplateRenderer({ templateId }: TemplateRendererProps) {
  switch (templateId) {
    case 'modern':
    default:
      return <ModernPreview />;
  }
}
