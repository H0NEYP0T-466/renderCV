import { modernConfig } from '../config';

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

  return (
    <div className="mb-4">
      <h2
        className="font-bold uppercase tracking-wider mb-2 pb-1 border-b-2"
        style={{ fontSize: modernConfig.fontSize.section, color: accent, borderColor: accent }}
      >
        Education
      </h2>
      {education.map((edu) => (
        <div key={edu.id} className="mb-2 last:mb-0">
          <div className="flex justify-between items-baseline flex-wrap gap-x-2">
            <span className="font-bold text-gray-900" style={{ fontSize: modernConfig.fontSize.body + 1 }}>
              {edu.degree}
            </span>
            <span className="text-gray-500 text-xs whitespace-nowrap">
              {edu.startDate} – {edu.endDate}
            </span>
          </div>
          <p className="text-gray-600 text-xs">
            {edu.school}{edu.location ? ` — ${edu.location}` : ''}
            {edu.gpa ? ` | GPA: ${edu.gpa}` : ''}
          </p>
        </div>
      ))}
    </div>
  );
}
