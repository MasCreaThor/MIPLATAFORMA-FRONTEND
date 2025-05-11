// src/components/tags/tag-badge.tsx
import { XIcon } from 'lucide-react';
import { stringToColor } from '@/lib/utils';

interface TagBadgeProps {
  name: string;
  onRemove?: () => void;
}

export function TagBadge({ name, onRemove }: TagBadgeProps) {
  const color = stringToColor(name);
  
  return (
    <span 
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ 
        backgroundColor: `${color}20`,
        color: color
      }}
    >
      {name}
      {onRemove && (
        <button
          type="button"
          className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center focus:outline-none focus:text-gray-500"
          onClick={onRemove}
        >
          <span className="sr-only">Eliminar etiqueta</span>
          <XIcon className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}