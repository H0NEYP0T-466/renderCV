import { useLayoutEffect, useMemo, useRef, useState, type ReactElement } from 'react';
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

// Unscaled A4 usable content height.
// A4 = 297mm tall. Page padding is 16mm top + 16mm bottom.
// Usable height = 265mm = 265 * (96 / 25.4) ≈ 998px.
const PAGE_PX = (297 - 32) * (96 / 25.4);

function getSectionComponent(id: SectionId): ((props: { data: unknown }) => ReactElement | null) | null {
  switch (id) {
    case 'summary': return ({ data }) => <Summary summary={data as string} />;
    case 'experience': return ({ data }) => <Experience experience={data as ResumeData['experience']} />;
    case 'education': return ({ data }) => <Education education={data as ResumeData['education']} />;
    case 'projects': return ({ data }) => <Projects projects={data as ResumeData['projects']} />;
    case 'skills': return ({ data }) => <Skills skills={data as ResumeData['skills']} />;
    case 'awards': return ({ data }) => <Awards awards={data as ResumeData['awards']} />;
    default: return null;
  }
}

function getDataKey(id: SectionId): keyof ResumeData {
  return id as keyof ResumeData;
}

interface SectionNode {
  id: SectionId;
  data: unknown;
}

interface MeasuredSection {
  node: SectionNode;
  height: number;
}

export function ModernPreview() {
  const { state } = useResume();
  const { data, sections } = state;
  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => a.order - b.order).filter((s) => s.enabled),
    [sections]
  );
  const measureRef = useRef<HTMLDivElement>(null);
  const [pageRanges, setPageRanges] = useState<{ start: number; end: number }[] | null>(null);

  const nodes: SectionNode[] = [];
  for (const section of sortedSections) {
    const dataKey = getDataKey(section.id);
    const sectionData = data[dataKey];
    if (!sectionData) continue;
    if (section.id === 'summary' && !(sectionData as string)?.trim()) continue;
    if (Array.isArray(sectionData) && sectionData.length === 0) continue;
    nodes.push({ id: section.id, data: sectionData });
  }

  useLayoutEffect(() => {
    const host = measureRef.current;
    if (!host) return;
    // Wait one more frame so layout has settled after React commit.
    const raf = requestAnimationFrame(() => {
      const kids = Array.from(host.children) as HTMLElement[];
      // children[0] = header, children[1..] = sections
      const headerH = kids[0]?.getBoundingClientRect().height ?? 0;
      const measured: MeasuredSection[] = nodes.map((node, idx) => ({
        node,
        height: (kids[idx + 1]?.getBoundingClientRect().height) ?? 0,
      }));

      const ranges: { start: number; end: number }[] = [];
      let rangeStart = 0;
      let used = headerH;

      for (let i = 0; i < measured.length; i++) {
        const h = measured[i].height;
        if (h === 0) continue;
        if (used + h > PAGE_PX && i > rangeStart) {
          // Break BEFORE this section — current page holds sections [rangeStart, i)
          ranges.push({ start: rangeStart, end: i });
          rangeStart = i;
          used = h;
        } else {
          used += h;
        }
      }
      if (rangeStart < measured.length) {
        ranges.push({ start: rangeStart, end: measured.length });
      }
      setPageRanges(ranges);
    });
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, sortedSections.length, nodes.length]);

  function renderSection(node: SectionNode) {
    const Component = getSectionComponent(node.id);
    if (!Component) return null;
    return <Component key={node.id} data={node.data} />;
  }

  // If measurement hasn't populated yet, render only the offscreen measure block
  // so the user never sees an intermediate broken state.
  if (!pageRanges) {
    return (
      <div ref={measureRef} data-preview-measure="" aria-hidden="true">
        <Header header={data.header} />
        {nodes.map(renderSection)}
      </div>
    );
  }

  return (
    <div className="preview-pages">
      {pageRanges.map((range, pageIdx) => (
        <div className="preview-page" key={pageIdx}>
          {pageIdx === 0 && <Header header={data.header} />}
          {nodes.slice(range.start, range.end).map(renderSection)}
        </div>
      ))}
    </div>
  );
}
