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
  const [validationError, setValidationError] = useState<string>('');

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

  const validateDimension = (width: number, height: number): string => {
    if (width < 1024 || width > 4096) {
      return 'Width must be between 1024 and 4096 pixels';
    }
    if (height < 1024 || height > 4096) {
      return 'Height must be between 1024 and 4096 pixels';
    }
    return '';
  };

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === 'custom') {
      const error = validateDimension(customWidth, customHeight);
      setValidationError(error);
      if (!error) {
        onSelect({ width: customWidth, height: customHeight });
      }
    } else {
      setValidationError('');
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
              min={1024}
              max={4096}
              onChange={(e) => {
                const newWidth = parseInt(e.target.value, 10) || 1024;
                setCustomWidth(newWidth);
                const error = validateDimension(newWidth, customHeight);
                setValidationError(error);
                if (!error) {
                  onSelect({ width: newWidth, height: customHeight });
                }
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
              min={1024}
              max={4096}
              onChange={(e) => {
                const newHeight = parseInt(e.target.value, 10) || 1024;
                setCustomHeight(newHeight);
                const error = validateDimension(customWidth, newHeight);
                setValidationError(error);
                if (!error) {
                  onSelect({ width: customWidth, height: newHeight });
                }
              }}
              placeholder="e.g., 1024"
              className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
          </div>
        </div>
      )}

      {isCustom && (
        <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-white/90">ℹ️</span>
            <span className="text-sm text-white/90 font-medium">Size Requirements</span>
          </div>
          <p className="text-xs text-white/70">
            Both width and height must be between <span className="text-white/90 font-mono">1024</span> and <span className="text-white/90 font-mono">4096</span> pixels for FAL API compatibility.
          </p>
          {validationError && (
            <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-200">
              {validationError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
