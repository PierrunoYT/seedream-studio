# Seedream API Provider Architecture

This directory contains a flexible API provider system that allows you to easily switch between different AI image generation services.

## Structure

```
lib/api/
├── types.ts              # Common types and interfaces
├── client.ts             # Main API client
├── factory.ts            # Provider factory
├── index.ts              # Main exports
├── providers/
│   ├── fal-provider.ts   # FAL AI implementation
│   └── template-provider.ts # Template for new providers
└── README.md             # This file
```

## How to Add a New Provider

1. **Create the provider class**: Copy `template-provider.ts` and rename it (e.g., `replicate-provider.ts`)

2. **Implement the required methods**:
   - `generateImage()` - Text-to-image generation
   - `editImage()` - Image editing (if supported)
   - `uploadFile()` - File upload (if supported)
   - Queue methods (if supported)

3. **Add to the factory**: Update `factory.ts` to include your new provider

4. **Add to types**: Update `ApiProviderType` enum in `types.ts`

5. **Update configuration**: Add provider config in `lib/config/providers.ts`

## Example: Adding Replicate Provider

### Step 1: Create the provider

```typescript
// lib/api/providers/replicate-provider.ts
import { ApiProvider, ImageGenerationRequest, ImageGenerationResponse } from "../types";

export class ReplicateProvider extends ApiProvider {
  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    // Implement Replicate API calls here
  }
  
  async editImage(request: ImageEditRequest): Promise<ImageGenerationResponse> {
    throw new Error('Image editing not supported by Replicate');
  }
}
```

### Step 2: Update the factory

```typescript
// lib/api/factory.ts
import { ReplicateProvider } from './providers/replicate-provider';

export class ApiProviderFactory {
  static create(type: ApiProviderType, config: ApiConfig): ApiProvider {
    switch (type) {
      case ApiProviderType.FAL:
        return new FALProvider(config);
      case ApiProviderType.REPLICATE:
        return new ReplicateProvider(config);
      // ...
    }
  }
}
```

### Step 3: Update types

```typescript
// lib/api/types.ts
export enum ApiProviderType {
  FAL = 'fal',
  REPLICATE = 'replicate',
}
```

## Current Implementation

### FAL Provider
- ✅ Text-to-image generation
- ✅ Image editing
- ✅ File upload
- ✅ Queue operations
- ✅ Custom image sizes

### Features Supported

- **Multiple image sizes**: Standard presets and custom dimensions
- **Batch generation**: Generate multiple images at once
- **Seed control**: Reproducible results
- **File upload**: Direct file upload or base64 fallback
- **Queue operations**: For long-running requests
- **Error handling**: Standardized error responses

## Usage in Components

```typescript
import { useImageGeneration } from './hooks/useImageGeneration';
import { ApiProviderType } from '../lib/api/types';

// In your component
const { runGenerateModel, switchProvider, currentProvider } = useImageGeneration({
  apiKey,
  onSaveImage,
  provider: ApiProviderType.FAL
});

// Switch provider
switchProvider(ApiProviderType.REPLICATE);
```

## Best Practices

1. **Error Handling**: Always wrap API calls in try-catch blocks
2. **Type Safety**: Use TypeScript interfaces for request/response types
3. **Standardization**: Map provider-specific responses to common interfaces
4. **Fallbacks**: Provide fallback options (e.g., base64 for file upload)
5. **Configuration**: Keep provider-specific settings in config files