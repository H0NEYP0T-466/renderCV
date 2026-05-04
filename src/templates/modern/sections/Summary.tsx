import { modernConfig } from '../config';
import './section-shared.css';

interface SummaryProps {
  summary: string;
}

export function Summary({ summary }: SummaryProps) {
  if (!summary) return null;
  const accent = modernConfig.accentColor;
  const fs = modernConfig.fontSize;

  return (
    <div className="resume-section">
      <h2
        className="resume-section__title"
        style={{ fontSize: fs.section, color: accent, borderColor: accent }}
      >
        Summary
      </h2>
      <p style={{ fontSize: fs.body, color: '#374151', lineHeight: 1.6 }}>
        {summary}
      </p>
    </div>
  );
}
