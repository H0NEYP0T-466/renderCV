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
    padding: 40,
    lineHeight: 1.4,
  },
  headerName: {
    fontSize: modernConfig.fontSize.header,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: modernConfig.fontSize.section,
    color: accent,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: modernConfig.fontSize.body - 1,
    color: '#666',
    marginBottom: 4,
    gap: 4,
  },
  diamond: {
    color: accent,
    marginHorizontal: 4,
  },
  availabilityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
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
  },
  expItem: {
    marginBottom: 8,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    flexWrap: 'wrap',
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
    marginBottom: 2,
  },
  bulletItem: {
    fontSize: modernConfig.fontSize.body - 1,
    color: '#555',
    marginLeft: 8,
    marginBottom: 1,
  },
  eduItem: {
    marginBottom: 6,
  },
  eduHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eduDegree: {
    fontSize: modernConfig.fontSize.body + 1,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  projItem: {
    marginBottom: 8,
  },
  projHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  awardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  awardTitle: {
    fontSize: modernConfig.fontSize.body + 1,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
});

export function ResumeDocument({ data, sections }: ResumeDocumentProps) {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const contactParts = [
    data.header.email,
    data.header.phone,
    data.header.location,
    data.header.linkedin,
    data.header.github,
    data.header.website,
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.headerName}>{data.header.name}</Text>
        <Text style={styles.headerTitle}>{data.header.title}</Text>
        <View style={styles.contactRow}>
          {contactParts.map((part, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
              {i > 0 && <Text style={styles.diamond}>◇</Text>}
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
        {data.header.availability.length > 0 && (
          <View style={styles.availabilityRow}>
            {data.header.availability.map((tag: string, i: number) => (
              <Text key={i} style={styles.availabilityTag}>
                {tag}
              </Text>
            ))}
          </View>
        )}

        {/* Dynamic sections */}
        {sortedSections
          .filter((s) => s.enabled)
          .map((section) => {
            if (section.id === 'summary' && data.summary) {
              return (
                <View key="summary">
                  <Text style={styles.sectionTitle}>Summary</Text>
                  <Text style={styles.summaryText}>{data.summary}</Text>
                </View>
              );
            }
            if (section.id === 'experience' && data.experience.length > 0) {
              return (
                <View key="experience">
                  <Text style={styles.sectionTitle}>Experience</Text>
                  {data.experience.map((exp: ResumeData['experience'][number]) => (
                    <View key={exp.id} style={styles.expItem}>
                      <View style={styles.expHeader}>
                        <Text>
                          <Text style={styles.expRole}>{exp.role}</Text>
                          <Text style={styles.expCompany}> — {exp.company}</Text>
                        </Text>
                        <Text style={styles.expDate}>
                          {exp.startDate} – {exp.endDate}
                        </Text>
                      </View>
                      <Text style={styles.expLocation}>{exp.location}</Text>
                      {exp.bullets
                        .filter((b: string) => b.trim())
                        .map((bullet: string, i: number) => (
                          <Text key={i} style={styles.bulletItem}>
                            • {bullet}
                          </Text>
                        ))}
                    </View>
                  ))}
                </View>
              );
            }
            if (section.id === 'education' && data.education.length > 0) {
              return (
                <View key="education">
                  <Text style={styles.sectionTitle}>Education</Text>
                  {data.education.map((edu: ResumeData['education'][number]) => (
                    <View key={edu.id} style={styles.eduItem}>
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
            if (section.id === 'projects' && data.projects.length > 0) {
              return (
                <View key="projects">
                  <Text style={styles.sectionTitle}>Projects</Text>
                  {data.projects.map((proj: ResumeData['projects'][number]) => (
                    <View key={proj.id} style={styles.projItem}>
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
                        {proj.techStack?.map((tech: string, i: number) => (
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
            if (section.id === 'skills' && data.skills.length > 0) {
              const validGroups = data.skills.filter(
                (g: ResumeData['skills'][number]) => g.category && g.items.length > 0
              );
              if (validGroups.length === 0) return null;
              return (
                <View key="skills">
                  <Text style={styles.sectionTitle}>Skills</Text>
                  {validGroups.map((group: ResumeData['skills'][number], i: number) => (
                    <View key={i} style={styles.skillsRow}>
                      <Text style={styles.skillCategory}>{group.category}: </Text>
                      <Text style={styles.skillItems}>{group.items.join(', ')}</Text>
                    </View>
                  ))}
                </View>
              );
            }
            if (section.id === 'awards' && data.awards.length > 0) {
              return (
                <View key="awards">
                  <Text style={styles.sectionTitle}>Awards</Text>
                  {data.awards.map((award: ResumeData['awards'][number]) => (
                    <View key={award.id} style={styles.awardItem}>
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
            return null;
          })}
      </Page>
    </Document>
  );
}
