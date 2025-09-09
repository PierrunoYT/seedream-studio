"use client";

import { useState } from "react";

interface ApiKeySectionProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  onClearApiKey: () => void;
}

export default function ApiKeySection({ apiKey, onApiKeyChange, onClearApiKey }: ApiKeySectionProps) {
  const [showApiKeyInfo, setShowApiKeyInfo] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-white">FAL API Key</label>
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
              onClick={onClearApiKey}
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
              <p className="mb-2">Your API key is stored locally in your browser for convenience. It&apos;s only accessible to you and this website.</p>
              <p className="text-xs text-white/60">• Stored in browser&apos;s localStorage • Not sent to any third parties • Cleared when you delete browser data</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="relative">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="Your FAL API Key"
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
  );
}