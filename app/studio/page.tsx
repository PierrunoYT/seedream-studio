"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ApiKeySection from "./components/ApiKeySection";
import ImageHistorySection from "./components/ImageHistorySection";
import GenerateMode from "./components/GenerateMode";
import EditMode from "./components/EditMode";
import SequentialEditMode from "./components/SequentialEditMode";
import SequentialGenerateMode from "./components/SequentialGenerateMode";
import ResultDisplay from "./components/ResultDisplay";
import ProviderSelector from "./components/ProviderSelector";
import { useApiKey } from "./hooks/useApiKey";
import { useImageHistory } from "./hooks/useImageHistory";
import { useImageGeneration } from "./hooks/useImageGeneration";
import { ApiProviderType, CustomImageSize } from "../../lib/api/types";
import { ApiProviderFactory } from "../../lib/api/factory";

export default function Studio() {
  const [prompt, setPrompt] = useState("Dress the model in the clothes and shoes.");
  const [size, setSize] = useState<string | CustomImageSize>("square_hd");
  const [seed, setSeed] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeMode, setActiveMode] = useState<'generate' | 'edit' | 'sequential' | 'sequential-generate'>('generate');
  const [generatePrompt, setGeneratePrompt] = useState("Draw a chart showing the typical vegetation distribution in four different climate zones: tropical rainforest, temperate forest, desert, and tundra.");
  const [numImages, setNumImages] = useState(1);
  const [isNumImagesDropdownOpen, setIsNumImagesDropdownOpen] = useState(false);
  
  // Sequential edit specific states
  const [maxImages, setMaxImages] = useState(1);
  const [isMaxImagesDropdownOpen, setIsMaxImagesDropdownOpen] = useState(false);
  
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
    runSequentialEdit,
    runSequentialGenerate,
    currentProvider,
    switchProvider,
    uploadFile
  } = useImageGeneration({
    apiKey,
    onSaveImage: saveImageToHistory,
    provider: ApiProviderFactory.getAvailableProviders()[0]
  });

  // Update document title based on current provider
  useEffect(() => {
    const title = currentProvider === ApiProviderType.WAVESPEED 
      ? 'WavespeedAI Studio' 
      : 'Seedream Studio';
    document.title = title;
  }, [currentProvider]);

  // Handle provider switching with tab reset
  const handleProviderChange = (newProvider: ApiProviderType) => {
    switchProvider(newProvider);
    // Always reset to generate tab when switching providers
    setActiveMode('generate');
  };

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

  const handleSizeSelect = (value: string | CustomImageSize) => {
    setSize(value);
    setIsDropdownOpen(false);
  };

  const handleNumImagesSelect = (value: number) => {
    setNumImages(value);
    setIsNumImagesDropdownOpen(false);
  };

  const handleMaxImagesSelect = (value: number) => {
    setMaxImages(value);
    setIsMaxImagesDropdownOpen(false);
  };

  const runModel = () => {
    if (activeMode === 'generate') {
      runGenerateModel(generatePrompt, size, numImages, seed);
    } else if (activeMode === 'edit') {
      runEditModel(prompt, imageUrls, size, seed, numImages);
    } else if (activeMode === 'sequential') {
      runSequentialEdit(prompt, imageUrls, size, maxImages, seed);
    } else if (activeMode === 'sequential-generate') {
      runSequentialGenerate(generatePrompt, size, maxImages, seed);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-8 overflow-auto">
      <div className="max-w-4xl mx-auto pb-48">
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
          <h1 className="text-4xl font-light text-white">
            {currentProvider === ApiProviderType.WAVESPEED ? 'WavespeedAI Studio' : 'Seedream Studio'}
          </h1>
          <div className="w-32"></div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20 flex">
            <button
              onClick={() => setActiveMode('generate')}
              className={`px-4 py-2 rounded-md font-light transition-all duration-200 ${
                activeMode === 'generate'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Generate
            </button>
            <button
              onClick={() => setActiveMode('edit')}
              className={`px-4 py-2 rounded-md font-light transition-all duration-200 ${
                activeMode === 'edit'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Edit
            </button>
            {currentProvider === ApiProviderType.WAVESPEED && (
              <>
                <button
                  onClick={() => setActiveMode('sequential')}
                  className={`px-3 py-2 rounded-md font-light transition-all duration-200 text-sm ${
                    activeMode === 'sequential'
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Seq Edit
                </button>
                <button
                  onClick={() => setActiveMode('sequential-generate')}
                  className={`px-3 py-2 rounded-md font-light transition-all duration-200 text-sm ${
                    activeMode === 'sequential-generate'
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Seq Gen
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-6 relative" suppressHydrationWarning>
          {/* Provider-specific information banner */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  {currentProvider === ApiProviderType.WAVESPEED ? (
                    <span className="text-2xl">⚡</span>
                  ) : (
                    <span className="text-2xl">🎨</span>
                  )}
                </div>
              </div>
              <div className="flex-1 text-white">
                <h3 className="text-lg font-medium mb-2">
                  {currentProvider === ApiProviderType.WAVESPEED 
                    ? 'Seedream 4.0 via WavespeedAI' 
                    : 'Seedream 4.0 via FAL AI'
                  }
                </h3>
                <div className="text-sm text-white/80 space-y-1">
                  {currentProvider === ApiProviderType.WAVESPEED ? (
                    <>
                      <p>• Ultra-fast inference: Generate 2K images in just 1.8 seconds</p>
                      <p>• Single image generation (1 image per request)</p>
                      <p>• Supports text-to-image and image editing modes</p>
                      <p>• Base64 image support for editing operations</p>
                    </>
                  ) : (
                    <>
                      <p>• Multiple image generation (1-6 images per request)</p>
                      <p>• Supports text-to-image and image editing modes</p>
                      <p>• File upload support for image editing operations</p>
                      <p>• Flexible sizing: Objects with width/height or preset enums</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <ApiKeySection 
            apiKey={apiKey}
            onApiKeyChange={handleApiKeyChange}
            onClearApiKey={clearApiKey}
            currentProvider={currentProvider}
          />

          <ProviderSelector
            currentProvider={currentProvider}
            onProviderChange={handleProviderChange}
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
            <>
              {/* Provider-specific prompt writing guide */}
              {currentProvider === ApiProviderType.WAVESPEED && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <span className="text-lg mr-2">📝</span>
                    WavespeedAI Prompt Writing Guide
                  </h4>
                  <div className="text-sm text-white/70 space-y-2">
                    <p><span className="text-white/90 font-medium">Formula:</span> Use &quot;change action + change object + target feature&quot; for best results</p>
                    <p><span className="text-white/90 font-medium">Group images:</span> Use &quot;a series of&quot; or &quot;group of images&quot; to maintain consistency</p>
                    <p><span className="text-white/90 font-medium">Professional terms:</span> Use original language vocabulary and special image terms</p>
                    <div className="mt-3 p-2 bg-white/5 rounded text-xs">
                      <p className="text-white/60 mb-1">Example prompts:</p>
                      <p>&quot;A series of anime characters in different poses, vibrant colors, studio lighting&quot;</p>
                      <p>&quot;Commercial poster design, minimalist style, brand clothing showcase, high-end fashion&quot;</p>
                    </div>
                  </div>
                </div>
              )}
              
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
                currentProvider={currentProvider}
              />
            </>
          )}

          {activeMode === 'edit' && (
            <>
              {/* Provider-specific editing guide */}
              {currentProvider === ApiProviderType.WAVESPEED && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <span className="text-lg mr-2">✏️</span>
                    WavespeedAI Image Editing Guide
                  </h4>
                  <div className="text-sm text-white/70 space-y-2">
                    <p><span className="text-white/90 font-medium">Editing operations:</span> Object addition/deletion, style transformation, attribute changes</p>
                    <p><span className="text-white/90 font-medium">Complex editing:</span> Face swapping, structural adjustments, texture replacement</p>
                    <p><span className="text-white/90 font-medium">Formula:</span> Use &quot;change action + change object + target feature&quot;</p>
                    <div className="mt-3 p-2 bg-white/5 rounded text-xs">
                      <p className="text-white/60 mb-1">Example editing prompts:</p>
                      <p>&quot;Change the person&apos;s hair to blonde and add sunglasses&quot;</p>
                      <p>&quot;Replace the background with a sunset beach scene&quot;</p>
                    </div>
                  </div>
                </div>
              )}
              
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
                currentProvider={currentProvider}
              />
            </>
          )}

          {activeMode === 'sequential' && (
            <>
              {/* Provider-specific sequential editing guide */}
              {currentProvider === ApiProviderType.WAVESPEED && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <span className="text-lg mr-2">🔄</span>
                    WavespeedAI Sequential Editing Guide
                  </h4>
                  <div className="text-sm text-white/70 space-y-2">
                    <p><span className="text-white/90 font-medium">Multi-image generation:</span> Generate up to 14 variations in a single request</p>
                    <p><span className="text-white/90 font-medium">Sequential operations:</span> Apply transformations progressively across multiple outputs</p>
                    <p><span className="text-white/90 font-medium">Input flexibility:</span> Start with existing images or generate from text only</p>
                    <div className="mt-3 p-2 bg-white/5 rounded text-xs">
                      <p className="text-white/60 mb-1">Example sequential prompts:</p>
                      <p>&quot;Create a series of anime characters with different expressions&quot;</p>
                      <p>&quot;Generate progressive style transformations from realistic to abstract&quot;</p>
                    </div>
                  </div>
                </div>
              )}
              
              <SequentialEditMode 
                imageUrls={imageUrls}
                onAddImageUrl={addImageUrl}
                onRemoveImageUrl={removeImageUrl}
                newImageUrl={newImageUrl}
                onNewImageUrlChange={setNewImageUrl}
                prompt={prompt}
                onPromptChange={setPrompt}
                maxImages={maxImages}
                onMaxImagesChange={handleMaxImagesSelect}
                isMaxImagesDropdownOpen={isMaxImagesDropdownOpen}
                onToggleMaxImagesDropdown={() => setIsMaxImagesDropdownOpen(!isMaxImagesDropdownOpen)}
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
                currentProvider={currentProvider}
              />
            </>
          )}

          {activeMode === 'sequential-generate' && (
            <>
              {/* Provider-specific sequential generation guide */}
              {currentProvider === ApiProviderType.WAVESPEED && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <span className="text-lg mr-2">🎯</span>
                    WavespeedAI Sequential Generation Guide
                  </h4>
                  <div className="text-sm text-white/70 space-y-2">
                    <p><span className="text-white/90 font-medium">Multi-image series:</span> Generate up to 14 related images in one request</p>
                    <p><span className="text-white/90 font-medium">Consistent themes:</span> Perfect for character variations, style progressions, or product series</p>
                    <p><span className="text-white/90 font-medium">Batch generation:</span> More efficient than multiple single requests</p>
                    <div className="mt-3 p-2 bg-white/5 rounded text-xs">
                      <p className="text-white/60 mb-1">Perfect for:</p>
                      <p>&quot;Series of character expressions&quot;, &quot;Progressive art styles&quot;, &quot;Product color variations&quot;</p>
                    </div>
                  </div>
                </div>
              )}
              
              <SequentialGenerateMode 
                prompt={generatePrompt}
                onPromptChange={setGeneratePrompt}
                maxImages={maxImages}
                onMaxImagesChange={handleMaxImagesSelect}
                isMaxImagesDropdownOpen={isMaxImagesDropdownOpen}
                onToggleMaxImagesDropdown={() => setIsMaxImagesDropdownOpen(!isMaxImagesDropdownOpen)}
                size={size}
                onSizeChange={handleSizeSelect}
                isSizeDropdownOpen={isDropdownOpen}
                onToggleSizeDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
                seed={seed}
                onSeedChange={setSeed}
                currentProvider={currentProvider}
              />
            </>
          )}

          <button
            onClick={runModel}
            disabled={isGenerating}
            className="w-full py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 border border-white/20 rounded-lg text-white font-light tracking-wide transition-all duration-300 backdrop-blur-sm disabled:cursor-not-allowed"
          >
            {isGenerating 
              ? (activeMode === 'generate' ? "Generating..." : 
                 activeMode === 'edit' ? "Editing Images..." : 
                 activeMode === 'sequential' ? "Running Sequential Edit..." : 
                 "Running Sequential Generation...") 
              : (activeMode === 'generate' ? "Generate Images" : 
                 activeMode === 'edit' ? "Edit Images" : 
                 activeMode === 'sequential' ? "Run Sequential Edit" : 
                 "Run Sequential Generation")
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