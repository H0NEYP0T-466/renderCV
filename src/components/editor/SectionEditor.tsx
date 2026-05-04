import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './SectionEditor.css';

function SortableItem({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={{ ...style, display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
      <button
        style={{ marginTop: '8px', cursor: 'grab', color: '#d1d5db', touchAction: 'none', userSelect: 'none', background: 'none', border: 'none', padding: 0 }}
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        onMouseOver={(e) => (e.currentTarget.style.color = '#6b7280')}
        onMouseOut={(e) => (e.currentTarget.style.color = '#d1d5db')}
      >
        <GripVertical size={14} />
      </button>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

export { SortableItem };

interface BulletEditorProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
}

export function BulletEditor({ bullets, onChange }: BulletEditorProps) {
  return (
    <div className="bullet-editor__list">
      {bullets.map((bullet, i) => (
        <div key={i} className="bullet-editor__row">
          <span className="bullet-editor__bullet">•</span>
          <input
            type="text"
            value={bullet}
            onChange={(e) => {
              const next = [...bullets];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="bullet-editor__input"
            placeholder="Achievement or responsibility"
          />
          <button
            onClick={() => onChange(bullets.filter((_, j) => j !== i))}
            className="bullet-editor__delete"
            aria-label="Remove bullet"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...bullets, ''])} className="bullet-editor__add">
        <Plus size={12} /> Add bullet
      </button>
    </div>
  );
}

interface TagEditorProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagEditor({ tags, onChange }: TagEditorProps) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInput('');
    }
  };

  return (
    <div>
      <div className="tag-editor__tags">
        {tags.map((tag, i) => (
          <span key={i} className="tag-editor__tag">
            {tag}
            <button
              onClick={() => onChange(tags.filter((_, j) => j !== i))}
              className="tag-editor__tag-remove"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="tag-editor__input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="Add tag and press Enter"
          className="tag-editor__input"
        />
        <button onClick={addTag} className="tag-editor__add-btn">
          Add
        </button>
      </div>
    </div>
  );
}
