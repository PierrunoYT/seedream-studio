"use client";

import SizeDropdown from "./SizeDropdown";

interface GenerateModeProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  numImages: number;
  onNumImagesChange: (value: number) => void;
  isNumImagesDropdownOpen: boolean;
  onToggleNumImagesDropdown: () => void;
  size: string;
  onSizeChange: (value: string) => void;
  isSizeDropdownOpen: boolean;
  onToggleSizeDropdown: () => void;
  seed: string;
  onSeedChange: (value: string) => void;
}

const sizeOptions = [
  { value: "square_hd", label: "Square HD (1024x1024)" },
  { value: "square", label: "Square (512x512)" },
  { value: "portrait_4_3", label: "Portrait 4:3" },
  { value: "portrait_16_9", label: "Portrait 16:9" },
  { value: "landscape_4_3", label: "Landscape 4:3" },
  { value: "landscape_16_9", label: "Landscape 16:9" },
];

const numImagesOptions = [
  { value: 1, label: "1 Image" },
  { value: 2, label: "2 Images" },
  { value: 3, label: "3 Images" },
  { value: 4, label: "4 Images" },
];

export default function GenerateMode({
  prompt,
  onPromptChange,
  numImages,
  onNumImagesChange,
  isNumImagesDropdownOpen,
  onToggleNumImagesDropdown,
  size,
  onSizeChange,
  isSizeDropdownOpen,
  onToggleSizeDropdown,
  seed,
  onSeedChange
}: GenerateModeProps) {
  const selectedNumImagesOption = numImagesOptions.find(option => option.value === numImages);

  return (
    <>
      <div>
        <label className="block text-white mb-2">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          rows={3}
          placeholder="Describe the image you want to generate..."
          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
        />
      </div>

      <div className="relative">
        <label className="block text-white mb-2">Number of Images</label>
        <button
          type="button"
          onClick={onToggleNumImagesDropdown}
          className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:border-white/40 hover:bg-white/15 transition-all duration-200 cursor-pointer flex items-center justify-between"
        >
          <span>{selectedNumImagesOption?.label}</span>
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isNumImagesDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isNumImagesDropdownOpen && (
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
            {numImagesOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onNumImagesChange(option.value)}
                className={`w-full p-3 text-left text-white hover:bg-white/20 transition-all duration-200 border-none ${
                  numImages === option.value ? 'bg-white/25' : 'bg-transparent'
                }`}
                style={{ outline: 'none' }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <SizeDropdown
        value={size}
        options={sizeOptions}
        isOpen={isSizeDropdownOpen}
        onToggle={onToggleSizeDropdown}
        onSelect={onSizeChange}
        label="Size"
      />

      <div>
        <label className="block text-white mb-2">Seed (Optional)</label>
        <input
          type="number"
          value={seed}
          onChange={(e) => onSeedChange(e.target.value)}
          placeholder="Leave empty for random seed"
          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
        />
      </div>
    </>
  );
}