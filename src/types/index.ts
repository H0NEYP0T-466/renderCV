export interface ResumeData {
  header: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
    availability: string[];
  };
  summary?: string;
  experience: {
    id: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }[];
  education: {
    id: string;
    degree: string;
    school: string;
    location: string;
    gpa?: string;
    startDate: string;
    endDate: string;
  }[];
  projects: {
    id: string;
    name: string;
    link?: string;
    startDate: string;
    endDate: string;
    description: string;
    techStack?: string[];
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  awards: {
    id: string;
    title: string;
    issuer: string;
    date: string;
    description?: string;
  }[];
}

export interface SectionConfig {
  id: SectionId;
  label: string;
  enabled: boolean;
  order: number;
}

export type SectionId =
  | 'summary'
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'awards';

export interface TemplateConfig {
  name: string;
  description: string;
  accentColor: string;
  fontFamily: string;
  fontSize: {
    base: number;
    header: number;
    section: number;
    body: number;
  };
  layout: string;
  sidebarWidth: string;
}
