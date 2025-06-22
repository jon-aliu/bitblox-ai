'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// --- TYPE DEFINITIONS ---
interface Module {
  id: string
  name: string
  aliases: string[]
  type: string
  description: string
}

interface Data {
  modulesDB: Module[]
}

// --- HELPER FUNCTIONS ---
const getModuleTypeClass = (type: string) => {
  switch (type) {
    case 'controller': return 'bg-sky-800/80 text-sky-300 border-sky-600/50'
    case 'sensor': return 'bg-lime-800/80 text-lime-300 border-lime-600/50'
    case 'output': return 'bg-purple-800/80 text-purple-300 border-purple-600/50'
    case 'driver': return 'bg-rose-800/80 text-rose-300 border-rose-600/50'
    case 'power': return 'bg-amber-800/80 text-amber-300 border-amber-600/50'
    case 'communication': return 'bg-teal-800/80 text-teal-300 border-teal-600/50'
    default: return 'bg-neutral-700 text-neutral-300 border-neutral-600'
  }
}

// --- MAIN PAGE COMPONENT ---
export default function ModulesPage() {
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then((data: Data) => {
        // Sort modules once: TRU first, then alphabetically
        data.modulesDB.sort((a, b) => {
          if (a.id === 'BBM-001') return -1
          if (b.id === 'BBM-001') return 1
          return a.name.localeCompare(b.name)
        });
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading data:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center grow">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CE93] mx-auto mb-4"></div>
          <p className="text-white">Loading modules...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-x-1/4 -translate-y-1/4 w-[80vw] h-[80vh] bg-purple-900/30 opacity-20 blur-3xl rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 translate-x-1/4 translate-y-1/4 w-[80vw] h-[80vh] bg-sky-900/30 opacity-20 blur-3xl rounded-full animate-pulse-slow animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-400">
            BitBlox Modules
          </h1>
          <p className="mt-4 text-lg text-neutral-400">
            Explore all available BitBlox modules and their capabilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.modulesDB.map((module, index) => (
            <Link 
              href={`/modules/${module.id}`} 
              key={module.id} 
              className="group block bg-neutral-900/50 p-6 rounded-xl ring-1 ring-neutral-800 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-2 hover:ring-2 hover:ring-[#00CE93] hover:shadow-[0_0_35px_-5px_rgba(0,206,147,0.4)] animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms`}}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-neutral-100">{module.name}</h3>
                  <span className={`capitalize text-xs font-medium px-2.5 py-1 rounded-full border ${getModuleTypeClass(module.type)}`}>
                    {module.type}
                  </span>
                </div>
                <p className="text-neutral-400 text-sm line-clamp-2">
                  {module.description}
                </p>
              </div>
              <div className="mt-auto pt-4">
                <span className="font-semibold text-[#00CE93] text-sm group-hover:underline">
                  View Details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 