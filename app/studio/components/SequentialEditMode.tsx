"use client";

import { useRef } from "react";
import Image from "next/image";
import SizeDropdown from "./SizeDropdown";
import { ApiProviderType } from "../../../lib/api/types";

interface SequentialEditModeProps {
  imageUrls: string[];
  onAddImageUrl: () => void;
  onRemoveImageUrl: (index: number) => void;
  newImageUrl: string;
  onNewImageUrlChange: (value: string) => void;
  prompt: string;
  onPromptChange: (value: string) => void;
  maxImages: number;
  onMaxImagesChange: (value: number) => void;
  isMaxImagesDropdownOpen: boolean;
  onToggleMaxImagesDropdown: () => void;
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
  { value: 15, label: "15 Images" },
];

export default function SequentialEditMode({
  imageUrls,
  onAddImageUrl,
  onRemoveImageUrl,
  newImageUrl,
  onNewImageUrlChange,
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
  isDragging,
  isUploading,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onLoadExamples,
  currentProvider
}: SequentialEditModeProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedMaxImagesOption = maxImagesOptions.find(option => option.value === maxImages);

  return (
    <>
      <div data-sequential-edit-section>
        <h2 className="text-white text-xl mb-4 flex items-center">
          <span className="text-2xl mr-3">🔄</span>
          Sequential Image Editing
        </h2>
        
        {/* Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="text-blue-400 mt-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm text-blue-200">
              <p className="font-medium mb-1">Sequential Editing Mode</p>
              <p>Generate multiple variations or apply sequential transformations. Input images are optional - you can also generate from text only.</p>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="mb-6">
          <label className="block text-white mb-3">Input Images (Optional)</label>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging 
                ? 'border-white/60 bg-white/10' 
                : 'border-white/20 hover:border-white/40'
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-white/10 rounded-full">
                <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="text-white/80">
                {isUploading ? (
                  <p>Processing files...</p>
                ) : (
                  <>
                    <p className="font-medium">Drop images here or click to upload</p>
                    <p className="text-sm text-white/60">Optional: Add base images for sequential editing</p>
                  </>
                )}
              </div>
              <div className="flex gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && onFileSelect(e.target.files)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-all duration-200 disabled:opacity-50"
                >
                  Choose Files
                </button>
                <button
                  type="button"
                  onClick={onLoadExamples}
                  disabled={isUploading}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-all duration-200 disabled:opacity-50"
                >
                  Load Examples
                </button>
              </div>
            </div>
          </div>
          
          {/* Manual URL Input */}
          <div className="flex gap-2 mt-4">
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
              disabled={!newImageUrl.trim() || isUploading}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 border border-white/20 rounded-lg text-white transition-all duration-200 disabled:cursor-not-allowed"
            >
              Add URL
            </button>
          </div>
          
          {imageUrls.length > 0 && (
            <div className="space-y-2 mt-4">
              <p className="text-white/70 text-sm">Input images ({imageUrls.length}):</p>
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

        {/* Prompt Input */}
        <div className="mb-6">
          <label className="block text-white mb-2">Editing Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            rows={3}
            placeholder="Describe the sequential editing operations you want to perform..."
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
          />
        </div>

        {/* Max Images Control - Only for WavespeedAI Sequential Edit */}
        {currentProvider === ApiProviderType.WAVESPEED && (
          <div className="relative mb-6">
            <label className="block text-white mb-2">Maximum Images to Generate</label>
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
          <label className="block text-white mb-2">Seed (Optional)</label>
          <input
            type="number"
            value={seed}
            onChange={(e) => onSeedChange(e.target.value)}
            placeholder="Leave empty for random seed"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
          />
        </div>
      </div>
    </>
  );
}