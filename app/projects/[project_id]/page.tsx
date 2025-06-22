'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

// --- TYPE DEFINITIONS ---
interface Module {
  id: string
  name: string
  type: string
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
  projectsDB: Project[]
  modulesDB: Module[]
}

// --- HELPER FUNCTIONS ---
const getDifficultyClass = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-green-800/80 text-green-300 border-green-600/50'
    case 'Intermediate': return 'bg-yellow-800/80 text-yellow-300 border-yellow-600/50'
    case 'Advanced': return 'bg-red-800/80 text-red-300 border-red-600/50'
    default: return 'bg-neutral-700 text-neutral-300 border-neutral-600'
  }
}

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
export default function ProjectDetailPage() {
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const projectId = params.project_id as string

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

  const project = data?.projectsDB.find(p => p.project_id === projectId)
  const relatedProjects = data?.projectsDB.filter(p => p.project_id !== projectId).slice(0, 4) || []

  if (!project) {
    return (
      <div className="flex items-center justify-center grow">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-100 mb-4">Project Not Found</h1>
          <Link href="/projects" className="text-[#00CE93] hover:underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-blue-900/40 opacity-20 blur-3xl rounded-full animate-pulse-slow"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="animate-fade-in-down">
          <Link href="/projects" className="text-[#00CE93] hover:underline mb-8 inline-block group">
            <span className="group-hover:-translate-x-1 transition-transform duration-200 inline-block mr-1">&larr;</span> Back to Projects
          </Link>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-400">{project.name}</h1>
            <span className={`text-sm font-medium px-4 py-1.5 rounded-full border ${getDifficultyClass(project.difficulty)}`}>
              {project.difficulty}
            </span>
          </div>
          <p className="mt-4 text-lg text-neutral-300 max-w-4xl">{project.description}</p>
        </div>
        
        <div className="mt-16 animate-fade-in-up animation-delay-500">
          <h2 className="text-3xl font-bold text-yellow-400 mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            You will need:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.required_modules.map((module, index) => {
              const moduleData = data?.modulesDB.find(m => m.id === module.module_id)
              return (
                <Link
                  href={`/modules/${module.module_id}`}
                  key={module.module_id} 
                  className="bg-neutral-900/60 p-5 rounded-2xl ring-1 ring-neutral-800 hover:ring-2 hover:ring-sky-500 transition-all duration-300 group transform hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100 + 700}ms`}}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-neutral-100 group-hover:text-sky-400 transition-colors">{moduleData?.name || 'Unknown Module'}</h3>
                    <span className="font-mono bg-neutral-800/80 text-neutral-200 rounded-lg px-2.5 py-1 text-sm">
                      {module.quantity}x
                    </span>
                  </div>
                  {moduleData && (
                    <div className="mt-3">
                      <span className={`capitalize text-xs font-medium px-2 py-1 rounded-full border ${getModuleTypeClass(moduleData.type)}`}>
                        {moduleData.type}
                      </span>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right Column: Related Projects */}
        <div className="mt-20 animate-fade-in-up animation-delay-1000">
          <h2 className="text-3xl font-bold text-neutral-200 mb-6">Related Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedProjects.map((p, index) => (
              <div key={p.project_id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100 + 1200}ms`}}>
                <RelatedProjectCard project={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 