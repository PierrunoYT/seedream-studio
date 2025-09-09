"use client";

import Image from "next/image";

interface ResultDisplayProps {
  resultUrl: string;
  onUseImageForEditing: (imageUrl: string) => void;
}

export default function ResultDisplay({ resultUrl, onUseImageForEditing }: ResultDisplayProps) {
  if (!resultUrl) return null;

  return (
    <div className="text-center">
      <div className="relative inline-block max-w-full">
        <Image
          src={resultUrl}
          alt="Generated image"
          width={1024}
          height={1024}
          className="max-w-full h-auto rounded-lg mx-auto"
        />
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        <a
          href={resultUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-2 bg-white/20 hover:bg-white/30 border border-white/20 rounded-lg text-white font-light transition-all duration-300"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open Full Size
        </a>
        <button
          onClick={() => onUseImageForEditing(resultUrl)}
          className="inline-flex items-center px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/20 rounded-lg text-white font-light transition-all duration-300"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Use for Editing
        </button>
      </div>
    </div>
  );
}