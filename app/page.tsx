import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Base dreamy gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      
      {/* Ethereal dream overlay with animated gradient */}
      <div className="absolute inset-0 dream-overlay"></div>
      
      {/* Floating dreamy orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-white/20 to-purple-300/30 rounded-full blur-xl animate-float"></div>
      <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-br from-pink-300/30 to-white/20 rounded-full blur-xl animate-float-delayed"></div>
      <div className="absolute top-1/2 left-3/4 w-40 h-40 bg-gradient-to-br from-blue-300/20 to-purple-300/30 rounded-full blur-2xl animate-float-slow"></div>
      <div className="absolute top-1/6 right-1/3 w-20 h-20 bg-gradient-to-br from-white/30 to-pink-300/20 rounded-full blur-lg animate-float"></div>
      <div className="absolute bottom-1/4 left-1/6 w-28 h-28 bg-gradient-to-br from-purple-300/25 to-blue-300/25 rounded-full blur-xl animate-float-delayed"></div>
      
      {/* Dreamy particles */}
      <div className="dream-particle top-0 left-1/4 w-2 h-2 bg-white/60 animate-float" style={{animationDelay: '0s'}}></div>
      <div className="dream-particle top-0 left-1/2 w-1 h-1 bg-purple-300/80 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="dream-particle top-0 left-3/4 w-3 h-3 bg-pink-300/60 animate-float" style={{animationDelay: '4s'}}></div>
      <div className="dream-particle top-0 left-1/6 w-1.5 h-1.5 bg-blue-300/70 animate-float" style={{animationDelay: '6s'}}></div>
      <div className="dream-particle top-0 right-1/4 w-2.5 h-2.5 bg-white/50 animate-float" style={{animationDelay: '8s'}}></div>
      
      {/* Subtle background shimmer - positioned away from edges */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-3/4 h-16 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-wave opacity-40"></div>
      
      <main className="flex flex-col row-start-2 items-center justify-center relative z-10">
        <h1 className="text-6xl sm:text-8xl font-bold text-center text-white drop-shadow-2xl animate-glow">
          Seedream Studio
        </h1>
      </main>
    </div>
  );
}
