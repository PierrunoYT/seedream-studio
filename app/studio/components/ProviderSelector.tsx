"use client";

import { useState } from "react";
import { ApiProviderType } from "../../../lib/api/types";
import { ApiProviderFactory } from "../../../lib/api/factory";

interface ProviderSelectorProps {
  currentProvider: ApiProviderType;
  onProviderChange: (provider: ApiProviderType) => void;
  disabled?: boolean;
}

export default function ProviderSelector({ 
  currentProvider, 
  onProviderChange, 
  disabled = false 
}: ProviderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const availableProviders = ApiProviderFactory.getAvailableProviders();

  const getProviderDisplayName = (provider: ApiProviderType): string => {
    switch (provider) {
      case ApiProviderType.FAL:
        return "FAL AI";
      case ApiProviderType.WAVESPEED:
        return "WavespeedAI";
      // Add other providers here
      // case ApiProviderType.REPLICATE:
      //   return "Replicate";
      // case ApiProviderType.OPENAI:
      //   return "OpenAI DALL-E";
      default:
        return provider;
    }
  };

  const getProviderDescription = (provider: ApiProviderType): string => {
    switch (provider) {
      case ApiProviderType.FAL:
        return "Bytedance Seedream v4 via FAL AI - Generate 1-6 images per request";
      case ApiProviderType.WAVESPEED:
        return "Bytedance Seedream v4 via WavespeedAI - Ultra-fast inference (1.8s for 2K images)";
      // Add other providers here
      default:
        return "";
    }
  };

  const handleProviderSelect = (provider: ApiProviderType) => {
    onProviderChange(provider);
    setIsOpen(false);
  };

  if (availableProviders.length <= 1) {
    // Don't show selector if there's only one provider
    return null;
  }

  return (
    <div className="relative">
      <label className="block text-white mb-2">API Provider</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:border-white/40 hover:bg-white/15 transition-all duration-200 cursor-pointer flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="text-left">
          <div className="font-medium">{getProviderDisplayName(currentProvider)}</div>
          <div className="text-xs text-white/60">{getProviderDescription(currentProvider)}</div>
        </div>
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
          {availableProviders.map((provider) => (
            <button
              key={provider}
              type="button"
              onClick={() => handleProviderSelect(provider)}
              className={`w-full p-3 text-left text-white hover:bg-white/20 transition-all duration-200 border-none ${
                currentProvider === provider ? 'bg-white/25' : 'bg-transparent'
              }`}
              style={{ outline: 'none' }}
            >
              <div className="font-medium">{getProviderDisplayName(provider)}</div>
              <div className="text-xs text-white/60">{getProviderDescription(provider)}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}