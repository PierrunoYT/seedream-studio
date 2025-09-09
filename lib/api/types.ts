// Common types for all API providers

export interface ImageGenerationRequest {
  prompt: string;
  imageSize?: ImageSize | CustomImageSize;
  numImages?: number;
  maxImages?: number;
  seed?: number;
  syncMode?: boolean;
}

export interface ImageEditRequest {
  prompt: string;
  imageUrls?: string[];
  imageSize?: ImageSize | CustomImageSize;
  numImages?: number;
  maxImages?: number;
  seed?: number;
  syncMode?: boolean;
}

export interface SequentialEditRequest {
  prompt: string;
  imageUrls?: string[];
  imageSize?: ImageSize | CustomImageSize;
  maxImages?: number;
  seed?: number;
  syncMode?: boolean;
}

export interface SequentialGenerateRequest {
  prompt: string;
  imageSize?: ImageSize | CustomImageSize;
  maxImages?: number;
  seed?: number;
  syncMode?: boolean;
}

export interface ImageGenerationResponse {
  images: GeneratedImage[];
  seed?: number;
  requestId?: string;
}

export interface GeneratedImage {
  url: string;
  width?: number;
  height?: number;
  contentType?: string;
  fileName?: string;
  fileSize?: number;
}

export interface CustomImageSize {
  width: number;
  height: number;
}

export type ImageSize = 
  | 'square_hd' 
  | 'square' 
  | 'portrait_4_3' 
  | 'portrait_16_9' 
  | 'landscape_4_3' 
  | 'landscape_16_9';

export interface ApiConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface QueueStatus {
  status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  logs?: string[];
  progress?: number;
}

export abstract class ApiProvider {
  protected config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  abstract generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse>;
  abstract editImage(request: ImageEditRequest): Promise<ImageGenerationResponse>;
  
  // Optional sequential methods for providers that support them
  sequentialEdit?(request: SequentialEditRequest): Promise<ImageGenerationResponse>;
  sequentialGenerate?(request: SequentialGenerateRequest): Promise<ImageGenerationResponse>;
  
  // Optional queue methods for providers that support it
  abstract submitGeneration?(request: ImageGenerationRequest): Promise<{ requestId: string }>;
  abstract getQueueStatus?(requestId: string): Promise<QueueStatus>;
  abstract getResult?(requestId: string): Promise<ImageGenerationResponse>;
  
  // File upload support
  abstract uploadFile?(file: File): Promise<string>;
}

export enum ApiProviderType {
  FAL = 'fal',
  WAVESPEED = 'wavespeed',
  REPLICATE = 'replicate',
  // Add other providers here
  // OPENAI = 'openai'
}