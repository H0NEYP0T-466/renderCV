import { modernConfig } from '../config';

interface SummaryProps {
  summary: string;
}

export function Summary({ summary }: SummaryProps) {
  if (!summary) return null;
  const accent = modernConfig.accentColor;

  return (
    <div className="mb-4">
      <h2
        className="font-bold uppercase tracking-wider mb-1.5 pb-1 border-b-2"
        style={{ fontSize: modernConfig.fontSize.section, color: accent, borderColor: accent }}
      >
        Summary
      </h2>
      <p className="text-gray-700 leading-relaxed" style={{ fontSize: modernConfig.fontSize.body }}>
        {summary}
      </p>
    </div>
  );
}
