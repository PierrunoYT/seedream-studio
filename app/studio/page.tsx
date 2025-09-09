"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Studio() {
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState("American retro style: a girl wearing a polka-dot dress with sunglasses adorning her head.");
  const [size, setSize] = useState("2048*2048");
  const [seed, setSeed] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showApiKeyInfo, setShowApiKeyInfo] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('seedream_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save API key to localStorage when it changes
  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    if (value.trim()) {
      localStorage.setItem('seedream_api_key', value);
    } else {
      localStorage.removeItem('seedream_api_key');
    }
  };

  // Clear stored API key
  const clearApiKey = () => {
    setApiKey("");
    localStorage.removeItem('seedream_api_key');
  };

  const sizeOptions = [
    { value: "512*512", label: "512x512" },
    { value: "768*768", label: "768x768" },
    { value: "1024*1024", label: "1024x1024" },
    { value: "1024*1536", label: "1024x1536 (Portrait)" },
    { value: "1536*1024", label: "1536x1024 (Landscape)" },
    { value: "2048*2048", label: "2048x2048" },
  ];

  const selectedOption = sizeOptions.find(option => option.value === size);

  const handleSizeSelect = (value: string) => {
    setSize(value);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const runModel = async () => {
    if (!apiKey) {
      setStatus("Your API_KEY is not set, you can check it in Access Keys");
      return;
    }

    setIsGenerating(true);
    setStatus("Submitting task...");
    setResultUrl("");

    const url = "https://api.wavespeed.ai/api/v3/bytedance/seedream-v4";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };
    const payload = {
      "enable_base64_output": false,
      "enable_sync_mode": false,
      "prompt": prompt,
      "size": size,
      ...(seed && { "seed": parseInt(seed) })
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        const requestId = result.data.id;
        setStatus(`Task submitted successfully. Request ID: ${requestId}`);

        while (true) {
          const response = await fetch(
            `https://api.wavespeed.ai/api/v3/predictions/${requestId}/result`,
            {
              headers: {
                "Authorization": `Bearer ${apiKey}`
              }
            });
          const result = await response.json();

          if (response.ok) {
            const data = result.data;
            const status = data.status;

            if (status === "completed") {
              const resultUrl = data.outputs[0];
              setStatus("Task completed!");
              setResultUrl(resultUrl);
              break;
            } else if (status === "failed") {
              setStatus(`Task failed: ${data.error}`);
              break;
            } else {
              setStatus(`Task still processing. Status: ${status}`);
            }
          } else {
            setStatus(`Error: ${response.status} ${JSON.stringify(result)}`);
            break;
          }

          await new Promise(resolve => setTimeout(resolve, 0.1 * 1000));
        }
      } else {
        setStatus(`Error: ${response.status}, ${await response.text()}`);
      }
    } catch (error) {
      setStatus(`Request failed: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-light transition-all duration-300 backdrop-blur-sm group"
          >
            <svg 
              className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-light text-white">Seedream Studio</h1>
          <div className="w-32"></div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-6 relative">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-white">API Key</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowApiKeyInfo(!showApiKeyInfo)}
                  className="text-white/60 hover:text-white/80 transition-colors"
                  title="API Key Information"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                {apiKey && (
                  <button
                    type="button"
                    onClick={clearApiKey}
                    className="text-white/60 hover:text-red-400 transition-colors"
                    title="Clear API Key"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {showApiKeyInfo && (
              <div className="mb-3 p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70">
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <p className="font-medium text-white/80 mb-1">Security Notice</p>
                    <p className="mb-2">Your API key is stored locally in your browser for convenience. It's only accessible to you and this website.</p>
                    <p className="text-xs text-white/60">• Stored in browser's localStorage • Not sent to any third parties • Cleared when you delete browser data</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="Your Wavespeed API Key"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 pr-12"
              />
              {apiKey && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" title="API Key Saved"></div>
                </div>
              )}
            </div>
            
            {apiKey && (
              <p className="text-xs text-white/50 mt-1">
                API Key saved • {apiKey.length > 20 ? `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}` : '•'.repeat(apiKey.length)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-white mb-2">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
          </div>

          <div className="relative" ref={dropdownRef}>
            <label className="block text-white mb-2">Size</label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:border-white/40 hover:bg-white/15 transition-all duration-200 cursor-pointer flex items-center justify-between"
            >
              <span>{selectedOption?.label}</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div 
                className="absolute top-full left-0 right-0 mt-1 border border-white/20 rounded-lg overflow-hidden shadow-2xl"
                style={{ 
                  zIndex: 10000,
                  position: 'absolute',
                  minWidth: '100%',
                  backgroundColor: 'rgba(88, 28, 135, 0.95)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                {sizeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSizeSelect(option.value)}
                    className={`w-full p-3 text-left text-white hover:bg-white/20 transition-all duration-200 border-none ${
                      size === option.value ? 'bg-white/25' : 'bg-transparent'
                    }`}
                    style={{ outline: 'none' }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-white mb-2">Seed (Optional)</label>
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="Leave empty for random seed"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
          </div>

          <button
            onClick={runModel}
            disabled={isGenerating}
            className="w-full py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 border border-white/20 rounded-lg text-white font-light tracking-wide transition-all duration-300 backdrop-blur-sm disabled:cursor-not-allowed"
          >
            {isGenerating ? "Generating..." : "Generate Image"}
          </button>

          {status && (
            <div className="p-4 bg-white/10 rounded-lg">
              <p className="text-white text-sm">{status}</p>
            </div>
          )}

          {resultUrl && (
            <div className="text-center">
              <img
                src={resultUrl}
                alt="Generated image"
                className="max-w-full h-auto rounded-lg mx-auto"
              />
              <a
                href={resultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 border border-white/20 rounded-lg text-white font-light transition-all duration-300"
              >
                Open Full Size
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
