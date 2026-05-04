import type { ReactElement } from 'react';
import { useResume } from '../../context/ResumeContext';
import type { ResumeData, SectionId } from '../../types';
import { modernConfig } from './config';
import { Header } from './sections/Header';
import { Summary } from './sections/Summary';
import { Experience } from './sections/Experience';
import { Education } from './sections/Education';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';
import { Awards } from './sections/Awards';

function getSectionComponent(id: SectionId): ((props: { data: unknown }) => ReactElement | null) | null {
  switch (id) {
    case 'summary':
      return ({ data }) => <Summary summary={data as string} />;
    case 'experience':
      return ({ data }) => <Experience experience={data as ResumeData['experience']} />;
    case 'education':
      return ({ data }) => <Education education={data as ResumeData['education']} />;
    case 'projects':
      return ({ data }) => <Projects projects={data as ResumeData['projects']} />;
    case 'skills':
      return ({ data }) => <Skills skills={data as ResumeData['skills']} />;
    case 'awards':
      return ({ data }) => <Awards awards={data as ResumeData['awards']} />;
    default:
      return null;
  }
}

function getDataKey(id: SectionId): keyof ResumeData {
  return id as keyof ResumeData;
}

export function ModernPreview() {
  const { state } = useResume();
  const { data, sections } = state;
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div
      className="bg-white shadow-lg mx-auto"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '16mm',
        fontFamily: modernConfig.fontFamily,
        transform: 'scale(0.55)',
        transformOrigin: 'top center',
      }}
    >
      <Header header={data.header} />
      {sortedSections
        .filter((s) => s.enabled)
        .map((section) => {
          const Component = getSectionComponent(section.id);
          if (!Component) return null;
          const dataKey = getDataKey(section.id);
          const sectionData = data[dataKey];
          return <Component key={section.id} data={sectionData} />;
        })}
    </div>
  );
}
