"use client";

import { useRef } from "react";
import Image from "next/image";
import SizeDropdown from "./SizeDropdown";

interface EditModeProps {
  imageUrls: string[];
  onAddImageUrl: () => void;
  onRemoveImageUrl: (index: number) => void;
  newImageUrl: string;
  onNewImageUrlChange: (value: string) => void;
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
  isDragging: boolean;
  isUploading: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (files: FileList) => void;
  onLoadExamples: () => void;
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

export default function EditMode({
  imageUrls,
  onAddImageUrl,
  onRemoveImageUrl,
  newImageUrl,
  onNewImageUrlChange,
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
  onSeedChange,
  isDragging,
  isUploading,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onLoadExamples
}: EditModeProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedNumImagesOption = numImagesOptions.find(option => option.value === numImages);

  return (
    <>
      <div data-edit-section>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-white">Image URLs for Editing</label>
          <button
            type="button"
            onClick={onLoadExamples}
            className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-white/70 hover:text-white transition-all duration-200"
          >
            Load Examples
          </button>
        </div>
        <div className="space-y-4">
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
              isDragging 
                ? 'border-white/60 bg-white/10' 
                : 'border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/8'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && onFileSelect(e.target.files)}
              className="hidden"
            />
            <div className="flex flex-col items-center space-y-2">
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="text-white/70">
                {isUploading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Uploading...</span>
                  </span>
                ) : isDragging ? (
                  "Drop your images here"
                ) : (
                  <>
                    <p className="text-sm font-medium">Drop images here or click to browse</p>
                    <p className="text-xs text-white/50">Supports JPG, PNG, WebP and more</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => onNewImageUrlChange(e.target.value)}
              placeholder="Or paste image URL here..."
              className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
            <button
              type="button"
              onClick={onAddImageUrl}
              disabled={!newImageUrl.trim()}
              className="px-4 py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 border border-white/20 rounded-lg text-white font-light transition-all duration-300 backdrop-blur-sm disabled:cursor-not-allowed"
            >
              Add URL
            </button>
          </div>
          
          {imageUrls.length > 0 && (
            <div className="space-y-2">
              <p className="text-white/70 text-sm">Images to edit ({imageUrls.length}):</p>
              {imageUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                  <div className="relative w-12 h-12 rounded overflow-hidden">
                    <Image
                      src={url} 
                      alt={`Input ${index + 1}`} 
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <span className="flex-1 text-white/80 text-sm truncate">{url}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveImageUrl(index)}
                    className="p-1 text-white/60 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-white mb-2">Edit Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          rows={3}
          placeholder="Describe how you want to edit the images..."
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