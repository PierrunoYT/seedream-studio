"use client";

import { useState } from "react";
import Link from "next/link";
import ApiKeySection from "./components/ApiKeySection";
import ImageHistorySection from "./components/ImageHistorySection";
import GenerateMode from "./components/GenerateMode";
import EditMode from "./components/EditMode";
import ResultDisplay from "./components/ResultDisplay";
import ProviderSelector from "./components/ProviderSelector";
import { useApiKey } from "./hooks/useApiKey";
import { useImageHistory } from "./hooks/useImageHistory";
import { useImageGeneration } from "./hooks/useImageGeneration";
import { ApiProviderType } from "../../lib/api/types";

export default function Studio() {
  const [prompt, setPrompt] = useState("Dress the model in the clothes and shoes.");
  const [size, setSize] = useState("square_hd");
  const [seed, setSeed] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeMode, setActiveMode] = useState<'generate' | 'edit'>('generate');
  const [generatePrompt, setGeneratePrompt] = useState("Draw a chart showing the typical vegetation distribution in four different climate zones: tropical rainforest, temperate forest, desert, and tundra.");
  const [numImages, setNumImages] = useState(1);
  const [isNumImagesDropdownOpen, setIsNumImagesDropdownOpen] = useState(false);
  
  // Custom hooks
  const { apiKey, handleApiKeyChange, clearApiKey } = useApiKey();
  const { savedImages, saveImageToHistory, clearImageHistory, removeImageFromHistory } = useImageHistory();
  const { 
    isGenerating, 
    status, 
    resultUrl, 
    setResultUrl, 
    setStatus, 
    runGenerateModel, 
    runEditModel,
    currentProvider,
    switchProvider,
    uploadFile
  } = useImageGeneration({
    apiKey,
    onSaveImage: saveImageToHistory,
    provider: ApiProviderType.FAL
  });

  // Use image for editing
  const useImageForEditing = (imageUrl: string) => {
    const isAlreadyAdded = imageUrls.includes(imageUrl);
    
    if (!isAlreadyAdded) {
      setImageUrls(prev => [...prev, imageUrl]);
      setStatus("Image added to editing queue");
    } else {
      setStatus("Image already in editing queue");
    }
    
    setActiveMode('edit');
    
    // Scroll to edit section
    setTimeout(() => {
      const editSection = document.querySelector('[data-edit-section]');
      if (editSection) {
        editSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    
    // Clear status after 3 seconds
    setTimeout(() => {
      setStatus("");
    }, 3000);
  };

  // Add image URL to the list
  const addImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  // Remove image URL from the list
  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  // Handle file selection
  const handleFileSelect = async (files: FileList) => {
    if (!apiKey) {
      setStatus("Please enter your API Key first");
      return;
    }

    setIsUploading(true);
    const uploadedUrls: string[] = [];
    
    try {
      for (const file of Array.from(files)) {
        if (file.type.startsWith('image/')) {
          setStatus(`Processing ${file.name}...`);
          const url = await uploadFile(file);
          uploadedUrls.push(url);
        }
      }
      
      if (uploadedUrls.length > 0) {
        setImageUrls(prev => [...prev, ...uploadedUrls]);
        const usedBase64 = uploadedUrls.some(url => url.startsWith('data:'));
        if (usedBase64) {
          setStatus(`Successfully processed ${uploadedUrls.length} image(s) (using base64 encoding)`);
        } else {
          setStatus(`Successfully uploaded ${uploadedUrls.length} image(s)`);
        }
      } else {
        setStatus("No valid image files found");
      }
    } catch (error) {
      setStatus(`Upload failed: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleSizeSelect = (value: string) => {
    setSize(value);
    setIsDropdownOpen(false);
  };

  const handleNumImagesSelect = (value: number) => {
    setNumImages(value);
    setIsNumImagesDropdownOpen(false);
  };

  const runModel = () => {
    if (activeMode === 'generate') {
      runGenerateModel(generatePrompt, size, numImages, seed);
    } else {
      runEditModel(prompt, imageUrls, size, seed, numImages);
    }
  };

  const loadExamples = () => {
    const examples = [
      "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_1.png",
      "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_2.png",
      "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_3.png",
      "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_4.png"
    ];
    setImageUrls(examples);
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
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
            <button
              onClick={() => setActiveMode('generate')}
              className={`px-6 py-2 rounded-md font-light transition-all duration-200 ${
                activeMode === 'generate'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Generate Images
            </button>
            <button
              onClick={() => setActiveMode('edit')}
              className={`px-6 py-2 rounded-md font-light transition-all duration-200 ${
                activeMode === 'edit'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Edit Images
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-6 relative">
          <ApiKeySection 
            apiKey={apiKey}
            onApiKeyChange={handleApiKeyChange}
            onClearApiKey={clearApiKey}
          />

          <ProviderSelector
            currentProvider={currentProvider}
            onProviderChange={switchProvider}
            disabled={isGenerating}
          />

          <ImageHistorySection 
            savedImages={savedImages}
            onClearHistory={clearImageHistory}
            onRemoveImage={removeImageFromHistory}
            onUseImageForEditing={useImageForEditing}
            onSetResultUrl={setResultUrl}
          />

          {activeMode === 'generate' && (
            <GenerateMode 
              prompt={generatePrompt}
              onPromptChange={setGeneratePrompt}
              numImages={numImages}
              onNumImagesChange={handleNumImagesSelect}
              isNumImagesDropdownOpen={isNumImagesDropdownOpen}
              onToggleNumImagesDropdown={() => setIsNumImagesDropdownOpen(!isNumImagesDropdownOpen)}
              size={size}
              onSizeChange={handleSizeSelect}
              isSizeDropdownOpen={isDropdownOpen}
              onToggleSizeDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
              seed={seed}
              onSeedChange={setSeed}
            />
          )}

          {activeMode === 'edit' && (
            <EditMode 
              imageUrls={imageUrls}
              onAddImageUrl={addImageUrl}
              onRemoveImageUrl={removeImageUrl}
              newImageUrl={newImageUrl}
              onNewImageUrlChange={setNewImageUrl}
              prompt={prompt}
              onPromptChange={setPrompt}
              numImages={numImages}
              onNumImagesChange={handleNumImagesSelect}
              isNumImagesDropdownOpen={isNumImagesDropdownOpen}
              onToggleNumImagesDropdown={() => setIsNumImagesDropdownOpen(!isNumImagesDropdownOpen)}
              size={size}
              onSizeChange={handleSizeSelect}
              isSizeDropdownOpen={isDropdownOpen}
              onToggleSizeDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
              seed={seed}
              onSeedChange={setSeed}
              isDragging={isDragging}
              isUploading={isUploading}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFileSelect={handleFileSelect}
              onLoadExamples={loadExamples}
            />
          )}

          <button
            onClick={runModel}
            disabled={isGenerating}
            className="w-full py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 border border-white/20 rounded-lg text-white font-light tracking-wide transition-all duration-300 backdrop-blur-sm disabled:cursor-not-allowed"
          >
            {isGenerating 
              ? (activeMode === 'generate' ? "Generating..." : "Editing Images...") 
              : (activeMode === 'generate' ? "Generate Images" : "Edit Images")
            }
          </button>

          {status && (
            <div className="p-4 bg-white/10 rounded-lg">
              <p className="text-white text-sm">{status}</p>
            </div>
          )}

          <ResultDisplay 
            resultUrl={resultUrl}
            onUseImageForEditing={useImageForEditing}
          />
        </div>
      </div>
    </div>
  );
}