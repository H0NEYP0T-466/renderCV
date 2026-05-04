import { modernConfig } from '../config';

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

  return (
    <div className="mb-4">
      <h2
        className="font-bold uppercase tracking-wider mb-2 pb-1 border-b-2"
        style={{ fontSize: modernConfig.fontSize.section, color: accent, borderColor: accent }}
      >
        Skills
      </h2>
      {validGroups.map((group, i) => (
        <div key={i} className="mb-1.5">
          <span className="font-semibold text-gray-800" style={{ fontSize: modernConfig.fontSize.body }}>
            {group.category}:{' '}
          </span>
          <span className="text-gray-600" style={{ fontSize: modernConfig.fontSize.body }}>
            {group.items.join(', ')}
          </span>
        </div>
      ))}
    </div>
  );
}
