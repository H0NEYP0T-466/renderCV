import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { type SectionConfig } from '../../types';

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
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg mb-2 overflow-hidden shadow-sm"
    >
      <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border-b border-gray-200">
        <button
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none"
          {...attributes}
          {...listeners}
          aria-label={`Drag ${section.label} section`}
        >
          <GripVertical size={16} />
        </button>
        <span className="flex-1 text-sm font-semibold text-gray-800">{section.label}</span>
        {showToggle && (
          <button
            onClick={() => onToggle(section.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={section.enabled ? 'Hide section' : 'Show section'}
          >
            {section.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={collapsed ? 'Expand section' : 'Collapse section'}
        >
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
      {!collapsed && <div className="p-3">{children}</div>}
    </div>
  );
}
