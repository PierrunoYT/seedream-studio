"use client";

import { useState } from "react";
import { SeedreamApiClient } from "../../../lib/api/client";
import { ApiProviderType, ImageSize, CustomImageSize } from "../../../lib/api/types";

interface UseImageGenerationProps {
  apiKey: string;
  onSaveImage: (url: string, prompt: string, mode: 'generate' | 'edit') => void;
  provider?: ApiProviderType;
}

export function useImageGeneration({ 
  apiKey, 
  onSaveImage, 
  provider = ApiProviderType.FAL 
}: UseImageGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [currentProvider, setCurrentProvider] = useState(provider);

  const createClient = (apiKey: string, providerType: ApiProviderType = currentProvider) => {
    return new SeedreamApiClient(providerType, { apiKey });
  };

  const validateImageSize = (size: string): ImageSize | CustomImageSize => {
    // Check if it's a valid ImageSize string
    const validSizes: ImageSize[] = [
      'square_hd', 
      'square', 
      'portrait_4_3', 
      'portrait_16_9', 
      'landscape_4_3', 
      'landscape_16_9'
    ];
    
    if (validSizes.includes(size as ImageSize)) {
      return size as ImageSize;
    }
    
    // If not a valid ImageSize, try to parse as custom dimensions
    try {
      const [width, height] = size.split('x').map(Number);
      if (width && height) {
        return { width, height };
      }
    } catch {
      // Fall through to default
    }
    
    // Default to square if parsing fails
    return 'square';
  };

  const runGenerateModel = async (prompt: string, size: string, numImages: number, seed?: string) => {
    if (!apiKey) {
      setStatus("Your API Key is not set");
      return;
    }

    setIsGenerating(true);
    setStatus("Generating image...");
    setResultUrl("");

    try {
      const client = createClient(apiKey);
      
      const result = await client.generateImage({
        prompt,
        imageSize: validateImageSize(size),
        numImages,
        seed: seed ? parseInt(seed) : undefined
      });

      if (result.images && result.images.length > 0) {
        const imageUrl = result.images[0].url;
        setStatus("Image generation completed!");
        setResultUrl(imageUrl);
        onSaveImage(imageUrl, prompt, 'generate');
      } else {
        setStatus("No images generated");
      }
    } catch (error) {
      console.error('Image generation error:', error);
      setStatus(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const runEditModel = async (prompt: string, imageUrls: string[], size: string, seed?: string, numImages?: number) => {
    if (!apiKey) {
      setStatus("Your API Key is not set");
      return;
    }

    if (imageUrls.length === 0) {
      setStatus("Please add at least one image URL for editing");
      return;
    }

    setIsGenerating(true);
    setStatus("Editing image...");
    setResultUrl("");

    try {
      const client = createClient(apiKey);
      
      const result = await client.editImage({
        prompt,
        imageUrls,
        imageSize: validateImageSize(size),
        numImages: numImages || 1,
        seed: seed ? parseInt(seed) : undefined
      });

      if (result.images && result.images.length > 0) {
        const imageUrl = result.images[0].url;
        setStatus("Image editing completed!");
        setResultUrl(imageUrl);
        onSaveImage(imageUrl, prompt, 'edit');
      } else {
        setStatus("No images generated");
      }
    } catch (error) {
      console.error('Image editing error:', error);
      setStatus(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const switchProvider = (newProvider: ApiProviderType) => {
    setCurrentProvider(newProvider);
  };

  const runSequentialEdit = async (prompt: string, imageUrls: string[], size: string, maxImages: number, seed?: string) => {
    if (!apiKey) {
      setStatus("Your API Key is not set");
      return;
    }

    setIsGenerating(true);
    setStatus("Running sequential edit...");
    setResultUrl("");

    try {
      const client = createClient(apiKey);
      
      // Check if provider supports sequential edit (only WavespeedAI for now)
      if (currentProvider !== ApiProviderType.WAVESPEED) {
        setStatus("Sequential editing is only available with WavespeedAI provider");
        return;
      }

      const result = await client.sequentialEdit({
        prompt,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        imageSize: validateImageSize(size),
        maxImages,
        seed: seed ? parseInt(seed) : undefined
      });

      if (result.images && result.images.length > 0) {
        const imageUrl = result.images[0].url;
        setStatus("Sequential edit completed!");
        setResultUrl(imageUrl);
        onSaveImage(imageUrl, prompt, 'edit');
      } else {
        setStatus("No images generated");
      }
    } catch (error) {
      console.error('Sequential edit error:', error);
      setStatus(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const runSequentialGenerate = async (prompt: string, size: string, maxImages: number, seed?: string) => {
    if (!apiKey) {
      setStatus("Your API Key is not set");
      return;
    }

    setIsGenerating(true);
    setStatus("Running sequential generation...");
    setResultUrl("");

    try {
      const client = createClient(apiKey);
      
      // Check if provider supports sequential generate (only WavespeedAI for now)
      if (currentProvider !== ApiProviderType.WAVESPEED) {
        setStatus("Sequential generation is only available with WavespeedAI provider");
        return;
      }

      const result = await client.sequentialGenerate({
        prompt,
        imageSize: validateImageSize(size),
        maxImages,
        seed: seed ? parseInt(seed) : undefined
      });

      if (result.images && result.images.length > 0) {
        const imageUrl = result.images[0].url;
        setStatus("Sequential generation completed!");
        setResultUrl(imageUrl);
        onSaveImage(imageUrl, prompt, 'generate');
      } else {
        setStatus("No images generated");
      }
    } catch (error) {
      console.error('Sequential generation error:', error);
      setStatus(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    if (!apiKey) {
      throw new Error("API Key is required for file upload");
    }

    try {
      const client = createClient(apiKey);
      
      if (client.supportsFileUpload()) {
        return await client.uploadFile(file);
      } else {
        // Fallback to base64 for providers that don't support file upload
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result && typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to read file'));
            }
          };
          reader.onerror = () => reject(new Error('File reading failed'));
          reader.readAsDataURL(file);
        });
      }
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };

  return {
    isGenerating,
    status,
    resultUrl,
    setResultUrl,
    setStatus,
    runGenerateModel,
    runEditModel,
    runSequentialEdit,
    runSequentialGenerate,
    currentProvider,
    switchProvider,
    uploadFile
  };
}