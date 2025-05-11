// src/components/tags/tag-input.tsx
'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { PlusIcon } from 'lucide-react';
import { TagBadge } from './tag-badge';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TagInput({ 
  value = [], 
  onChange, 
  placeholder = 'Añadir etiqueta...', 
  disabled = false 
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      const newTags = [...value, trimmedValue];
      onChange(newTags);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      const newTags = [...value];
      newTags.pop();
      onChange(newTags);
    }
  };

  return (
    <div 
      className={`flex flex-wrap items-center gap-2 p-2 border border-input rounded-md ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, index) => (
        <TagBadge 
          key={index} 
          name={tag}
          onRemove={() => !disabled && removeTag(index)} 
        />
      ))}
      
      <div className="flex-1 flex items-center min-w-[120px]">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 bg-transparent border-none p-1 text-sm focus:outline-none focus:ring-0 disabled:cursor-not-allowed"
          disabled={disabled}
        />
        {inputValue && !disabled && (
          <button
            type="button"
            onClick={addTag}
            className="ml-1 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}