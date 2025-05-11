// src/components/shared/CodeEditor.tsx
'use client';

import { useEffect, useState } from 'react';

interface CodeEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  height?: string;
}

export function CodeEditor({ value, language, onChange, height = '200px' }: CodeEditorProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      
      const newValue = localValue.substring(0, start) + '  ' + localValue.substring(end);
      setLocalValue(newValue);
      onChange(newValue);
      
      // Move cursor position
      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div
      className="relative"
      style={{ height }}
      onClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <textarea
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsEditing(false)}
          className="w-full h-full p-4 font-mono text-sm focus:outline-none border border-gray-300 rounded-md"
          style={{ resize: 'none' }}
          autoFocus
        />
      ) : (
        <div className="w-full h-full overflow-auto p-4 font-mono text-sm border border-gray-300 rounded-md bg-gray-50">
          {localValue || ' '}
        </div>
      )}
    </div>
  );
}