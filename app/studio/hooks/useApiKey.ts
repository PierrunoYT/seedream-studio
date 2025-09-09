"use client";

import { useState, useEffect } from "react";

export function useApiKey() {
  const [apiKey, setApiKey] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const savedApiKey = localStorage.getItem('seedream_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    if (isHydrated) {
      if (value.trim()) {
        localStorage.setItem('seedream_api_key', value);
      } else {
        localStorage.removeItem('seedream_api_key');
      }
    }
  };

  const clearApiKey = () => {
    setApiKey("");
    if (isHydrated) {
      localStorage.removeItem('seedream_api_key');
    }
  };

  return {
    apiKey,
    handleApiKeyChange,
    clearApiKey
  };
}