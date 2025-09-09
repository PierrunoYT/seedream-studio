"use client";

import SizeDropdown from "./SizeDropdown";
import { ApiProviderType, CustomImageSize } from "../../../lib/api/types";

interface SequentialGenerateModeProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  maxImages: number;
  onMaxImagesChange: (value: number) => void;
  isMaxImagesDropdownOpen: boolean;
  onToggleMaxImagesDropdown: () => void;
  size: string | CustomImageSize;
  onSizeChange: (value: string | CustomImageSize) => void;
  isSizeDropdownOpen: boolean;
  onToggleSizeDropdown: () => void;
  seed: string;
  onSeedChange: (value: string) => void;
  currentProvider: ApiProviderType;
}

const sizeOptions = [
  { value: "square_hd", label: "Square HD (1024x1024)" },
  { value: "square", label: "Square (512x512)" },
  { value: "portrait_4_3", label: "Portrait 4:3" },
  { value: "portrait_16_9", label: "Portrait 16:9" },
  { value: "landscape_4_3", label: "Landscape 4:3" },
  { value: "landscape_16_9", label: "Landscape 16:9" },
];

const maxImagesOptions = [
  { value: 1, label: "1 Image" },
  { value: 2, label: "2 Images" },
  { value: 3, label: "3 Images" },
  { value: 4, label: "4 Images" },
  { value: 5, label: "5 Images" },
  { value: 6, label: "6 Images" },
  { value: 7, label: "7 Images" },
  { value: 8, label: "8 Images" },
  { value: 9, label: "9 Images" },
  { value: 10, label: "10 Images" },
  { value: 11, label: "11 Images" },
  { value: 12, label: "12 Images" },
  { value: 13, label: "13 Images" },
  { value: 14, label: "14 Images" },
];

export default function SequentialGenerateMode({
  prompt,
  onPromptChange,
  maxImages,
  onMaxImagesChange,
  isMaxImagesDropdownOpen,
  onToggleMaxImagesDropdown,
  size,
  onSizeChange,
  isSizeDropdownOpen,
  onToggleSizeDropdown,
  seed,
  onSeedChange,
  currentProvider
}: SequentialGenerateModeProps) {
  const selectedMaxImagesOption = maxImagesOptions.find(option => option.value === maxImages);

  return (
    <>
      <div data-sequential-generate-section>
        <h2 className="text-white text-xl mb-4 flex items-center">
          <span className="text-2xl mr-3">🎯</span>
          Sequential Image Generation
        </h2>
        
        {/* Info Banner */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="text-green-400 mt-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm text-green-200">
              <p className="font-medium mb-1">Sequential Generation Mode</p>
              <p>Generate multiple variations of the same concept in a single request. Perfect for creating image series, character variations, or style progressions.</p>
            </div>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="mb-6">
          <label className="block text-white mb-2">Generation Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            rows={4}
            placeholder="Describe the image series you want to generate. Use phrases like 'a series of', 'group of images', or 'variations of' for best results..."
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
          />
          
          {/* Prompt Tips */}
          <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-lg">
            <h5 className="text-white/90 text-sm font-medium mb-2">💡 Sequential Generation Tips</h5>
            <div className="text-xs text-white/70 space-y-1">
              <p>• Use &quot;a series of&quot; or &quot;group of images&quot; for consistent themes</p>
              <p>• Specify variations: &quot;different poses&quot;, &quot;various expressions&quot;, &quot;multiple angles&quot;</p>
              <p>• Include style consistency keywords: &quot;same style&quot;, &quot;consistent lighting&quot;, &quot;matching aesthetic&quot;</p>
            </div>
          </div>
        </div>

        {/* Max Images Control - Only for WavespeedAI Sequential */}
        {currentProvider === ApiProviderType.WAVESPEED && (
          <div className="relative mb-6">
            <label className="block text-white mb-2">Number of Images to Generate</label>
            <button
              type="button"
              onClick={onToggleMaxImagesDropdown}
              className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:border-white/40 hover:bg-white/15 transition-all duration-200 cursor-pointer flex items-center justify-between"
            >
              <span>{selectedMaxImagesOption?.label}</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${isMaxImagesDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isMaxImagesDropdownOpen && (
              <div 
                className="absolute top-full left-0 right-0 mt-1 border border-white/20 rounded-lg overflow-hidden shadow-2xl max-h-48 overflow-y-auto"
                style={{ 
                  zIndex: 10000,
                  position: 'absolute',
                  minWidth: '100%',
                  backgroundColor: 'rgba(88, 28, 135, 0.95)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                {maxImagesOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onMaxImagesChange(option.value)}
                    className={`w-full p-3 text-left text-white hover:bg-white/20 transition-all duration-200 border-none ${
                      maxImages === option.value ? 'bg-white/25' : 'bg-transparent'
                    }`}
                    style={{ outline: 'none' }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
            
            {/* Generation info */}
            <div className="mt-2 text-xs text-white/60">
              Generate up to 14 variations in a single request
            </div>
          </div>
        )}

        {/* Size Dropdown */}
        <SizeDropdown
          value={size}
          options={sizeOptions}
          isOpen={isSizeDropdownOpen}
          onToggle={onToggleSizeDropdown}
          onSelect={onSizeChange}
          label="Size"
        />

        {/* Seed Input */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-white">Seed (Optional)</label>
            <button
              type="button"
              onClick={() => onSeedChange(Math.floor(Math.random() * 1000000).toString())}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Random
            </button>
          </div>
          <input
            type="number"
            value={seed}
            onChange={(e) => onSeedChange(e.target.value)}
            placeholder="Leave empty for random seed"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
          />
          <div className="mt-1 text-xs text-white/60">
            Using the same seed will generate similar variations across the series
          </div>
        </div>

        {/* Example Prompts */}
        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
          <h5 className="text-white font-medium mb-3 flex items-center">
            <span className="text-lg mr-2">📝</span>
            Example Sequential Generation Prompts
          </h5>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-white/90 font-medium">Character Series:</p>
              <p className="text-white/70 text-xs mt-1">&quot;A series of anime characters with different expressions: happy, sad, surprised, angry, each in the same art style&quot;</p>
            </div>
            <div>
              <p className="text-white/90 font-medium">Style Progression:</p>
              <p className="text-white/70 text-xs mt-1">&quot;Group of images showing a landscape transforming from realistic to impressionist to abstract art style&quot;</p>
            </div>
            <div>
              <p className="text-white/90 font-medium">Product Variations:</p>
              <p className="text-white/70 text-xs mt-1">&quot;A series of smartphone designs in different colors: black, white, blue, red, maintaining the same modern aesthetic&quot;</p>
            </div>
            <div>
              <p className="text-white/90 font-medium">Pose Variations:</p>
              <p className="text-white/70 text-xs mt-1">&quot;Multiple images of a dancer in different ballet positions, consistent lighting and background&quot;</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}