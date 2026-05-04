import type { ResumeData } from '../../types';
import { useResume } from '../../context/ResumeContext';
import { SortableSection } from './SortableSection';
import { Field } from './Field';
import { BulletEditor, TagEditor } from './SectionEditor';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { Plus, Trash2, User } from 'lucide-react';
import { generateId } from '../../data/defaultResume';

export function EditorPanel() {
  const {
    state,
    updateHeader,
    updateSummary,
    updateExperience,
    updateEducation,
    updateProjects,
    updateSkills,
    updateAwards,
    reorderSections,
    toggleSection,
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
      const reordered = arrayMove(state.sections, oldIndex, newIndex).map((s, i) => ({
        ...s,
        order: i,
      }));
      reorderSections(reordered);
    }
  };

  const sortedSections = [...state.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="bg-white border border-gray-200 rounded-lg mb-2 overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border-b border-gray-200">
          <User size={16} className="text-blue-600" />
          <span className="flex-1 text-sm font-semibold text-gray-800">Personal Info</span>
        </div>
        <div className="p-3">
          <Field label="Full Name" value={state.data.header.name} onChange={(v) => updateHeader({ name: v })} placeholder="John Doe" />
          <Field label="Job Title" value={state.data.header.title} onChange={(v) => updateHeader({ title: v })} placeholder="Full Stack Developer" />
          <Field label="Email" value={state.data.header.email} onChange={(v) => updateHeader({ email: v })} type="email" placeholder="john@example.com" />
          <Field label="Phone" value={state.data.header.phone} onChange={(v) => updateHeader({ phone: v })} placeholder="+1 234 567 890" />
          <Field label="Location" value={state.data.header.location} onChange={(v) => updateHeader({ location: v })} placeholder="City, Country" />
          <Field label="LinkedIn" value={state.data.header.linkedin ?? ''} onChange={(v) => updateHeader({ linkedin: v })} placeholder="linkedin.com/in/username" />
          <Field label="GitHub" value={state.data.header.github ?? ''} onChange={(v) => updateHeader({ github: v })} placeholder="github.com/username" />
          <Field label="Website" value={state.data.header.website ?? ''} onChange={(v) => updateHeader({ website: v })} placeholder="yoursite.com" />
          <div className="mb-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Availability</label>
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

function ExperienceEditor({ experience, onChange }: { experience: ResumeData['experience']; onChange: (data: ResumeData['experience']) => void }) {
  const updateItem = (index: number, field: string, value: unknown) => {
    const next = experience.map((item, i) => i === index ? { ...item, [field]: value } : item);
    onChange(next);
  };
  return (
    <div>
      {experience.map((exp, i) => (
        <div key={exp.id} className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-500">Experience #{i + 1}</span>
            <button onClick={() => onChange(experience.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
          </div>
          <Field label="Company" value={exp.company} onChange={(v) => updateItem(i, 'company', v)} placeholder="Company name" />
          <Field label="Role" value={exp.role} onChange={(v) => updateItem(i, 'role', v)} placeholder="Job title" />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Start" value={exp.startDate} onChange={(v) => updateItem(i, 'startDate', v)} placeholder="Jan 2020" />
            <Field label="End" value={exp.endDate} onChange={(v) => updateItem(i, 'endDate', v)} placeholder="Present" />
          </div>
          <Field label="Location" value={exp.location} onChange={(v) => updateItem(i, 'location', v)} placeholder="City, Country" />
          <div className="mb-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Bullet Points</label>
            <BulletEditor bullets={exp.bullets} onChange={(bullets) => updateItem(i, 'bullets', bullets)} />
          </div>
        </div>
      ))}
      <button onClick={() => onChange([...experience, { id: generateId('exp'), company: '', role: '', location: '', startDate: '', endDate: '', bullets: [] }])} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
        <Plus size={14} /> Add Experience
      </button>
    </div>
  );
}

function EducationEditor({ education, onChange }: { education: ResumeData['education']; onChange: (data: ResumeData['education']) => void }) {
  const updateItem = (index: number, field: string, value: unknown) => {
    const next = education.map((item, i) => i === index ? { ...item, [field]: value } : item);
    onChange(next);
  };
  return (
    <div>
      {education.map((edu, i) => (
        <div key={edu.id} className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-500">Education #{i + 1}</span>
            <button onClick={() => onChange(education.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
          </div>
          <Field label="Degree" value={edu.degree} onChange={(v) => updateItem(i, 'degree', v)} placeholder="B.Sc. Computer Science" />
          <Field label="School" value={edu.school} onChange={(v) => updateItem(i, 'school', v)} placeholder="University name" />
          <Field label="Location" value={edu.location} onChange={(v) => updateItem(i, 'location', v)} placeholder="City, Country" />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Start" value={edu.startDate} onChange={(v) => updateItem(i, 'startDate', v)} placeholder="2015" />
            <Field label="End" value={edu.endDate} onChange={(v) => updateItem(i, 'endDate', v)} placeholder="2019" />
          </div>
          <Field label="GPA" value={edu.gpa ?? ''} onChange={(v) => updateItem(i, 'gpa', v)} placeholder="3.5/4.0" />
        </div>
      ))}
      <button onClick={() => onChange([...education, { id: generateId('edu'), degree: '', school: '', location: '', startDate: '', endDate: '' }])} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
        <Plus size={14} /> Add Education
      </button>
    </div>
  );
}

function ProjectsEditor({ projects, onChange }: { projects: ResumeData['projects']; onChange: (data: ResumeData['projects']) => void }) {
  const updateItem = (index: number, field: string, value: unknown) => {
    const next = projects.map((item, i) => i === index ? { ...item, [field]: value } : item);
    onChange(next);
  };
  return (
    <div>
      {projects.map((proj, i) => (
        <div key={proj.id} className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-500">Project #{i + 1}</span>
            <button onClick={() => onChange(projects.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
          </div>
          <Field label="Project Name" value={proj.name} onChange={(v) => updateItem(i, 'name', v)} placeholder="Project name" />
          <Field label="Link" value={proj.link ?? ''} onChange={(v) => updateItem(i, 'link', v)} placeholder="github.com/user/project" />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Start" value={proj.startDate} onChange={(v) => updateItem(i, 'startDate', v)} placeholder="2023" />
            <Field label="End" value={proj.endDate} onChange={(v) => updateItem(i, 'endDate', v)} placeholder="Present" />
          </div>
          <Field label="Description" value={proj.description} onChange={(v) => updateItem(i, 'description', v)} textarea rows={2} placeholder="Brief description..." />
          <div className="mb-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Tech Stack</label>
            <TagEditor tags={proj.techStack ?? []} onChange={(techStack) => updateItem(i, 'techStack', techStack)} />
          </div>
        </div>
      ))}
      <button onClick={() => onChange([...projects, { id: generateId('proj'), name: '', startDate: '', endDate: '', description: '' }])} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
        <Plus size={14} /> Add Project
      </button>
    </div>
  );
}

function SkillsEditor({ skills, onChange }: { skills: ResumeData['skills']; onChange: (data: ResumeData['skills']) => void }) {
  return (
    <div>
      {skills.map((group, i) => (
        <div key={i} className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-500">Skill Group #{i + 1}</span>
            <button onClick={() => onChange(skills.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
          </div>
          <Field label="Category" value={group.category} onChange={(v) => { const n = [...skills]; n[i] = { ...n[i], category: v }; onChange(n); }} placeholder="e.g. Frontend" />
          <div className="mb-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Skills</label>
            <TagEditor tags={group.items} onChange={(items) => { const n = [...skills]; n[i] = { ...n[i], items }; onChange(n); }} />
          </div>
        </div>
      ))}
      <button onClick={() => onChange([...skills, { category: '', items: [] }])} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
        <Plus size={14} /> Add Skill Group
      </button>
    </div>
  );
}

function AwardsEditor({ awards, onChange }: { awards: ResumeData['awards']; onChange: (data: ResumeData['awards']) => void }) {
  const updateItem = (index: number, field: string, value: unknown) => {
    const next = awards.map((item, i) => i === index ? { ...item, [field]: value } : item);
    onChange(next);
  };
  return (
    <div>
      {awards.map((award, i) => (
        <div key={award.id} className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-500">Award #{i + 1}</span>
            <button onClick={() => onChange(awards.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
          </div>
          <Field label="Title" value={award.title} onChange={(v) => updateItem(i, 'title', v)} placeholder="Award title" />
          <Field label="Issuer" value={award.issuer} onChange={(v) => updateItem(i, 'issuer', v)} placeholder="Organization" />
          <Field label="Date" value={award.date} onChange={(v) => updateItem(i, 'date', v)} placeholder="2024" />
          <Field label="Description" value={award.description ?? ''} onChange={(v) => updateItem(i, 'description', v)} textarea rows={2} placeholder="Brief description..." />
        </div>
      ))}
      <button onClick={() => onChange([...awards, { id: generateId('award'), title: '', issuer: '', date: '' }])} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
        <Plus size={14} /> Add Award
      </button>
    </div>
  );
}
