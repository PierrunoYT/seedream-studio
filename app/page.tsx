import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans flex items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      
      {/* Main content */}
      <main className="relative z-10 text-center px-8">
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-extralight tracking-widest text-white drop-shadow-2xl">
          Seedream Studio
        </h1>
        <div className="mt-8 w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto"></div>
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
