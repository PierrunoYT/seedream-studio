import { ApiProvider, ApiProviderType, ApiConfig, ImageGenerationRequest, ImageEditRequest } from './types';
import { ApiProviderFactory } from './factory';

// Main API client that can switch between providers
export class SeedreamApiClient {
  private provider: ApiProvider;
  private providerType: ApiProviderType;

  constructor(providerType: ApiProviderType, config: ApiConfig) {
    this.providerType = providerType;
    this.provider = ApiProviderFactory.create(providerType, config);
  }

  // Switch to a different provider
  switchProvider(providerType: ApiProviderType, config: ApiConfig): void {
    this.providerType = providerType;
    this.provider = ApiProviderFactory.create(providerType, config);
  }

  // Get current provider type
  getCurrentProvider(): ApiProviderType {
    return this.providerType;
  }

  // Main API methods
  async generateImage(request: ImageGenerationRequest) {
    return this.provider.generateImage(request);
  }

  async editImage(request: ImageEditRequest) {
    return this.provider.editImage(request);
  }

  // Queue methods (if supported by provider)
  async submitGeneration(request: ImageGenerationRequest) {
    if (!this.provider.submitGeneration) {
      throw new Error(`Provider ${this.providerType} does not support queue operations`);
    }
    return this.provider.submitGeneration(request);
  }

  async getQueueStatus(requestId: string) {
    if (!this.provider.getQueueStatus) {
      throw new Error(`Provider ${this.providerType} does not support queue operations`);
    }
    return this.provider.getQueueStatus(requestId);
  }

  async getResult(requestId: string) {
    if (!this.provider.getResult) {
      throw new Error(`Provider ${this.providerType} does not support queue operations`);
    }
    return this.provider.getResult(requestId);
  }

  // File upload (if supported by provider)
  async uploadFile(file: File) {
    if (!this.provider.uploadFile) {
      throw new Error(`Provider ${this.providerType} does not support file upload`);
    }
    return this.provider.uploadFile(file);
  }

  // Helper method to check if provider supports queue operations
  supportsQueue(): boolean {
    return !!(this.provider.submitGeneration && this.provider.getQueueStatus && this.provider.getResult);
  }

  // Helper method to check if provider supports file upload
  supportsFileUpload(): boolean {
    return !!this.provider.uploadFile;
  }
}