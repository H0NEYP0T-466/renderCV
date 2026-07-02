import { Document, Page, Text, View, Link, StyleSheet } from '@react-pdf/renderer';
import type { ResumeData, SectionConfig } from '../../types';
import { modernConfig } from './config';

interface ResumeDocumentProps {
  data: ResumeData;
  sections: SectionConfig[];
}

const accent = modernConfig.accentColor;

const styles = StyleSheet.create({
  page: {
    fontFamily: modernConfig.fontFamily,
    fontSize: modernConfig.fontSize.body,
    color: '#333',
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    lineHeight: 1.4,
  },
  // Header — we space items with explicit spacer Views since `marginBottom`
  // on <Text> is unreliable inside react-pdf's Yoga layout.
  spacerSm: {
    height: 4,
  },
  spacerMd: {
    height: 8,
  },
  spacerLg: {
    height: 10,
  },
  contactWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    fontSize: modernConfig.fontSize.body - 1,
    color: '#666',
    lineHeight: 1.6,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diamond: {
    color: accent,
    marginHorizontal: 4,
  },
  availabilityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 4,
  },
  availabilityTag: {
    backgroundColor: accent + '20',
    color: accent,
    fontSize: modernConfig.fontSize.body - 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: modernConfig.fontSize.section,
    fontWeight: 'bold',
    color: accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottom: `1.5 solid ${accent}`,
    paddingBottom: 3,
    marginBottom: 8,
    marginTop: 12,
  },
  summaryText: {
    fontSize: modernConfig.fontSize.body,
    color: '#555',
    lineHeight: 1.5,
    marginBottom: 4,
  },
  expItem: {
    marginBottom: 8,
    width: '100%',
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    width: '100%',
  },
  expRole: {
    fontSize: modernConfig.fontSize.body + 1,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  expCompany: {
    color: '#666',
  },
  expDate: {
    fontSize: modernConfig.fontSize.body - 1,
    color: '#999',
  },
  expLocation: {
    fontSize: modernConfig.fontSize.body - 1,
    color: '#999',
  },
  bulletItem: {
    fontSize: modernConfig.fontSize.body - 1,
    color: '#555',
    paddingLeft: 8,
    width: '100%',
  },
  eduItem: {
    marginBottom: 6,
    width: '100%',
  },
  eduHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  eduDegree: {
    fontSize: modernConfig.fontSize.body + 1,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  projItem: {
    marginBottom: 8,
    width: '100%',
  },
  projHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  projName: {
    fontSize: modernConfig.fontSize.body + 1,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  projDesc: {
    fontSize: modernConfig.fontSize.body,
    color: '#555',
    marginTop: 2,
  },
  techTag: {
    fontSize: modernConfig.fontSize.body - 2,
    color: accent,
    backgroundColor: accent + '15',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    marginRight: 3,
    marginTop: 2,
  },
  skillsRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 3,
    flexWrap: 'wrap',
  },
  skillCategory: {
    fontWeight: 'bold',
    color: '#333',
  },
  skillItems: {
    color: '#666',
  },
  awardItem: {
    marginBottom: 5,
    width: '100%',
  },
  awardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  awardTitle: {
    fontSize: modernConfig.fontSize.body + 1,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
});

function makeContactRow(data: ResumeData) {
  const parts = [
    data.header.email,
    data.header.phone,
    data.header.location,
    data.header.linkedin,
    data.header.github,
    data.header.website,
  ].filter(Boolean);

  return (
    <View style={styles.contactWrap} wrap>
      {parts.map((part, i) => (
        <View key={i} style={styles.contactItem}>
          {i > 0 && <Text style={styles.diamond}>·</Text>}
          {part?.startsWith('http') || part?.includes('linkedin') || part?.includes('github') ? (
            <Link src={`https://${part}`} style={{ color: '#666', textDecoration: 'none' }}>
              <Text>{part}</Text>
            </Link>
          ) : (
            <Text>{part}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

function headerContentJsx(data: ResumeData) {
  return (
    <>
      <Text style={{ fontSize: modernConfig.fontSize.header, fontWeight: 'bold', color: '#1a1a1a' }}>
        {data.header.name}
      </Text>
      <View style={styles.spacerSm} />
      <Text style={{ fontSize: modernConfig.fontSize.section, color: accent, fontWeight: 'bold' }}>
        {data.header.title}
      </Text>
      <View style={styles.spacerMd} />
      {makeContactRow(data)}
      {data.header.availability.length > 0 && (
        <>
          <View style={styles.spacerSm} />
          <View style={styles.availabilityRow}>
            {data.header.availability.map((tag: string, i: number) => (
              <Text key={i} style={styles.availabilityTag}>
                {tag}
              </Text>
            ))}
          </View>
        </>
      )}
    </>
  );
}

export function ResumeDocument({ data, sections }: ResumeDocumentProps) {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  // A4 usable height ≈ 842pt - 40 (paddingTop) - 40 (paddingBottom) = 762pt
  // Threshold of 720 gives a tiny safety margin without wasting space.
  const PAGE_LIMIT = 720;

  type SectionJsx = {
    id: string;
    jsx: React.ReactNode;
    estPt: number;
  };

  const sectionJsxList: SectionJsx[] = [];

  for (const section of sortedSections) {
    if (!section.enabled) continue;
    let estPt = 40;
    let jsx: React.ReactNode = null;

    if (section.id === 'summary' && data.summary?.trim()) {
      const lines = Math.max(1, Math.ceil(data.summary.length / 85));
      estPt += lines * 15;
      jsx = (
        <View key="summary" wrap={false}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summaryText}>{data.summary}</Text>
        </View>
      );
    } else if (section.id === 'experience') {
      const list = data.experience.filter((e) => e.company || e.role);
      if (list.length > 0) {
        for (const exp of list) {
          estPt += 28 + exp.bullets.filter((b) => b.trim()).length * 14;
        }
        jsx = (
          <View key="experience" wrap={false}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {list.map((exp) => (
              <View key={exp.id} style={styles.expItem} wrap={false}>
                <View style={styles.expHeader}>
                  <Text>
                    <Text style={styles.expRole}>{exp.role}</Text>
                    <Text style={styles.expCompany}> — {exp.company}</Text>
                  </Text>
                  <Text style={styles.expDate}>
                    {exp.startDate} – {exp.endDate}
                  </Text>
                </View>
                {exp.location ? <Text style={styles.expLocation}>{exp.location}</Text> : null}
                {exp.bullets
                  .filter((b) => b.trim())
                  .map((bullet, i) => (
                    <Text key={i} style={styles.bulletItem}>
                      {'•'} {bullet}
                    </Text>
                  ))}
              </View>
            ))}
          </View>
        );
      }
    } else if (section.id === 'education') {
      const list = data.education;
      if (list.length > 0) {
        for (const _ of list) estPt += 42;
        jsx = (
          <View key="education" wrap={false}>
            <Text style={styles.sectionTitle}>Education</Text>
            {list.map((edu) => (
              <View key={edu.id} style={styles.eduItem} wrap={false}>
                <View style={styles.eduHeader}>
                  <Text style={styles.eduDegree}>{edu.degree}</Text>
                  <Text style={styles.expDate}>
                    {edu.startDate} – {edu.endDate}
                  </Text>
                </View>
                <Text style={styles.expLocation}>
                  {edu.school}{edu.location ? ` — ${edu.location}` : ''}
                  {edu.gpa ? ` | GPA: ${edu.gpa}` : ''}
                </Text>
              </View>
            ))}
          </View>
        );
      }
    } else if (section.id === 'projects') {
      const list = data.projects;
      if (list.length > 0) {
        for (const p of list) estPt += 30 + (p.techStack?.length ?? 0) * 12;
        jsx = (
          <View key="projects" wrap={false}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {list.map((proj) => (
              <View key={proj.id} style={styles.projItem} wrap={false}>
                <View style={styles.projHeader}>
                  <Text style={styles.projName}>
                    {proj.name}
                    {proj.link ? ` (${proj.link})` : ''}
                  </Text>
                  <Text style={styles.expDate}>
                    {proj.startDate} – {proj.endDate}
                  </Text>
                </View>
                <Text style={styles.projDesc}>{proj.description}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 }}>
                  {proj.techStack?.map((tech, i) => (
                    <Text key={i} style={styles.techTag}>
                      {tech}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        );
      }
    } else if (section.id === 'skills') {
      const validGroups = data.skills.filter((g) => g.category && g.items.length > 0);
      if (validGroups.length > 0) {
        for (const _ of validGroups) estPt += 22;
        jsx = (
          <View key="skills" wrap={false}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {validGroups.map((group, i) => (
              <View key={i} style={styles.skillsRow} wrap={false}>
                <Text style={styles.skillCategory}>{group.category}: </Text>
                <Text style={styles.skillItems}>{group.items.join(', ')}</Text>
              </View>
            ))}
          </View>
        );
      }
    } else if (section.id === 'awards') {
      const list = data.awards;
      if (list.length > 0) {
        for (const _ of list) estPt += 40;
        jsx = (
          <View key="awards" wrap={false}>
            <Text style={styles.sectionTitle}>Awards</Text>
            {list.map((award) => (
              <View key={award.id} style={styles.awardItem} wrap={false}>
                <View style={styles.awardHeader}>
                  <Text style={styles.awardTitle}>{award.title}</Text>
                  <Text style={styles.expDate}>{award.date}</Text>
                </View>
                <Text style={styles.expLocation}>
                  {award.issuer}
                  {award.description ? ` — ${award.description}` : ''}
                </Text>
              </View>
            ))}
          </View>
        );
      }
    }

    if (jsx) sectionJsxList.push({ id: section.id, jsx, estPt });
  }

  // Rough header height estimate (name + title + contact + optional tags).
  const headerPt = data.header.availability.length > 0 ? 110 : 95;

  const pages: React.ReactNode[][] = [];
  let currentPage: React.ReactNode[] = [];
  let currentPt = -1;

  for (let i = 0; i < sectionJsxList.length; i++) {
    const { jsx, estPt } = sectionJsxList[i];
    if (currentPt === -1) {
      // Starting fresh page.
      currentPage = i === 0 ? [headerContentJsx(data), jsx] : [jsx];
      currentPt = (i === 0 ? headerPt : 0) + estPt;
    } else if (currentPt + estPt > PAGE_LIMIT && currentPage.length > 0) {
      // Won't fit — flush and start new page.
      pages.push(currentPage);
      currentPage = [jsx];
      currentPt = estPt;
    } else {
      currentPage.push(jsx);
      currentPt += estPt;
    }
  }
  if (currentPage.length > 0) pages.push(currentPage);

  // Edge case: no sections enabled → still emit one page with header.
  if (pages.length === 0) pages.push([headerContentJsx(data)]);

  return (
    <Document>
      {pages.map((views, idx) => (
        <Page key={idx} size="A4" orientation="portrait" style={styles.page}>
          {views}
        </Page>
      ))}
    </Document>
  );
}
