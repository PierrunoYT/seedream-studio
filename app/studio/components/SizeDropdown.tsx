"use client";

import { useRef, useEffect } from "react";

interface SizeOption {
  value: string;
  label: string;
}

interface SizeDropdownProps {
  value: string;
  options: SizeOption[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  label: string;
}

export default function SizeDropdown({ value, options, isOpen, onToggle, onSelect, label }: SizeDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-white mb-2">{label}</label>
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:border-white/40 hover:bg-white/15 transition-all duration-200 cursor-pointer flex items-center justify-between"
      >
        <span>{selectedOption?.label}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 border border-white/20 rounded-lg overflow-hidden shadow-2xl"
          style={{ 
            zIndex: 10000,
            position: 'absolute',
            minWidth: '100%',
            backgroundColor: 'rgba(88, 28, 135, 0.95)',
            backdropFilter: 'blur(12px)'
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className={`w-full p-3 text-left text-white hover:bg-white/20 transition-all duration-200 border-none ${
                value === option.value ? 'bg-white/25' : 'bg-transparent'
              }`}
              style={{ outline: 'none' }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}