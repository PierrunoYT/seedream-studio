"use client";

import { useState, useEffect } from "react";

export interface SavedImage {
  url: string;
  prompt: string;
  timestamp: number;
  mode: 'generate' | 'edit';
}

export function useImageHistory() {
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const savedImagesData = localStorage.getItem('seedream_saved_images');
    if (savedImagesData) {
      try {
        const parsedImages = JSON.parse(savedImagesData);
        setSavedImages(parsedImages);
      } catch (error) {
        console.error('Error parsing saved images:', error);
        localStorage.removeItem('seedream_saved_images');
      }
    }
  }, []);

  const saveImageToHistory = (url: string, promptText: string, mode: 'generate' | 'edit') => {
    const newImage: SavedImage = {
      url,
      prompt: promptText,
      timestamp: Date.now(),
      mode
    };
    
    const updatedImages = [newImage, ...savedImages].slice(0, 20);
    setSavedImages(updatedImages);
    if (isHydrated) {
      localStorage.setItem('seedream_saved_images', JSON.stringify(updatedImages));
    }
  };

  const clearImageHistory = () => {
    setSavedImages([]);
    if (isHydrated) {
      localStorage.removeItem('seedream_saved_images');
    }
  };

  const removeImageFromHistory = (timestamp: number) => {
    const updatedImages = savedImages.filter(img => img.timestamp !== timestamp);
    setSavedImages(updatedImages);
    if (isHydrated) {
      localStorage.setItem('seedream_saved_images', JSON.stringify(updatedImages));
    }
  };

  return {
    savedImages,
    saveImageToHistory,
    clearImageHistory,
    removeImageFromHistory
  };
}