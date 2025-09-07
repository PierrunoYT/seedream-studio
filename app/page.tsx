import Image from "next/image";

export default function Home() {
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
      </main>
      
      {/* Corner lighting effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-white/5 to-transparent blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/10 to-transparent blur-3xl"></div>
    </div>
  );
}
