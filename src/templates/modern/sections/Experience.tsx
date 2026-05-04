import { modernConfig } from '../config';

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

  return (
    <div className="mb-4">
      <h2
        className="font-bold uppercase tracking-wider mb-2 pb-1 border-b-2"
        style={{ fontSize: modernConfig.fontSize.section, color: accent, borderColor: accent }}
      >
        Experience
      </h2>
      {experience.map((exp) => (
        <div key={exp.id} className="mb-3 last:mb-0">
          <div className="flex justify-between items-baseline flex-wrap gap-x-2">
            <div>
              <span className="font-bold text-gray-900" style={{ fontSize: modernConfig.fontSize.body + 1 }}>
                {exp.role}
              </span>
              <span className="text-gray-600"> — {exp.company}</span>
            </div>
            <span className="text-gray-500 text-xs whitespace-nowrap">
              {exp.startDate} – {exp.endDate}
            </span>
          </div>
          <p className="text-gray-500 text-xs mb-1">{exp.location}</p>
          {exp.bullets.length > 0 && (
            <ul className="list-disc list-outside ml-4 space-y-0.5">
              {exp.bullets
                .filter((b) => b.trim())
                .map((bullet, i) => (
                  <li key={i} className="text-gray-700" style={{ fontSize: modernConfig.fontSize.body - 0.5 }}>
                    {bullet}
                  </li>
                ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
