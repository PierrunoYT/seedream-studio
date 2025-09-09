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
    description: 'Bytedance Seedream v4 via FAL AI - Fast and reliable image generation',
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
  // Add configurations for other providers here
  // [ApiProviderType.REPLICATE]: {
  //   name: 'replicate',
  //   displayName: 'Replicate',
  //   description: 'Various models available on Replicate platform',
  //   supportsTextToImage: true,
  //   supportsImageEdit: false,
  //   supportsFileUpload: true,
  //   supportsQueue: true,
  //   apiKeyRequired: true,
  // },
};

export function getProviderConfig(provider: ApiProviderType): ProviderConfig {
  return PROVIDER_CONFIGS[provider];
}

export function getAvailableProviders(): ApiProviderType[] {
  return Object.keys(PROVIDER_CONFIGS) as ApiProviderType[];
}