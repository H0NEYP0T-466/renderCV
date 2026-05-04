import { modernConfig } from '../config';
import './section-shared.css';

interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  gpa?: string;
  startDate: string;
  endDate: string;
}

interface EducationProps {
  education: EducationItem[];
}

export function Education({ education }: EducationProps) {
  if (!education.length) return null;
  const accent = modernConfig.accentColor;
  const fs = modernConfig.fontSize;

  return (
    <div className="resume-section">
      <h2 className="resume-section__title" style={{ fontSize: fs.section, color: accent, borderColor: accent }}>
        Education
      </h2>
      {education.map((edu) => (
        <div key={edu.id} className="resume-section__item" style={{ marginBottom: 8 }}>
          <div className="resume-section__header">
            <span className="resume-section__degree" style={{ fontSize: fs.body + 1, color: '#111827' }}>
              {edu.degree}
            </span>
            <span className="resume-section__date">{edu.startDate} – {edu.endDate}</span>
          </div>
          <p className="resume-section__school">
            {edu.school}{edu.location ? ` — ${edu.location}` : ''}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}
          </p>
        </div>
      ))}
    </div>
  );
}
