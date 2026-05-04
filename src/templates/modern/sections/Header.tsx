import { modernConfig } from '../config';

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
    <div className="mb-4">
      <h1
        className="font-bold mb-1"
        style={{ fontSize: modernConfig.fontSize.header, color: '#1a1a1a', lineHeight: 1.1 }}
      >
        {header.name || 'Your Name'}
      </h1>
      <p
        className="mb-2"
        style={{ fontSize: modernConfig.fontSize.section, color: accent, fontWeight: 600 }}
      >
        {header.title || 'Job Title'}
      </p>
      <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-gray-600 mb-2">
        {contactParts.map((part, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span style={{ color: accent }}>◇</span>}
            {part}
          </span>
        ))}
      </div>
      {header.availability.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {header.availability.map((tag, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
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
