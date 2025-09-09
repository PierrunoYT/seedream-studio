import { ApiProviderType } from '../api/types';

export interface ProviderConfig {
  name: string;
  displayName: string;
  description: string;
  supportsTextToImage: boolean;
  supportsImageEdit: boolean;
  supportsFileUpload: boolean;
  supportsQueue: boolean;
  apiKeyRequired: boolean;
  maxImageSize?: { width: number; height: number };
  supportedFormats?: string[];
  pricing?: {
    textToImage?: string;
    imageEdit?: string;
  };
}

export const PROVIDER_CONFIGS: Record<ApiProviderType, ProviderConfig> = {
  [ApiProviderType.FAL]: {
    name: 'fal',
    displayName: 'FAL AI',
    description: 'Bytedance Seedream v4 via FAL AI - Generate 1-6 images per request',
    supportsTextToImage: true,
    supportsImageEdit: true,
    supportsFileUpload: true,
    supportsQueue: true,
    apiKeyRequired: true,
    maxImageSize: { width: 4096, height: 4096 },
    supportedFormats: ['JPEG', 'PNG', 'WebP'],
    pricing: {
      textToImage: '$0.055 per image',
      imageEdit: '$0.055 per image'
    }
  },
  [ApiProviderType.WAVESPEED]: {
    name: 'wavespeed',
    displayName: 'WavespeedAI',
    description: 'Bytedance Seedream v4 via WavespeedAI - State-of-art image generation with ultra-fast inference',
    supportsTextToImage: true,
    supportsImageEdit: true,
    supportsFileUpload: true,
    supportsQueue: true,
    apiKeyRequired: true,
    maxImageSize: { width: 4096, height: 4096 },
    supportedFormats: ['JPEG', 'PNG', 'WebP'],
    pricing: {
      textToImage: 'Variable pricing',
      imageEdit: 'Variable pricing'
    }
  },
  [ApiProviderType.REPLICATE]: {
    name: 'replicate',
    displayName: 'Replicate',
    description: 'Bytedance Seedream v4 via Replicate - Generate up to 15 images with sequential generation support',
    supportsTextToImage: true,
    supportsImageEdit: true,
    supportsFileUpload: true,
    supportsQueue: true,
    apiKeyRequired: true,
    maxImageSize: { width: 4096, height: 4096 },
    supportedFormats: ['JPEG', 'PNG', 'WebP'],
    pricing: {
      textToImage: '$0.055 per image',
      imageEdit: '$0.055 per image'
    }
  },
};

export function getProviderConfig(provider: ApiProviderType): ProviderConfig {
  return PROVIDER_CONFIGS[provider];
}

export function getAvailableProviders(): ApiProviderType[] {
  return Object.keys(PROVIDER_CONFIGS) as ApiProviderType[];
}