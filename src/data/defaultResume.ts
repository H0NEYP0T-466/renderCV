import type { ResumeData, SectionConfig, SectionId } from '../types';

export const defaultResume: ResumeData = {
  header: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    availability: [],
  },
  summary: '',
  experience: [],
  education: [],
  projects: [],
  skills: [],
  awards: [],
};

export const defaultSections: SectionConfig[] = [
  { id: 'summary', label: 'Summary', enabled: true, order: 0 },
  { id: 'experience', label: 'Experience', enabled: true, order: 1 },
  { id: 'education', label: 'Education', enabled: true, order: 2 },
  { id: 'projects', label: 'Projects', enabled: true, order: 3 },
  { id: 'skills', label: 'Skills', enabled: true, order: 4 },
  { id: 'awards', label: 'Awards', enabled: true, order: 5 },
];

export const sectionIds: SectionId[] = [
  'summary',
  'experience',
  'education',
  'projects',
  'skills',
  'awards',
];

let idCounter = 0;
export function generateId(prefix: string = 'item'): string {
  return `${prefix}_${Date.now()}_${++idCounter}`;
}
