import { Document, Page, Text, View, Link, StyleSheet } from '@react-pdf/renderer';
import type { ResumeData, SectionConfig } from '../../types';
import { modernConfig } from './config';
import { splitIntoPages, type SectionNode } from './paginate';

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
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 40,
    lineHeight: 1.4,
  },
  // Header — explicit spacer Views (<View height={N}/>) are required between
  // bare Text siblings; Yoga ignores marginBottom on Text inside a flex column.
  headerBlock: {
    marginBottom: 6,
  },
  headerName: {
    fontSize: modernConfig.fontSize.header,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerTitle: {
    fontSize: modernConfig.fontSize.section,
    color: accent,
    fontWeight: 'bold',
  },
  spacer4: { height: 4 },
  spacer6: { height: 6 },
  spacer8: { height: 8 },
  spacer10: { height: 10 },
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

function renderHeader(data: ResumeData) {
  return (
    <View style={styles.headerBlock} wrap={false}>
      <Text style={styles.headerName}>{data.header.name}</Text>
      <View style={styles.spacer6} />
      <Text style={styles.headerTitle}>{data.header.title}</Text>
      <View style={styles.spacer6} />
      {makeContactRow(data)}
      {data.header.availability.length > 0 && (
        <>
          <View style={styles.spacer6} />
          <View style={styles.availabilityRow}>
            {data.header.availability.map((tag: string, i: number) => (
              <Text key={i} style={styles.availabilityTag}>
                {tag}
              </Text>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

function renderSection(node: SectionNode): React.ReactNode {
  const id = node.id;
  const data = node.data;

  switch (id) {
    case 'summary': {
      const text = data as string;
      if (!text?.trim()) return null;
      return (
        <View key="summary" wrap={false}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summaryText}>{text}</Text>
        </View>
      );
    }
    case 'experience': {
      const list = (data as ResumeData['experience']).filter((e) => e.company || e.role);
      if (list.length === 0) return null;
      return (
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
    case 'education': {
      const list = data as ResumeData['education'];
      if (list.length === 0) return null;
      return (
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
    case 'projects': {
      const list = data as ResumeData['projects'];
      if (list.length === 0) return null;
      return (
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
    case 'skills': {
      const validGroups = (data as ResumeData['skills']).filter(
        (g) => g.category && g.items.length > 0
      );
      if (validGroups.length === 0) return null;
      return (
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
    case 'awards': {
      const list = data as ResumeData['awards'];
      if (list.length === 0) return null;
      return (
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
    default:
      return null;
  }
}

export function ResumeDocument({ data, sections }: ResumeDocumentProps) {
  // Same page-splitting algorithm used by ModernPreview so preview & PDF paginate identically.
  const pages = splitIntoPages(data, sections);

  return (
    <Document>
      {pages.map((pageNodes, idx) => (
        <Page key={idx} size="A4" orientation="portrait" style={styles.page}>
          {idx === 0 && renderHeader(data)}
          {pageNodes.map((node) => renderSection(node))}
        </Page>
      ))}
    </Document>
  );
}
