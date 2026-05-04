import { modernConfig } from '../config';
import './section-shared.css';

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

interface ExperienceProps {
  experience: ExperienceItem[];
}

export function Experience({ experience }: ExperienceProps) {
  if (!experience.length) return null;
  const accent = modernConfig.accentColor;
  const fs = modernConfig.fontSize;

  return (
    <div className="resume-section">
      <h2 className="resume-section__title" style={{ fontSize: fs.section, color: accent, borderColor: accent }}>
        Experience
      </h2>
      {experience.map((exp) => (
        <div key={exp.id} className="resume-section__item">
          <div className="resume-section__header">
            <div>
              <span className="resume-section__role" style={{ fontSize: fs.body + 1, color: '#111827' }}>
                {exp.role}
              </span>
              <span className="resume-section__company"> — {exp.company}</span>
            </div>
            <span className="resume-section__date">{exp.startDate} – {exp.endDate}</span>
          </div>
          <p className="resume-section__location">{exp.location}</p>
          {exp.bullets.length > 0 && (
            <ul className="resume-section__bullets">
              {exp.bullets.filter((b) => b.trim()).map((bullet, i) => (
                <li key={i} style={{ fontSize: fs.body - 0.5, color: '#374151' }}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
