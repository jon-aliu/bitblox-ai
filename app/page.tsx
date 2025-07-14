import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex items-center justify-center">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-[#00ce93] opacity-10 blur-3xl rounded-full animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/4 w-[40vw] h-[40vh] bg-blue-500 opacity-10 blur-3xl rounded-full animate-pulse-slow animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-400 animate-fade-in-down">
          Welcome to <span className="text-[#00CE93]">BitBlox AI</span>
        </h1>
        <p className="mt-6 text-lg text-neutral-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-500">
          Discover amazing projects you can build with BitBlox modules. 
          From simple LED projects to complex robotics, find your next creation.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animation-delay-1000">
          <Link 
            href="/suggester"
            className="group inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-full text-black bg-[#00CE93] hover:bg-transparent hover:text-[#00CE93] hover:ring-2 hover:ring-[#00CE93] transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_-5px_rgba(0,206,147,0.7)] hover:shadow-[0_0_40px_-5px_rgba(0,206,147,0.9)]"
          >
            Get Project Suggestions
          </Link>
          <Link 
            href="/projects"
            className="group inline-flex items-center justify-center px-8 py-4 border border-neutral-700 text-base font-bold rounded-full text-neutral-300 bg-neutral-800/50 hover:bg-neutral-700/80 hover:ring-2 hover:ring-neutral-600 transition-all duration-300 transform hover:scale-105"
          >
            Browse All Projects
          </Link>
        </div>
      </div>
    </div>
  )
} 
