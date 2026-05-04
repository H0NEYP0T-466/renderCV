import { modernConfig } from '../config';
import './Header.css';

interface HeaderData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  availability: string[];
}

interface HeaderProps {
  header: HeaderData;
}

export function Header({ header }: HeaderProps) {
  const accent = modernConfig.accentColor;
  const contactParts = [header.email, header.phone, header.location, header.linkedin, header.github, header.website].filter(Boolean);

  return (
    <div className="resume-header">
      <h1 className="resume-header__name" style={{ fontSize: modernConfig.fontSize.header, color: '#1a1a1a' }}>
        {header.name || 'Your Name'}
      </h1>
      <p className="resume-header__title" style={{ fontSize: modernConfig.fontSize.section, color: accent }}>
        {header.title || 'Job Title'}
      </p>
      <div className="resume-header__contacts">
        {contactParts.map((part, i) => (
          <span key={i} className="resume-header__contact">
            {i > 0 && <span className="resume-header__diamond" style={{ color: accent }}>◇</span>}
            {part}
          </span>
        ))}
      </div>
      {header.availability.length > 0 && (
        <div className="resume-header__availability">
          {header.availability.map((tag, i) => (
            <span
              key={i}
              className="resume-header__tag"
              style={{ backgroundColor: accent + '18', color: accent }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
