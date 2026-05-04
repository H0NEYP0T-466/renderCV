import { modernConfig } from '../config';

interface ProjectItem {
  id: string;
  name: string;
  link?: string;
  startDate: string;
  endDate: string;
  description: string;
  techStack?: string[];
}

interface ProjectsProps {
  projects: ProjectItem[];
}

export function Projects({ projects }: ProjectsProps) {
  if (!projects.length) return null;
  const accent = modernConfig.accentColor;

  return (
    <div className="mb-4">
      <h2
        className="font-bold uppercase tracking-wider mb-2 pb-1 border-b-2"
        style={{ fontSize: modernConfig.fontSize.section, color: accent, borderColor: accent }}
      >
        Projects
      </h2>
      {projects.map((proj) => (
        <div key={proj.id} className="mb-3 last:mb-0">
          <div className="flex justify-between items-baseline flex-wrap gap-x-2">
            <span className="font-bold text-gray-900" style={{ fontSize: modernConfig.fontSize.body + 1 }}>
              {proj.name}
              {proj.link && (
                <span className="font-normal text-gray-500"> ({proj.link})</span>
              )}
            </span>
            <span className="text-gray-500 text-xs whitespace-nowrap">
              {proj.startDate} – {proj.endDate}
            </span>
          </div>
          <p className="text-gray-700 mb-1" style={{ fontSize: modernConfig.fontSize.body }}>
            {proj.description}
          </p>
          {proj.techStack && proj.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {proj.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: accent + '12', color: accent, fontSize: modernConfig.fontSize.body - 1.5 }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
