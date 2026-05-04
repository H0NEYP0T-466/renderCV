import { modernConfig } from '../config';
import './section-shared.css';

interface SkillGroup {
  category: string;
  items: string[];
}

interface SkillsProps {
  skills: SkillGroup[];
}

export function Skills({ skills }: SkillsProps) {
  const validGroups = skills.filter((g) => g.category && g.items.length > 0);
  if (!validGroups.length) return null;
  const accent = modernConfig.accentColor;
  const fs = modernConfig.fontSize;

  return (
    <div className="resume-section">
      <h2 className="resume-section__title" style={{ fontSize: fs.section, color: accent, borderColor: accent }}>
        Skills
      </h2>
      {validGroups.map((group, i) => (
        <div key={i} className="resume-skill-row">
          <span className="resume-skill-category" style={{ fontSize: fs.body, color: '#1f2937' }}>
            {group.category}:{' '}
          </span>
          <span className="resume-skill-items" style={{ fontSize: fs.body, color: '#4b5563' }}>
            {group.items.join(', ')}
          </span>
        </div>
      ))}
    </div>
  );
}
