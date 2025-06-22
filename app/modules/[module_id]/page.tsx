'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

// --- TYPE DEFINITIONS ---
interface Module {
  id: string
  name: string
  aliases: string[]
  type: string
  description: string
}

interface ProjectModule {
  module_id: string
  quantity: number
}

interface Project {
  project_id: string
  name: string
  description: string
  difficulty: string
  required_modules: ProjectModule[]
}

interface Data {
  modulesDB: Module[]
  projectsDB: Project[]
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

const getDifficultyClass = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-green-800/80 text-green-300 border-green-600/50'
    case 'Intermediate': return 'bg-yellow-800/80 text-yellow-300 border-yellow-600/50'
    case 'Advanced': return 'bg-red-800/80 text-red-300 border-red-600/50'
    default: return 'bg-neutral-700 text-neutral-300 border-neutral-600'
  }
}

// --- RELATED PROJECT CARD COMPONENT ---
function RelatedProjectCard({ project }: { project: Project }) {
  return (
    <Link 
      href={`/projects/${project.project_id}`} 
      className="group block bg-neutral-900/50 p-4 rounded-xl ring-1 ring-neutral-800 transition-all duration-300 transform hover:-translate-y-1 hover:ring-[#00CE93] hover:shadow-[0_0_25px_-5px_rgba(0,206,147,0.3)]"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-neutral-100">{project.name}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getDifficultyClass(project.difficulty)}`}>
          {project.difficulty}
        </span>
      </div>
      <p className="text-neutral-400 text-sm line-clamp-2">{project.description}</p>
    </Link>
  )
}

// --- MAIN PAGE COMPONENT ---
export default function ModuleDetailPage() {
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const moduleId = params.module_id as string

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => {
        console.error('Error loading data:', err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (data) {
      setLoading(false)
    }
  }, [data])

  if (loading) {
    return (
      <div className="flex items-center justify-center grow">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CE93] mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  const module = data?.modulesDB.find(m => m.id === moduleId)
  const relatedProjects = data?.projectsDB.filter(project => 
    project.required_modules.some(req => req.module_id === moduleId)
  ).slice(0, 4) || []

  if (!module) {
    return (
      <div className="flex items-center justify-center grow">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-100 mb-4">Module Not Found</h1>
          <Link href="/modules" className="text-[#00CE93] hover:underline">
            Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-sky-900/40 opacity-20 blur-3xl rounded-full animate-pulse-slow"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="animate-fade-in-down">
          <Link href="/modules" className="text-[#00CE93] hover:underline mb-8 inline-block group">
            <span className="group-hover:-translate-x-1 transition-transform duration-200 inline-block mr-1">&larr;</span> Back to Modules
          </Link>
          
          <div className="bg-neutral-900/50 p-8 rounded-2xl ring-1 ring-neutral-800 mb-12 shadow-2xl shadow-black/20">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-400">{module.name}</h1>
              <span className={`capitalize text-sm font-medium px-4 py-1.5 rounded-full border ${getModuleTypeClass(module.type)}`}>
                {module.type}
              </span>
            </div>
            <p className="text-lg text-neutral-300 leading-relaxed">{module.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-1 animate-fade-in-up animation-delay-500">
            <h2 className="text-3xl font-bold text-neutral-200 mb-6">Details</h2>
            <div className="bg-neutral-900/50 p-6 rounded-2xl ring-1 ring-neutral-800 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-2">Module ID</h3>
                <p className="font-mono text-lg text-neutral-200 bg-neutral-800/80 rounded-md px-3 py-1 inline-block">{module.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-2">Type</h3>
                <span className={`capitalize text-sm font-medium px-3 py-1 rounded-full border ${getModuleTypeClass(module.type)}`}>
                  {module.type}
                </span>
              </div>
              {module.aliases.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Also known as</h3>
                  <div className="flex flex-wrap gap-2">
                    {module.aliases.map(alias => (
                      <span key={alias} className="bg-neutral-800/80 text-neutral-300 px-2 py-1 rounded-md text-xs font-mono">
                        {alias}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Related Projects */}
          <div className="lg:col-span-2 animate-fade-in-up animation-delay-700">
            <h2 className="text-3xl font-bold text-neutral-200 mb-6">Used in Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedProjects.length > 0 ? (
                relatedProjects.map((p, index) => (
                  <div key={p.project_id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100 + 900}ms`}}>
                    <RelatedProjectCard project={p} />
                  </div>
                ))
              ) : (
                <p className="text-neutral-400 italic">This module is not yet used in any projects.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 