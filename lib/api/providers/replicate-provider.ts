
import Replicate from "replicate";
import {
  ApiProvider,
  ApiConfig,
  ImageGenerationRequest,
  ImageEditRequest,
  ImageGenerationResponse,
  QueueStatus,
} from "../types";

interface ReplicateParams {
  prompt: string;
  size?: "1K" | "2K" | "4K" | "custom";
  width?: number;
  height?: number;
  aspect_ratio?: "match_input_image" | "1:1" | "4:3" | "3:4" | "16:9" | "9:16" | "3:2" | "2:3" | "21:9";
  max_images?: number;
  image_input?: string[];
  sequential_image_generation?: "disabled" | "auto";
}

// Replicate output types
interface ReplicateOutputItem {
  url(): string;
}

type ReplicateOutput = string | ReplicateOutputItem;

export class ReplicateProvider extends ApiProvider {
  private replicate: Replicate;

  constructor(config: ApiConfig) {
    super(config);
    this.replicate = new Replicate({
      auth: config.apiKey,
    });
  }

  private buildReplicateParams(request: ImageGenerationRequest | ImageEditRequest): Partial<ReplicateParams> {
    const params: Partial<ReplicateParams> = {
      prompt: request.prompt,
      sequential_image_generation: "disabled"
    };

    // Handle max_images (1-15 range)
    const numImages = request.numImages || 1;
    params.max_images = Math.min(Math.max(numImages, 1), 15);

    // Handle image input (1-10 images for image-to-image)
    if ('imageUrls' in request && request.imageUrls?.length) {
      params.image_input = request.imageUrls.slice(0, 10); // Limit to 10 images
    }

    // Handle image size and aspect ratio
    if (request.imageSize) {
      if (typeof request.imageSize === 'object' && 'width' in request.imageSize && 'height' in request.imageSize) {
        // Custom dimensions (1024-4096 range)
        params.size = "custom";
        params.width = Math.min(Math.max(request.imageSize.width, 1024), 4096);
        params.height = Math.min(Math.max(request.imageSize.height, 1024), 4096);
      } else {
        // Preset sizes with aspect ratios
        const sizeAspectMap: Record<string, { size: "1K" | "2K" | "4K", aspect: string }> = {
          "square": { size: "1K", aspect: "1:1" },
          "square_hd": { size: "2K", aspect: "1:1" },
          "portrait_4_3": { size: "2K", aspect: "3:4" },
          "portrait_16_9": { size: "2K", aspect: "9:16" },
          "landscape_4_3": { size: "2K", aspect: "4:3" },
          "landscape_16_9": { size: "2K", aspect: "16:9" }
        };
        
        const config = sizeAspectMap[request.imageSize as string];
        if (config) {
          params.size = config.size;
          params.aspect_ratio = config.aspect as ReplicateParams['aspect_ratio'];
        } else {
          params.size = "2K";
          params.aspect_ratio = "1:1";
        }
      }
    } else {
      // Defaults
      params.size = "2K";
      params.aspect_ratio = "match_input_image";
    }

    return params;
  }

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    try {
      const params = this.buildReplicateParams(request);
      const output = await this.replicate.run(
        "bytedance/seedream-4",
        {
          input: {
            ...params,
            seed: request.seed,
          },
        }
      );

      if (!Array.isArray(output) || output.length === 0) {
        throw new Error("Invalid response from Replicate API");
      }

      return {
        images: output.map((item: ReplicateOutput) => ({
          url: typeof item === 'string' ? item : item.url(),
        })),
        seed: request.seed,
      };
    } catch (error) {
      console.error('Replicate Image Generation Error:', error);
      throw new Error(`Replicate API Error: ${error}`);
    }
  }

  async editImage(request: ImageEditRequest): Promise<ImageGenerationResponse> {
    try {
      const params = this.buildReplicateParams(request);
      const output = await this.replicate.run(
        "bytedance/seedream-4",
        {
          input: {
            ...params,
            seed: request.seed,
          },
        }
      );

      if (!Array.isArray(output) || output.length === 0) {
        throw new Error("Invalid response from Replicate API");
      }

      return {
        images: output.map((item: ReplicateOutput) => ({
          url: typeof item === 'string' ? item : item.url(),
        })),
        seed: request.seed,
      };
    } catch (error) {
      console.error('Replicate Image Edit Error:', error);
      throw new Error(`Replicate API Error: ${error}`);
    }
  }

  async submitGeneration(request: ImageGenerationRequest): Promise<{ requestId: string }> {
    const params = this.buildReplicateParams(request);
    const prediction = await this.replicate.predictions.create({
      version: "a5b6d65516c0f279e518a6151d3844758b347a95164ead571533a58a1a6c611d",
      input: {
        ...params,
        seed: request.seed,
      },
    });
    return { requestId: prediction.id };
  }

  async getQueueStatus(requestId: string): Promise<QueueStatus> {
    const prediction = await this.replicate.predictions.get(requestId);
    let status: QueueStatus['status'] = 'QUEUED';
    if (prediction.status === 'succeeded') {
        status = 'COMPLETED';
    } else if (prediction.status === 'failed') {
        status = 'FAILED';
    } else if (prediction.status === 'processing' || prediction.status === 'starting') {
        status = 'IN_PROGRESS';
    }
    return {
        status: status,
        logs: prediction.logs?.split('\n') || [],
    };
  }

  async getResult(requestId: string): Promise<ImageGenerationResponse> {
    const prediction = await this.replicate.predictions.get(requestId);
    if (prediction.status !== 'succeeded' || !Array.isArray(prediction.output)) {
        throw new Error(`Prediction not successful or output is invalid. Status: ${prediction.status}`);
    }
    return {
        images: prediction.output.map((url: string) => ({
          url: url,
        })),
    };
  }

  async uploadFile(file: File): Promise<string> {
    console.log("Uploading file with Replicate:", file);
    throw new Error("File upload is not yet implemented for Replicate.");
  }
}

