"use client";

import Link from "next/link";

export default function Studio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-8">
      <div className="text-center">
        {/* Coming Soon Message */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 max-w-md mx-auto">
          <div className="mb-6">
            <div className="text-6xl mb-4">🚧</div>
            <h1 className="text-3xl font-light text-white mb-4">Coming Soon!</h1>
            <p className="text-white/80 text-lg mb-6">
              Seedream Studio is currently under development. We're working hard to bring you an amazing AI image generation experience.
            </p>
            <div className="text-white/60 text-sm mb-6">
              Stay tuned for updates!
            </div>
          </div>
          
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 border border-white/20 rounded-lg text-white font-light transition-all duration-300 backdrop-blur-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
        
        {/* Progress indicator (optional decoration) */}
        <div className="mt-8 max-w-xs mx-auto">
          <div className="flex justify-between text-white/40 text-xs mb-2">
            <span>Progress</span>
            <span>70%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full" style={{width: '70%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}