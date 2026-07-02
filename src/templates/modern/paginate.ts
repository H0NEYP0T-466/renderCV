import type { ResumeData, SectionConfig, SectionId } from '../../types';

export interface SectionNode {
  id: SectionId;
  data: unknown;
}

// Content budget inside one A4 page (excluding top+bottom padding).
// Shared by DOM preview (converted to px) and PDF export (kept in pt).
// We work in pt everywhere internally; Preview.tsx multiplies by 72/96 when
// comparing against DOM measurements.
// A4 = 842.9pt tall. With page padding (28pt top + 28pt bottom = 56pt) and a
// small safety margin to avoid float-overflow we land on 750pt usable height.
export const PAGE_LIMIT_PT = 750;

function getDataKey(id: SectionId): keyof ResumeData {
  return id as keyof ResumeData;
}

function sectionEstimatePt(id: SectionId, data: unknown): number {
  switch (id) {
    case 'summary': {
      const text = (data as string)?.trim() ?? '';
      if (!text) return 0;
      const lines = Math.max(1, Math.ceil(text.length / 85));
      // section title (~30pt) + each text line (~15pt)
      return 30 + lines * 15;
    }
    case 'experience': {
      const list = (data as ResumeData['experience']).filter((e) => e.company || e.role);
      let total = 0;
      for (const exp of list) {
        // role line ~20pt + date/location ~14pt + bullets ~14pt each
        total += 20 + exp.bullets.filter((b) => b.trim()).length * 14;
      }
      return total;
    }
    case 'education': {
      const list = (data as ResumeData['education']);
      // degree line + school/location ~44pt per entry
      return list.length * 44;
    }
    case 'projects': {
      const list = (data as ResumeData['projects']);
      let total = 0;
      for (const p of list) total += 30 + (p.techStack?.length ?? 0) * 12;
      return total;
    }
    case 'skills': {
      const validGroups = (data as ResumeData['skills']).filter(
        (g) => g.category && g.items.length > 0
      );
      // category category row ~22pt each
      return validGroups.length * 22;
    }
    case 'awards': {
      const list = (data as ResumeData['awards']);
      // title line + issuer line ~44pt each
      return list.length * 44;
    }
    default:
      return 0;
  }
}

export function headerEstimatePt(header: ResumeData['header']): number {
  // Page top padding (28pt) + name (~24pt font = ~30pt box) +
  // spacers between name/title/contacts (~18pt total) +
  // title (~12pt font = ~16pt box) + contacts row (~14pt) +
  // header block-to-section gap (~6pt).
  // Availability tags (~18pt) are NOT pre-paid — they live on page 0 as
  // additional content, only added to the estimate when present.
  const base = 28 + 30 + 18 + 16 + 14 + 6;
  return header.availability.length > 0 ? base + 18 : base;
}

/**
 * Split resume sections into pages using the same logic for both DOM preview
 * and PDF export. Returns an array of page-content arrays; the header is
 * rendered on page 0 by the consumer (not included here).
 */
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
