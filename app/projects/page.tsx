'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// --- TYPE DEFINITIONS ---
interface Module {
  id: string
  name: string
}

interface Project {
  project_id: string
  name: string
  description: string
  difficulty: string
  required_modules: { module_id: string; quantity: number }[]
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

// --- PROJECT CARD COMPONENT ---
function ProjectCard({ project, modules }: { project: Project; modules: Module[] }) {
  const getModuleName = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId)
    return module ? module.name : '...'
  }

  return (
    <Link 
      href={`/projects/${project.project_id}`} 
      className="group block bg-neutral-900/50 p-6 rounded-xl ring-1 ring-neutral-800 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-2 hover:ring-2 hover:ring-[#00CE93] hover:shadow-[0_0_35px_-5px_rgba(0,206,147,0.4)]"
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-neutral-100">{project.name}</h3>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getDifficultyClass(project.difficulty)}`}>
            {project.difficulty}
          </span>
        </div>
        <p className="text-neutral-400 text-sm mb-5 line-clamp-3">
          {project.description}
        </p>
      </div>
      <div className="mt-auto">
        <h4 className="text-yellow-400 text-sm font-semibold mb-3">You just need:</h4>
        <div className="flex flex-wrap gap-2">
          {project.required_modules.map(module => (
            <div key={module.module_id} className="bg-neutral-800/60 text-neutral-300 px-2 py-1 rounded-md text-xs flex items-center">
              <span className="font-mono bg-neutral-700 text-neutral-200 rounded-md px-1.5 mr-2">{module.quantity}x</span>
              {getModuleName(module.module_id)}
            </div>
          ))}
        </div>
        <div className="mt-5 border-t border-neutral-800 pt-4">
          <span className="font-semibold text-[#00CE93] text-sm group-hover:underline">
            See More →
          </span>
        </div>
      </div>
    </Link>
  )
}

// --- MAIN PAGE COMPONENT ---
export default function ProjectsPage() {
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then((data: Data) => {
        // Sort projects alphabetically by name
        data.projectsDB.sort((a, b) => a.name.localeCompare(b.name));
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading data:', err)
        setLoading(false)
      })
  }, [])

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulties(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    )
  }

  const difficulties = ['Beginner', 'Intermediate', 'Advanced']

  if (loading) {
    return (
      <div className="flex items-center justify-center grow">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CE93] mx-auto mb-4"></div>
          <p className="text-white">Loading projects...</p>
        </div>
      </div>
    )
  }

  const filteredProjects = data?.projectsDB.filter(project =>
    selectedDifficulties.length === 0 || selectedDifficulties.includes(project.difficulty)
  )

  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[80vw] h-[80vh] bg-blue-900/30 opacity-20 blur-3xl rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[80vw] h-[80vh] bg-[#00ce93]/30 opacity-20 blur-3xl rounded-full animate-pulse-slow animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-400">
            BitBlox Projects
          </h1>
          <p className="mt-4 text-lg text-neutral-400">
            Discover amazing projects you can build with BitBlox modules
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 mb-10 animate-fade-in-up animation-delay-300">
          <span className="text-neutral-400 font-medium">Filter by:</span>
          {difficulties.map(difficulty => (
            <button
              key={difficulty}
              onClick={() => toggleDifficulty(difficulty)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                selectedDifficulties.includes(difficulty)
                  ? `${getDifficultyClass(difficulty)} ring-2 ring-offset-2 ring-offset-black ring-current`
                  : 'bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:bg-neutral-700/80'
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects && filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <div key={project.project_id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`}}>
                {data && <ProjectCard project={project} modules={data.modulesDB} />}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-neutral-400 py-10">
              <p>No projects found for the selected difficulty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}