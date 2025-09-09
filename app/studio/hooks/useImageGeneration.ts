"use client";

import { useState } from "react";

interface UseImageGenerationProps {
  apiKey: string;
  onSaveImage: (url: string, prompt: string, mode: 'generate' | 'edit') => void;
}

export function useImageGeneration({ apiKey, onSaveImage }: UseImageGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("");
  const [resultUrl, setResultUrl] = useState("");

  const runGenerateModel = async (prompt: string, size: string, numImages: number, seed?: string) => {
    if (!apiKey) {
      setStatus("Your FAL API Key is not set");
      return;
    }

    setIsGenerating(true);
    setStatus("Generating image...");
    setResultUrl("");

    const payload = {
      prompt,
      image_size: size,
      num_images: numImages,
      ...(seed && { seed: parseInt(seed) })
    };

    try {
      const response = await fetch("https://fal.run/fal-ai/bytedance/seedream/v4/text-to-image", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Key ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        setStatus(`Error: ${response.status} - ${errorText}`);
        setIsGenerating(false);
        return;
      }

      const result = await response.json();
      
      if (result.images && result.images.length > 0) {
        const imageUrl = result.images[0].url;
        setStatus("Image generation completed!");
        setResultUrl(imageUrl);
        onSaveImage(imageUrl, prompt, 'generate');
      } else {
        setStatus("No images generated");
      }
    } catch (error) {
      setStatus(`Request failed: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const runEditModel = async (prompt: string, imageUrls: string[], size: string, seed?: string) => {
    if (!apiKey) {
      setStatus("Your FAL API Key is not set");
      return;
    }

    if (imageUrls.length === 0) {
      setStatus("Please add at least one image URL for editing");
      return;
    }

    setIsGenerating(true);
    setStatus("Editing image...");
    setResultUrl("");

    const payload = {
      prompt,
      image_size: size,
      image_urls: imageUrls,
      ...(seed && { seed: parseInt(seed) })
    };

    try {
      const response = await fetch("https://fal.run/fal-ai/bytedance/seedream/v4/edit", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Key ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        setStatus(`Error: ${response.status} - ${errorText}`);
        setIsGenerating(false);
        return;
      }

      const result = await response.json();
      
      if (result.images && result.images.length > 0) {
        const imageUrl = result.images[0].url;
        setStatus("Image editing completed!");
        setResultUrl(imageUrl);
        onSaveImage(imageUrl, prompt, 'edit');
      } else {
        setStatus("No images generated");
      }
    } catch (error) {
      setStatus(`Request failed: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    status,
    resultUrl,
    setResultUrl,
    setStatus,
    runGenerateModel,
    runEditModel
  };
}