import { modernConfig } from '../config';

interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

interface AwardsProps {
  awards: AwardItem[];
}

export function Awards({ awards }: AwardsProps) {
  if (!awards.length) return null;
  const accent = modernConfig.accentColor;

  return (
    <div className="mb-4">
      <h2
        className="font-bold uppercase tracking-wider mb-2 pb-1 border-b-2"
        style={{ fontSize: modernConfig.fontSize.section, color: accent, borderColor: accent }}
      >
        Awards
      </h2>
      {awards.map((award) => (
        <div key={award.id} className="mb-2 last:mb-0">
          <div className="flex justify-between items-baseline flex-wrap gap-x-2">
            <span className="font-bold text-gray-900" style={{ fontSize: modernConfig.fontSize.body + 1 }}>
              {award.title}
            </span>
            <span className="text-gray-500 text-xs whitespace-nowrap">{award.date}</span>
          </div>
          <p className="text-gray-600 text-xs">
            {award.issuer}
            {award.description && ` — ${award.description}`}
          </p>
        </div>
      ))}
    </div>
  );
}
