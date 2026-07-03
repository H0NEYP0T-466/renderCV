import { Fragment, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { useResume } from '../../context/ResumeContext';
import type { ResumeData, SectionId } from '../../types';
import { Header } from './sections/Header';
import { Summary } from './sections/Summary';
import { Experience } from './sections/Experience';
import { Education } from './sections/Education';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';
import { Awards } from './sections/Awards';
import './Preview.css';

const PAGE_PX = (297 - 32) * (96 / 25.4);

function getSectionComponent(
  id: SectionId
): ((props: { data: unknown }) => ReactElement | null) | null {
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

interface SectionNode {
  id: SectionId;
  data: unknown;
}

function getDataKey(id: SectionId): keyof ResumeData {
  return id as keyof ResumeData;
}

export function ModernPreview() {
  const { state } = useResume();
  const { data, sections } = state;
  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => a.order - b.order).filter((s) => s.enabled),
    [sections]
  );

  const measureRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<number[][] | null>(null);

  const dataKey = useMemo(() => JSON.stringify(data), [data]);

  const nodes: SectionNode[] = useMemo(() => {
    const result: SectionNode[] = [];
    for (const section of sortedSections) {
      const sectionData = data[getDataKey(section.id)];
      if (!sectionData) continue;
      if (section.id === 'summary' && !(sectionData as string)?.trim()) continue;
      if (Array.isArray(sectionData) && sectionData.length === 0) continue;
      result.push({ id: section.id, data: sectionData });
    }
    return result;
  }, [data, sortedSections]);

  useEffect(() => {
    const host = measureRef.current;
    if (!host) return;

    let cancelled = false;

    const measure = () => {
      if (cancelled || !host) return;
      const kids = Array.from(host.children) as HTMLElement[];
      if (kids.length === 0) {
        setPages([[]]);
        return;
      }

      const headerH = kids[0].getBoundingClientRect().height ?? 0;
      const heights: number[] = [];
      for (let i = 1; i < kids.length; i++) {
        heights.push(kids[i].getBoundingClientRect().height ?? 0);
      }

      const ranges: number[][] = [];
      let currentPage: number[] = [];
      let used = headerH;

      for (let i = 0; i < heights.length; i++) {
        const h = heights[i];
        if (h === 0) continue;
        if (used + h > PAGE_PX && currentPage.length > 0) {
          ranges.push(currentPage);
          currentPage = [i];
          used = h;
        } else {
          currentPage.push(i);
          used += h;
        }
      }
      if (currentPage.length > 0) ranges.push(currentPage);
      if (ranges.length === 0) ranges.push([]);

      setPages(ranges);
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(measure);
    });

    return () => {
      cancelled = true;
    };
  }, [dataKey, nodes]);

  function renderSection(node: SectionNode): ReactElement | null {
    const Component = getSectionComponent(node.id);
    if (!Component) return null;
    return <Component key={node.id} data={node.data} />;
  }

  return (
    <div className="preview-pages">
      <div
        ref={measureRef}
        className="preview-measure"
        aria-hidden="true"
      >
        <Header header={data.header} />
        {nodes.map(renderSection)}
      </div>

      {pages &&
        pages.map((pageIdxArr, pageIdx) => (
          <Fragment key={pageIdx}>
            <div className="preview-page-sizer">
              <div className="preview-page">
                {pageIdx === 0 && <Header header={data.header} />}
                {pageIdxArr.map((nodeIdx) => renderSection(nodes[nodeIdx]))}
              </div>
            </div>
            {pageIdx < pages.length - 1 && (
              <div className="preview-page-break">
                <span>Page {pageIdx + 1} end — continues on page {pageIdx + 2}</span>
              </div>
            )}
          </Fragment>
        ))
      }
    </div>
  );
}
