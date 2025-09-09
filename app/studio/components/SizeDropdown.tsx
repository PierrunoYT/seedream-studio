"use client";

import { useRef, useEffect, useState } from "react";
import { CustomImageSize } from "../../../lib/api/types";

interface SizeOption {
  value: string;
  label: string;
}

interface SizeDropdownProps {
  value: string | CustomImageSize;
  options: SizeOption[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string | CustomImageSize) => void;
  label: string;
}

export default function SizeDropdown({ value, options, isOpen, onToggle, onSelect, label }: SizeDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const isCustom = typeof value === 'object';

  const [customWidth, setCustomWidth] = useState(isCustom ? value.width : 1024);
  const [customHeight, setCustomHeight] = useState(isCustom ? value.height : 1024);

  // Effect to sync local state if the parent component changes the 'value' prop
  useEffect(() => {
    if (isCustom) {
      setCustomWidth(value.width);
      setCustomHeight(value.height);
    } else {
      // Reset to defaults when switching to preset sizes
      setCustomWidth(1024);
      setCustomHeight(1024);
    }
  }, [value, isCustom]);

  const selectedOption = !isCustom ? options.find(option => option.value === value) : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === 'custom') {
      onSelect({ width: customWidth, height: customHeight });
    } else {
      onSelect(selectedValue);
    }
  };

  const getDisplayLabel = () => {
    if (isCustom) {
      return `Custom (${value.width}x${value.height})`;
    }
    return selectedOption?.label || 'Select size';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-white mb-2">{label}</label>
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:border-white/40 hover:bg-white/15 transition-all duration-200 cursor-pointer flex items-center justify-between"
      >
        <span>{getDisplayLabel()}</span>
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
          className="absolute top-full left-0 right-0 mt-1 border border-white/20 rounded-lg overflow-hidden shadow-2xl z-50"
          style={{ 
            backgroundColor: 'rgba(88, 28, 135, 0.95)',
            backdropFilter: 'blur(12px)'
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full p-3 text-left text-white hover:bg-white/20 transition-all duration-200 border-none ${
                !isCustom && value === option.value ? 'bg-white/25' : ''
              } ${
                option.value === 'custom' && isCustom ? 'bg-white/25' : ''
              }`}
              style={{ outline: 'none' }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {isCustom && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-white text-sm mb-1">Width</label>
            <input
              type="number"
              value={customWidth || ''}
              onChange={(e) => {
                const newWidth = parseInt(e.target.value, 10) || 1024;
                setCustomWidth(newWidth);
                onSelect({ width: newWidth, height: customHeight });
              }}
              placeholder="e.g., 1024"
              className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label className="block text-white text-sm mb-1">Height</label>
            <input
              type="number"
              value={customHeight || ''}
              onChange={(e) => {
                const newHeight = parseInt(e.target.value, 10) || 1024;
                setCustomHeight(newHeight);
                onSelect({ width: customWidth, height: newHeight });
              }}
              placeholder="e.g., 1024"
              className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
          </div>
        </div>
      )}
    </div>
  );
}
