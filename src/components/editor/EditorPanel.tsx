import type { ResumeData } from '../../types';
import { useResume } from '../../context/ResumeContext';
import { SortableSection } from './SortableSection';
import { Field } from './Field';
import { BulletEditor, TagEditor } from './SectionEditor';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { Plus, Trash2, User } from 'lucide-react';
import { generateId } from '../../data/defaultResume';

const S = {
  card: {
    padding: 12, marginBottom: 16, background: '#f9fafb',
    border: '1px solid #f3f4f6', borderRadius: 8,
  } as React.CSSProperties,
  cardHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  } as React.CSSProperties,
  cardTitle: {
    fontSize: 12, fontWeight: 600, color: '#6b7280',
  } as React.CSSProperties,
  deleteBtn: {
    color: '#9ca3af', background: 'none', border: 'none', padding: 0, cursor: 'pointer',
  } as React.CSSProperties,
  grid2: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
  } as React.CSSProperties,
  addBtn: {
    display: 'flex', alignItems: 'center', gap: 4, fontSize: 14,
    fontWeight: 500, color: '#2563eb', background: 'none', border: 'none', padding: 0, cursor: 'pointer',
  } as React.CSSProperties,
  label: {
    display: 'block', fontSize: 12, fontWeight: 500,
    color: '#4b5563', marginBottom: 4,
  } as React.CSSProperties,
  sectionBox: {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
    marginBottom: 8, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  } as React.CSSProperties,
  sectionHeader: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
    background: '#f9fafb', borderBottom: '1px solid #e5e7eb',
  } as React.CSSProperties,
  sectionBody: { padding: 12 } as React.CSSProperties,
};

export function EditorPanel() {
  const {
    state, updateHeader, updateSummary, updateExperience,
    updateEducation, updateProjects, updateSkills, updateAwards,
    reorderSections, toggleSection,
  } = useResume();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = state.sections.findIndex((s) => s.id === active.id);
      const newIndex = state.sections.findIndex((s) => s.id === over.id);
      const reordered = arrayMove(state.sections, oldIndex, newIndex).map((s, i) => ({ ...s, order: i }));
      reorderSections(reordered);
    }
  };

  const sortedSections = [...state.sections].sort((a, b) => a.order - b.order);

  return (
    <div style={{ maxWidth: 672, margin: '0 auto', padding: '16px 0' }}>
      {/* Personal Info */}
      <div style={S.sectionBox}>
        <div style={S.sectionHeader}>
          <User size={16} color="#2563eb" />
          <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#1f2937' }}>Personal Info</span>
        </div>
        <div style={S.sectionBody}>
          <Field label="Full Name" value={state.data.header.name} onChange={(v) => updateHeader({ name: v })} placeholder="John Doe" />
          <Field label="Job Title" value={state.data.header.title} onChange={(v) => updateHeader({ title: v })} placeholder="Full Stack Developer" />
          <Field label="Email" value={state.data.header.email} onChange={(v) => updateHeader({ email: v })} type="email" placeholder="john@example.com" />
          <Field label="Phone" value={state.data.header.phone} onChange={(v) => updateHeader({ phone: v })} placeholder="+1 234 567 890" />
          <Field label="Location" value={state.data.header.location} onChange={(v) => updateHeader({ location: v })} placeholder="City, Country" />
          <Field label="LinkedIn" value={state.data.header.linkedin ?? ''} onChange={(v) => updateHeader({ linkedin: v })} placeholder="linkedin.com/in/username" />
          <Field label="GitHub" value={state.data.header.github ?? ''} onChange={(v) => updateHeader({ github: v })} placeholder="github.com/username" />
          <Field label="Website" value={state.data.header.website ?? ''} onChange={(v) => updateHeader({ website: v })} placeholder="yoursite.com" />
          <div style={{ marginBottom: 4 }}>
            <label style={S.label}>Availability</label>
            <TagEditor tags={state.data.header.availability} onChange={(items) => updateHeader({ availability: items })} />
          </div>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortedSections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {sortedSections.map((section) => (
            <SortableSection key={section.id} section={section} onToggle={toggleSection} showToggle={section.id === 'summary'}>
              {section.id === 'summary' && section.enabled && <SummaryEditor summary={state.data.summary ?? ''} onChange={updateSummary} />}
              {section.id === 'experience' && <ExperienceEditor experience={state.data.experience} onChange={updateExperience} />}
              {section.id === 'education' && <EducationEditor education={state.data.education} onChange={updateEducation} />}
              {section.id === 'projects' && <ProjectsEditor projects={state.data.projects} onChange={updateProjects} />}
              {section.id === 'skills' && <SkillsEditor skills={state.data.skills} onChange={updateSkills} />}
              {section.id === 'awards' && <AwardsEditor awards={state.data.awards} onChange={updateAwards} />}
            </SortableSection>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SummaryEditor({ summary, onChange }: { summary: string; onChange: (v: string) => void }) {
  return <Field label="Professional Summary" value={summary} onChange={onChange} textarea rows={4} placeholder="Brief professional summary..." />;
}

function ExperienceEditor({ experience, onChange }: { experience: ResumeData['experience']; onChange: (d: ResumeData['experience']) => void }) {
  const updateItem = (index: number, field: string, value: unknown) => {
    onChange(experience.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };
  return (
    <div>
      {experience.map((exp, i) => (
        <div key={exp.id} style={S.card}>
          <div style={S.cardHeader}>
            <span style={S.cardTitle}>Experience #{i + 1}</span>
            <button style={S.deleteBtn} onClick={() => onChange(experience.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
          </div>
          <Field label="Company" value={exp.company} onChange={(v) => updateItem(i, 'company', v)} placeholder="Company name" />
          <Field label="Role" value={exp.role} onChange={(v) => updateItem(i, 'role', v)} placeholder="Job title" />
          <div style={S.grid2}>
            <Field label="Start" value={exp.startDate} onChange={(v) => updateItem(i, 'startDate', v)} placeholder="Jan 2020" />
            <Field label="End" value={exp.endDate} onChange={(v) => updateItem(i, 'endDate', v)} placeholder="Present" />
          </div>
          <Field label="Location" value={exp.location} onChange={(v) => updateItem(i, 'location', v)} placeholder="City, Country" />
          <div style={{ marginBottom: 8 }}>
            <label style={S.label}>Bullet Points</label>
            <BulletEditor bullets={exp.bullets} onChange={(bullets) => updateItem(i, 'bullets', bullets)} />
          </div>
        </div>
      ))}
      <button style={S.addBtn} onClick={() => onChange([...experience, { id: generateId('exp'), company: '', role: '', location: '', startDate: '', endDate: '', bullets: [] }])}>
        <Plus size={14} /> Add Experience
      </button>
    </div>
  );
}

function EducationEditor({ education, onChange }: { education: ResumeData['education']; onChange: (d: ResumeData['education']) => void }) {
  const updateItem = (index: number, field: string, value: unknown) => {
    onChange(education.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };
  return (
    <div>
      {education.map((edu, i) => (
        <div key={edu.id} style={S.card}>
          <div style={S.cardHeader}>
            <span style={S.cardTitle}>Education #{i + 1}</span>
            <button style={S.deleteBtn} onClick={() => onChange(education.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
          </div>
          <Field label="Degree" value={edu.degree} onChange={(v) => updateItem(i, 'degree', v)} placeholder="B.Sc. Computer Science" />
          <Field label="School" value={edu.school} onChange={(v) => updateItem(i, 'school', v)} placeholder="University name" />
          <Field label="Location" value={edu.location} onChange={(v) => updateItem(i, 'location', v)} placeholder="City, Country" />
          <div style={S.grid2}>
            <Field label="Start" value={edu.startDate} onChange={(v) => updateItem(i, 'startDate', v)} placeholder="2015" />
            <Field label="End" value={edu.endDate} onChange={(v) => updateItem(i, 'endDate', v)} placeholder="2019" />
          </div>
          <Field label="GPA" value={edu.gpa ?? ''} onChange={(v) => updateItem(i, 'gpa', v)} placeholder="3.5/4.0" />
        </div>
      ))}
      <button style={S.addBtn} onClick={() => onChange([...education, { id: generateId('edu'), degree: '', school: '', location: '', startDate: '', endDate: '' }])}>
        <Plus size={14} /> Add Education
      </button>
    </div>
  );
}

function ProjectsEditor({ projects, onChange }: { projects: ResumeData['projects']; onChange: (d: ResumeData['projects']) => void }) {
  const updateItem = (index: number, field: string, value: unknown) => {
    onChange(projects.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };
  return (
    <div>
      {projects.map((proj, i) => (
        <div key={proj.id} style={S.card}>
          <div style={S.cardHeader}>
            <span style={S.cardTitle}>Project #{i + 1}</span>
            <button style={S.deleteBtn} onClick={() => onChange(projects.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
          </div>
          <Field label="Project Name" value={proj.name} onChange={(v) => updateItem(i, 'name', v)} placeholder="Project name" />
          <Field label="Link" value={proj.link ?? ''} onChange={(v) => updateItem(i, 'link', v)} placeholder="github.com/user/project" />
          <div style={S.grid2}>
            <Field label="Start" value={proj.startDate} onChange={(v) => updateItem(i, 'startDate', v)} placeholder="2023" />
            <Field label="End" value={proj.endDate} onChange={(v) => updateItem(i, 'endDate', v)} placeholder="Present" />
          </div>
          <Field label="Description" value={proj.description} onChange={(v) => updateItem(i, 'description', v)} textarea rows={2} placeholder="Brief description..." />
          <div style={{ marginBottom: 8 }}>
            <label style={S.label}>Tech Stack</label>
            <TagEditor tags={proj.techStack ?? []} onChange={(techStack) => updateItem(i, 'techStack', techStack)} />
          </div>
        </div>
      ))}
      <button style={S.addBtn} onClick={() => onChange([...projects, { id: generateId('proj'), name: '', startDate: '', endDate: '', description: '' }])}>
        <Plus size={14} /> Add Project
      </button>
    </div>
  );
}

function SkillsEditor({ skills, onChange }: { skills: ResumeData['skills']; onChange: (d: ResumeData['skills']) => void }) {
  return (
    <div>
      {skills.map((group, i) => (
        <div key={i} style={S.card}>
          <div style={S.cardHeader}>
            <span style={S.cardTitle}>Skill Group #{i + 1}</span>
            <button style={S.deleteBtn} onClick={() => onChange(skills.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
          </div>
          <Field label="Category" value={group.category} onChange={(v) => { const n = [...skills]; n[i] = { ...n[i], category: v }; onChange(n); }} placeholder="e.g. Frontend" />
          <div style={{ marginBottom: 8 }}>
            <label style={S.label}>Skills</label>
            <TagEditor tags={group.items} onChange={(items) => { const n = [...skills]; n[i] = { ...n[i], items }; onChange(n); }} />
          </div>
        </div>
      ))}
      <button style={S.addBtn} onClick={() => onChange([...skills, { category: '', items: [] }])}>
        <Plus size={14} /> Add Skill Group
      </button>
    </div>
  );
}

function AwardsEditor({ awards, onChange }: { awards: ResumeData['awards']; onChange: (d: ResumeData['awards']) => void }) {
  const updateItem = (index: number, field: string, value: unknown) => {
    onChange(awards.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };
  return (
    <div>
      {awards.map((award, i) => (
        <div key={award.id} style={S.card}>
          <div style={S.cardHeader}>
            <span style={S.cardTitle}>Award #{i + 1}</span>
            <button style={S.deleteBtn} onClick={() => onChange(awards.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
          </div>
          <Field label="Title" value={award.title} onChange={(v) => updateItem(i, 'title', v)} placeholder="Award title" />
          <Field label="Issuer" value={award.issuer} onChange={(v) => updateItem(i, 'issuer', v)} placeholder="Organization" />
          <Field label="Date" value={award.date} onChange={(v) => updateItem(i, 'date', v)} placeholder="2024" />
          <Field label="Description" value={award.description ?? ''} onChange={(v) => updateItem(i, 'description', v)} textarea rows={2} placeholder="Brief description..." />
        </div>
      ))}
      <button style={S.addBtn} onClick={() => onChange([...awards, { id: generateId('award'), title: '', issuer: '', date: '' }])}>
        <Plus size={14} /> Add Award
      </button>
    </div>
  );
}
