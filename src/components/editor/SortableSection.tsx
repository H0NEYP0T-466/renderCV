import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { type SectionConfig } from '../../types';
import './SortableSection.css';

interface SortableSectionProps {
  section: SectionConfig;
  children: ReactNode;
  onToggle: (id: SectionConfig['id']) => void;
  showToggle?: boolean;
}

export function SortableSection({
  section,
  children,
  onToggle,
  showToggle = false,
}: SortableSectionProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-section">
      <div className="sortable-section__header">
        <button
          className="sortable-section__drag-handle"
          {...attributes}
          {...listeners}
          aria-label={`Drag ${section.label} section`}
        >
          <GripVertical size={16} />
        </button>
        <span className="sortable-section__label">{section.label}</span>
        {showToggle && (
          <button
            onClick={() => onToggle(section.id)}
            className="sortable-section__toggle"
            aria-label={section.enabled ? 'Hide section' : 'Show section'}
          >
            {section.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="sortable-section__toggle"
          aria-label={collapsed ? 'Expand section' : 'Collapse section'}
        >
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
      {!collapsed && <div className="sortable-section__body">{children}</div>}
    </div>
  );
}
