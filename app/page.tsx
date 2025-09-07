import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      
      <main className="flex flex-col row-start-2 items-center justify-center relative z-10">
        <h1 className="text-6xl sm:text-8xl font-bold text-center text-white drop-shadow-2xl">
          Seedream Studio
        </h1>
      </main>
    </div>
  );
}
