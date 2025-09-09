import { fal } from "@fal-ai/client";
import {
  ApiProvider,
  ApiConfig,
  ImageGenerationRequest,
  ImageEditRequest,
  ImageGenerationResponse,
  QueueStatus,
  ImageSize,
  CustomImageSize
} from "../types";

// FAL API response types
interface FALImage {
  url: string;
  width?: number;
  height?: number;
  content_type?: string;
  file_name?: string;
  file_size?: number;
}

interface FALResponse {
  images: FALImage[];
  seed?: number;
}

interface FALResult {
  data: FALResponse;
  requestId: string;
}

interface FALQueueStatus {
  status: string;
  logs?: { message: string }[];
  progress?: number;
}

interface FALLog {
  message: string;
}

export class FALProvider extends ApiProvider {
  constructor(config: ApiConfig) {
    super(config);
    
    // Configure the FAL client
    fal.config({
      credentials: config.apiKey
    });
  }

  private mapImageSize(size?: ImageSize | CustomImageSize): ImageSize | CustomImageSize | undefined {
    if (!size) return undefined;
    
    // If it's already a custom size object, return as is
    if (typeof size === 'object' && 'width' in size && 'height' in size) {
      return size;
    }
    
    return size;
  }

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    try {
      const result = await fal.subscribe("fal-ai/bytedance/seedream/v4/text-to-image", {
        input: {
          prompt: request.prompt,
          image_size: this.mapImageSize(request.imageSize),
          num_images: request.numImages || 1,
          seed: request.seed,
          sync_mode: request.syncMode
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs?.map((log: FALLog) => log.message).forEach(console.log);
          }
        },
      }) as FALResult;

      return {
        images: result.data.images.map((img: FALImage) => ({
          url: img.url,
          width: img.width,
          height: img.height,
          contentType: img.content_type,
          fileName: img.file_name,
          fileSize: img.file_size
        })),
        seed: result.data.seed,
        requestId: result.requestId
      };
    } catch (error) {
      console.error('FAL Image Generation Error:', error);
      throw new Error(`FAL API Error: ${error}`);
    }
  }

  async editImage(request: ImageEditRequest): Promise<ImageGenerationResponse> {
    try {
      // Validate image URLs limit (FAL supports up to 6 images)
      if (request.imageUrls && request.imageUrls.length > 6) {
        throw new Error("FAL Edit API supports maximum 6 input images");
      }

      const result = await fal.subscribe("fal-ai/bytedance/seedream/v4/edit", {
        input: {
          prompt: request.prompt,
          image_urls: request.imageUrls,
          image_size: this.mapImageSize(request.imageSize),
          num_images: request.numImages || 1, // Add num_images support for edit
          seed: request.seed,
          sync_mode: request.syncMode
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs?.map((log: FALLog) => log.message).forEach(console.log);
          }
        },
      }) as FALResult;

      return {
        images: result.data.images.map((img: FALImage) => ({
          url: img.url,
          width: img.width,
          height: img.height,
          contentType: img.content_type,
          fileName: img.file_name,
          fileSize: img.file_size
        })),
        seed: result.data.seed,
        requestId: result.requestId
      };
    } catch (error) {
      console.error('FAL Image Edit Error:', error);
      throw new Error(`FAL API Error: ${error}`);
    }
  }

  // Queue methods for advanced use cases
  async submitGeneration(request: ImageGenerationRequest): Promise<{ requestId: string }> {
    try {
      const { request_id } = await fal.queue.submit("fal-ai/bytedance/seedream/v4/text-to-image", {
        input: {
          prompt: request.prompt,
          image_size: this.mapImageSize(request.imageSize),
          num_images: request.numImages || 1,
          seed: request.seed,
          sync_mode: request.syncMode
        }
      });

      return { requestId: request_id };
    } catch (error) {
      console.error('FAL Queue Submit Error:', error);
      throw new Error(`FAL Queue API Error: ${error}`);
    }
  }

  async getQueueStatus(requestId: string): Promise<QueueStatus> {
    try {
      const status = await fal.queue.status("fal-ai/bytedance/seedream/v4/text-to-image", {
        requestId,
        logs: true,
      });

      return {
        status: status.status as QueueStatus['status'],
        logs: (status as FALQueueStatus).logs?.map((log: FALLog) => log.message) || [],
        progress: (status as FALQueueStatus).progress
      };
    } catch (error) {
      console.error('FAL Queue Status Error:', error);
      throw new Error(`FAL Queue Status Error: ${error}`);
    }
  }

  async getResult(requestId: string): Promise<ImageGenerationResponse> {
    try {
      const result = await fal.queue.result("fal-ai/bytedance/seedream/v4/text-to-image", {
        requestId
      }) as FALResult;

      return {
        images: result.data.images.map((img: FALImage) => ({
          url: img.url,
          width: img.width,
          height: img.height,
          contentType: img.content_type,
          fileName: img.file_name,
          fileSize: img.file_size
        })),
        seed: result.data.seed,
        requestId: result.requestId
      };
    } catch (error) {
      console.error('FAL Queue Result Error:', error);
      throw new Error(`FAL Queue Result Error: ${error}`);
    }
  }

  async uploadFile(file: File): Promise<string> {
    try {
      const url = await fal.storage.upload(file);
      return url;
    } catch (error) {
      console.error('FAL File Upload Error:', error);
      throw new Error(`FAL File Upload Error: ${error}`);
    }
  }
}