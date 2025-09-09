"use client";

import { useState } from "react";

export default function Home() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleStudioClick = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  return (
    <div className="font-sans min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">

      
      {/* Main content */}
      <main className="relative z-10 text-center px-8 flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="logo-container mb-4">
          <img
            src="/logo.png"
            alt="Seedream Studio Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain animate-logo cursor-pointer"
          />
        </div>
        
        {/* Title */}

        <h1 className="text-6xl sm:text-8xl md:text-9xl font-extralight tracking-widest text-white drop-shadow-2xl">
          <span className="wave-letter">S</span>
          <span className="wave-letter">e</span>
          <span className="wave-letter">e</span>
          <span className="wave-letter">d</span>
          <span className="wave-letter">r</span>
          <span className="wave-letter">e</span>
          <span className="wave-letter">a</span>
          <span className="wave-letter">m</span>
          <span className="wave-letter mx-4"> </span>
          <span className="wave-letter">S</span>
          <span className="wave-letter">t</span>
          <span className="wave-letter">u</span>
          <span className="wave-letter">d</span>
          <span className="wave-letter">i</span>
          <span className="wave-letter">o</span>
        </h1>
        
        {/* Decorative line */}
        <div className="mt-8 w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        
        {/* Tagline */}
        <p className="mt-6 text-lg text-white/80 font-light tracking-wide">
          Where Dreams Take Shape
        </p>
        
        {/* Go to Studio Button */}
        <div className="mt-8 relative">
          <button 
            onClick={handleStudioClick}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-light tracking-wide transition-all duration-300 backdrop-blur-sm"
          >
            Go to Studio
          </button>
          
          {/* Coming Soon Message */}
          {showComingSoon && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20">
              <p className="text-gray-800 font-medium text-sm whitespace-nowrap">
                🚧 Coming Soon! Studio is under development
              </p>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white/90 rotate-45 border-l border-t border-white/20"></div>
            </div>
          )}
        </div>
      </main>
      
      {/* Corner lighting effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-white/5 to-transparent blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/10 to-transparent blur-3xl"></div>
    </div>
  );
}
