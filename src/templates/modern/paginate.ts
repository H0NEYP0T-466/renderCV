import type { ResumeData, SectionConfig, SectionId } from '../../types';

export interface SectionNode {
  id: SectionId;
  data: unknown;
}

// A4 = 842.9pt. Page padding = 28+28 = 56pt. Usable = 786.9pt.
export const PAGE_LIMIT_PT = 780;

function getDataKey(id: SectionId): keyof ResumeData {
  return id as keyof ResumeData;
}

// marginTop(6) + text(~17pt) + paddingBottom(2) + marginBottom(4) = 29pt
const SECTION_TITLE_PT = 29;

function sectionEstimatePt(id: SectionId, data: unknown): number {
  switch (id) {
    case 'summary': {
      const text = (data as string)?.trim() ?? '';
      if (!text) return 0;
      const lines = Math.max(1, Math.ceil(text.length / 70));
      return SECTION_TITLE_PT + lines * 15;
    }
    case 'experience': {
      const list = (data as ResumeData['experience']).filter((e) => e.company || e.role);
      if (list.length === 0) return 0;
      let total = SECTION_TITLE_PT;
      for (let i = 0; i < list.length; i++) {
        const bulletCount = list[i].bullets.filter((b) => b.trim()).length;
        // header(15) + location(13) + bullets(12 each) + marginBottom(4)
        total += 15 + 13 + bulletCount * 12 + 4;
      }
      total -= 4;
      return total;
    }
    case 'education': {
      const list = data as ResumeData['education'];
      if (list.length === 0) return 0;
      return SECTION_TITLE_PT + list.length * 28 - 4;
    }
    case 'projects': {
      const list = data as ResumeData['projects'];
      if (list.length === 0) return 0;
      return SECTION_TITLE_PT + list.length * 43 - 4;
    }
    case 'skills': {
      const validGroups = (data as ResumeData['skills']).filter(
        (g: { category: string; items: string[] }) => g.category && g.items.length > 0
      );
      if (validGroups.length === 0) return 0;
      return SECTION_TITLE_PT + validGroups.length * 15 - 2;
    }
    case 'awards': {
      const list = data as ResumeData['awards'];
      if (list.length === 0) return 0;
      return SECTION_TITLE_PT + list.length * 28 - 3;
    }
    default:
      return 0;
  }
}

export function headerEstimatePt(header: ResumeData['header']): number {
  const base = 28 + 34 + 12 + 17 + 6 + 14 + 6;
  return header.availability.length > 0 ? base + 6 + 18 : base;
}

export function splitIntoPages(data: ResumeData, sections: SectionConfig[]): SectionNode[][] {
  const sortedSections = [...sections]
    .sort((a, b) => a.order - b.order)
    .filter((s) => s.enabled);

  const nodes: SectionNode[] = [];
  for (const section of sortedSections) {
    const sectionData = data[getDataKey(section.id)];
    if (!sectionData) continue;
    if (section.id === 'summary' && !(sectionData as string)?.trim()) continue;
    if (Array.isArray(sectionData) && sectionData.length === 0) continue;
    nodes.push({ id: section.id, data: sectionData });
  }

  if (nodes.length === 0) return [[]];

  const headerPt = headerEstimatePt(data.header);

  const pages: SectionNode[][] = [];
  let currentPage: SectionNode[] = [];
  let used = headerPt;

  for (let i = 0; i < nodes.length; i++) {
    const est = sectionEstimatePt(nodes[i].id, nodes[i].data);
    if (est === 0) continue;

    if (used + est > PAGE_LIMIT_PT && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [nodes[i]];
      used = est;
    } else {
      currentPage.push(nodes[i]);
      used += est;
    }
  }

  if (currentPage.length > 0) pages.push(currentPage);
  if (pages.length === 0) return [[]];

  return pages;
}
