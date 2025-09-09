"use client";

import { useState } from "react";
import Image from "next/image";

interface SavedImage {
  url: string;
  prompt: string;
  timestamp: number;
  mode: 'generate' | 'edit';
}

interface ImageHistorySectionProps {
  savedImages: SavedImage[];
  onClearHistory: () => void;
  onRemoveImage: (timestamp: number) => void;
  onUseImageForEditing: (imageUrl: string) => void;
  onSetResultUrl: (url: string) => void;
}

export default function ImageHistorySection({ 
  savedImages, 
  onClearHistory, 
  onRemoveImage, 
  onUseImageForEditing,
  onSetResultUrl 
}: ImageHistorySectionProps) {
  const [showImageHistory, setShowImageHistory] = useState(false);

  if (savedImages.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-white">Image History ({savedImages.length})</label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowImageHistory(!showImageHistory)}
            className="text-white/60 hover:text-white/80 transition-colors"
            title="Toggle Image History"
          >
            <svg className={`w-4 h-4 transition-transform duration-200 ${showImageHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onClearHistory}
            className="text-white/60 hover:text-red-400 transition-colors"
            title="Clear All Images"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {showImageHistory && (
        <div className="mb-3 p-3 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-start space-x-2 mb-3">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="font-medium text-white/80 mb-1">Saved Images</p>
              <p className="mb-2 text-sm text-white/70">Your generated and edited images are saved locally in your browser for easy access.</p>
              <p className="text-xs text-white/60">• Stored in browser&apos;s localStorage • Only accessible to you • Last 20 images kept • Cleared when you delete browser data</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
            {savedImages.map((image) => (
              <div key={image.timestamp} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10 cursor-pointer" onClick={() => onSetResultUrl(image.url)}>
                  <Image
                    src={image.url} 
                    alt={`${image.mode} image`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex flex-col justify-between p-2">
                  <div className="flex justify-between items-start">
                    <span className={`text-xs px-2 py-1 rounded ${
                      image.mode === 'generate' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {image.mode === 'generate' ? 'Generated' : 'Edited'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveImage(image.timestamp);
                      }}
                      className="text-white/60 hover:text-red-400 transition-colors"
                      title="Delete image"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetResultUrl(image.url);
                        }}
                        className="flex-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs text-white transition-colors"
                        title="View full size"
                      >
                        View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUseImageForEditing(image.url);
                        }}
                        className="flex-1 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-xs text-white transition-colors"
                        title="Use for editing"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-xs text-white/80 line-clamp-2 mb-1">{image.prompt}</p>
                    <p className="text-xs text-white/60">{new Date(image.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}