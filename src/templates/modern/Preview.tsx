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

/*
 * A4 usable content height (CSS px at 96 DPI):
 *   A4 = 297mm tall, minus 16mm top + 16mm bottom padding = 265mm usable
 *   265mm * (96 / 25.4) ≈ 998px
 * Sections are summed against this budget; the header occupies part of page 0.
 */
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

  const nodes: SectionNode[] = [];
  for (const section of sortedSections) {
    const sectionData = data[getDataKey(section.id)];
    if (!sectionData) continue;
    if (section.id === 'summary' && !(sectionData as string)?.trim()) continue;
    if (Array.isArray(sectionData) && sectionData.length === 0) continue;
    nodes.push({ id: section.id, data: sectionData });
  }

  useEffect(() => {
    const host = measureRef.current;
    if (!host) return;

    let cancelled = false;

    const measure = () => {
      if (cancelled || !host) return;
      const kids = Array.from(host.children) as HTMLElement[];
      if (kids.length === 0) return;

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

    // Double-RAF: waits for the browser to flush layout of the measurement
    // surface — one RAF fires too early in some browsers.
    requestAnimationFrame(() => {
      requestAnimationFrame(measure);
    });

    return () => {
      cancelled = true;
    };
  }, [data, sortedSections.length, nodes.length]);

  function renderSection(node: SectionNode): ReactElement | null {
    const Component = getSectionComponent(node.id);
    if (!Component) return null;
    return <Component key={node.id} data={node.data} />;
  }

  // Measurement phase — render offscreen, hidden, so layout produces real boxes.
  // We never commit this to the visible tree (aria-hidden + visibility:hidden).
  if (!pages) {
    return (
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          top: 0,
          width: '210mm',
          padding: '16mm',
          boxSizing: 'border-box',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontSize: '10pt',
          lineHeight: 1.4,
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <Header header={data.header} />
        {nodes.map(renderSection)}
      </div>
    );
  }

  return (
    <div className="preview-pages">
      {pages.map((pageIdxArr, pageIdx) => (
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
      ))}
    </div>
  );
}
