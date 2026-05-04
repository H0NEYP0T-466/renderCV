import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-2 mb-3">
      <button
        className="mt-2 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 touch-none"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical size={14} />
      </button>
      <div className="flex-1">{children}</div>
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
    <div className="space-y-1">
      {bullets.map((bullet, i) => (
        <div key={i} className="flex items-center gap-1">
          <span className="text-xs text-gray-400 w-4 shrink-0">•</span>
          <input
            type="text"
            value={bullet}
            onChange={(e) => {
              const next = [...bullets];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="flex-1 rounded border border-gray-200 px-2 py-1 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Achievement or responsibility"
          />
          <button
            onClick={() => onChange(bullets.filter((_, j) => j !== i))}
            className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
            aria-label="Remove bullet"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...bullets, ''])}
        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
      >
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
      <div className="flex flex-wrap gap-1 mb-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full"
          >
            {tag}
            <button
              onClick={() => onChange(tags.filter((_, j) => j !== i))}
              className="hover:text-red-500"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1">
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
          className="flex-1 rounded border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button
          onClick={addTag}
          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
