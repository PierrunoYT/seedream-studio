
import Replicate from "replicate";
import {
  ApiProvider,
  ApiConfig,
  ImageGenerationRequest,
  ImageEditRequest,
  ImageGenerationResponse,
  QueueStatus,
  ImageSize,
  CustomImageSize,
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
      max_images: request.numImages || 1,
      sequential_image_generation: "disabled"
    };

    if ('imageUrls' in request && request.imageUrls?.length) {
      params.image_input = request.imageUrls;
    }

    if (request.imageSize) {
      if (typeof request.imageSize === 'object' && 'width' in request.imageSize && 'height' in request.imageSize) {
        params.size = "custom";
        params.width = request.imageSize.width;
        params.height = request.imageSize.height;
      } else {
        const aspectRatioMap: Record<string, string> = {
          "square": "1:1",
          "square_hd": "1:1", 
          "portrait": "3:4",
          "landscape": "4:3",
          "wide": "16:9",
          "tall": "9:16"
        };
        params.aspect_ratio = aspectRatioMap[request.imageSize] || "1:1";
        params.size = "2K";
      }
    } else {
      params.size = "2K";
      params.aspect_ratio = "1:1";
    }

    return params;
  }

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    try {
      const params = this.buildReplicateParams(request);
      const output = await this.replicate.run(
        "bytedance/seedream-4:a5b6d65516c0f279e518a6151d3844758b347a95164ead571533a58a1a6c611d",
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
        images: output.map((url: string) => ({
          url: url,
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
        "bytedance/seedream-4:a5b6d65516c0f279e518a6151d3844758b347a95164ead571533a58a1a6c611d",
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
        images: output.map((url: string) => ({
          url: url,
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

