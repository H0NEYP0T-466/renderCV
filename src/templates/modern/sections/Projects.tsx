import { modernConfig } from '../config';
import './section-shared.css';

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
  const fs = modernConfig.fontSize;

  return (
    <div className="resume-section">
      <h2 className="resume-section__title" style={{ fontSize: fs.section, color: accent, borderColor: accent }}>
        Projects
      </h2>
      {projects.map((proj) => (
        <div key={proj.id} className="resume-section__item">
          <div className="resume-section__header">
            <span className="resume-section__role" style={{ fontSize: fs.body + 1, color: '#111827' }}>
              {proj.name}
              {proj.link && <span style={{ fontWeight: 400, color: '#6b7280' }}> ({proj.link})</span>}
            </span>
            <span className="resume-section__date">{proj.startDate} – {proj.endDate}</span>
          </div>
          <p className="resume-section__desc" style={{ fontSize: fs.body, color: '#374151' }}>{proj.description}</p>
          {proj.techStack && proj.techStack.length > 0 && (
            <div className="resume-section__tags">
              {proj.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="resume-section__tag"
                  style={{ backgroundColor: accent + '12', color: accent, fontSize: fs.body - 1.5 }}
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
