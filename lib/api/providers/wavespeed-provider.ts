import {
  ApiProvider,
  ApiConfig,
  ImageGenerationRequest,
  ImageEditRequest,
  ImageGenerationResponse,
  QueueStatus,
  CustomImageSize,
} from "../types";

interface WavespeedResponse {
  code: number;
  message: string;
  data: {
    id: string;
    model: string;
    outputs: string[];
    urls: {
      get: string;
    };
    has_nsfw_contents: boolean[];
    status: 'created' | 'processing' | 'completed' | 'failed';
    created_at: string;
    error: string;
    timings: {
      inference: number;
    };
  };
}

export class WavespeedProvider extends ApiProvider {
  private readonly baseUrl = 'https://api.wavespeed.ai/api/v3';

  constructor(config: ApiConfig) {
    super(config);
  }

  private getImageSize(imageSize?: string | CustomImageSize): string {
    if (!imageSize) return '2048*2048';
    
    if (typeof imageSize === 'object') {
      return `${imageSize.width}*${imageSize.height}`;
    }
    
    // Convert named sizes to dimensions
    const sizeMap: Record<string, string> = {
      'square_hd': '2048*2048',
      'square': '1024*1024',
      'portrait_4_3': '1536*2048',
      'portrait_16_9': '1152*2048',
      'landscape_4_3': '2048*1536',
      'landscape_16_9': '2048*1152'
    };
    
    return sizeMap[imageSize] || '2048*2048';
  }

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    try {
      const size = this.getImageSize(request.imageSize);
      
      const payload = {
        prompt: request.prompt,
        size,
        seed: request.seed || -1,
        enable_base64_output: false,
        enable_sync_mode: request.syncMode || false
      };

      const response = await fetch(`${this.baseUrl}/bytedance/seedream-v4`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const result: WavespeedResponse = await response.json();
      
      if (result.code !== 200) {
        throw new Error(`API Error: ${result.message}`);
      }

      const requestId = result.data.id;

      // If sync mode is enabled, wait for completion
      if (request.syncMode) {
        return await this.waitForCompletion(requestId);
      }

      // For async mode, return the request ID for tracking
      return {
        images: [],
        requestId,
        seed: request.seed
      };
    } catch (error) {
      console.error('WavespeedAI Image Generation Error:', error);
      throw new Error(`WavespeedAI API Error: ${error}`);
    }
  }

  async editImage(request: ImageEditRequest): Promise<ImageGenerationResponse> {
    // Wavespeed supports image editing through the same endpoint with additional parameters
    // For now, we'll use the text-to-image endpoint with the prompt
    return await this.generateImage({
      prompt: request.prompt,
      imageSize: request.imageSize,
      numImages: request.numImages,
      seed: request.seed,
      syncMode: request.syncMode
    });
  }

  async submitGeneration(request: ImageGenerationRequest): Promise<{ requestId: string }> {
    const result = await this.generateImage({
      ...request,
      syncMode: false
    });
    
    if (!result.requestId) {
      throw new Error('Failed to get request ID from WavespeedAI');
    }
    
    return { requestId: result.requestId };
  }

  async getQueueStatus(requestId: string): Promise<QueueStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/predictions/${requestId}/result`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const result: WavespeedResponse = await response.json();
      
      if (result.code !== 200) {
        throw new Error(`API Error: ${result.message}`);
      }

      const statusMap: Record<string, QueueStatus['status']> = {
        'created': 'QUEUED',
        'processing': 'IN_PROGRESS',
        'completed': 'COMPLETED',
        'failed': 'FAILED'
      };

      return {
        status: statusMap[result.data.status] || 'QUEUED',
        progress: result.data.status === 'completed' ? 100 : 
                 result.data.status === 'processing' ? 50 : 0
      };
    } catch (error) {
      console.error('WavespeedAI Queue Status Error:', error);
      throw new Error(`WavespeedAI API Error: ${error}`);
    }
  }

  async getResult(requestId: string): Promise<ImageGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/predictions/${requestId}/result`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const result: WavespeedResponse = await response.json();
      
      if (result.code !== 200) {
        throw new Error(`API Error: ${result.message}`);
      }

      if (result.data.status === 'failed') {
        throw new Error(`Generation failed: ${result.data.error}`);
      }

      if (result.data.status !== 'completed') {
        throw new Error(`Generation not completed yet. Status: ${result.data.status}`);
      }

      return {
        images: result.data.outputs.map(url => ({
          url,
          width: 2048, // Default, could be parsed from size parameter
          height: 2048
        })),
        requestId,
        seed: undefined // WavespeedAI doesn't return the seed in results
      };
    } catch (error) {
      console.error('WavespeedAI Get Result Error:', error);
      throw new Error(`WavespeedAI API Error: ${error}`);
    }
  }

  private async waitForCompletion(requestId: string): Promise<ImageGenerationResponse> {
    const maxAttempts = 300; // 30 seconds with 100ms intervals
    let attempts = 0;

    while (attempts < maxAttempts) {
      const status = await this.getQueueStatus(requestId);
      
      if (status.status === 'COMPLETED') {
        return await this.getResult(requestId);
      }
      
      if (status.status === 'FAILED') {
        throw new Error('Image generation failed');
      }
      
      // Wait 100ms before next check
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    throw new Error('Image generation timed out');
  }

  async uploadFile(_file: File): Promise<string> {
    throw new Error('File upload not supported by WavespeedAI provider');
  }
}