import { modernConfig } from '../config';
import './section-shared.css';

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
  const fs = modernConfig.fontSize;

  return (
    <div className="resume-section">
      <h2 className="resume-section__title" style={{ fontSize: fs.section, color: accent, borderColor: accent }}>
        Awards
      </h2>
      {awards.map((award) => (
        <div key={award.id} className="resume-section__item" style={{ marginBottom: 8 }}>
          <div className="resume-award-header">
            <span className="resume-section__role" style={{ fontSize: fs.body + 1, color: '#111827' }}>
              {award.title}
            </span>
            <span className="resume-section__date">{award.date}</span>
          </div>
          <p className="resume-section__location">
            {award.issuer}{award.description && ` — ${award.description}`}
          </p>
        </div>
      ))}
    </div>
  );
}
