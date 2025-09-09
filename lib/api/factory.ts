import { ApiProvider, ApiProviderType, ApiConfig } from './types';
import { FALProvider } from './providers/fal-provider';
import { WavespeedProvider } from './providers/wavespeed-provider';

// Factory to create API providers
export class ApiProviderFactory {
  static create(type: ApiProviderType, config: ApiConfig): ApiProvider {
    switch (type) {
      case ApiProviderType.FAL:
        return new FALProvider(config);
      
      case ApiProviderType.WAVESPEED:
        return new WavespeedProvider(config);
      
      // Add other providers here as you implement them
      // case ApiProviderType.REPLICATE:
      //   return new ReplicateProvider(config);
      // case ApiProviderType.OPENAI:
      //   return new OpenAIProvider(config);
      
      default:
        throw new Error(`Unsupported API provider: ${type}`);
    }
  }

  static getAvailableProviders(): ApiProviderType[] {
    return [
      ApiProviderType.FAL,
      ApiProviderType.WAVESPEED,
      // Add other providers here as they become available
    ];
  }
}