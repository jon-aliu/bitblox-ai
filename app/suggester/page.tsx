'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// --- TYPE DEFINITIONS ---
interface Module {
  id: string
  name: string
  aliases: string[]
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
  missing_modules?: { module_id: string; quantity: number; missing: number }[]
}

interface Data {
  modulesDB: Module[]
  projectsDB: Project[]
}

// --- MAIN COMPONENT ---
export default function SuggesterPage() {
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  
  const [inputType, setInputType] = useState<'text' | 'manual'>('text')
  const [textInput, setTextInput] = useState('')
  const [manualQuantities, setManualQuantities] = useState<Record<string, number>>({})
  
  const [perfectMatches, setPerfectMatches] = useState<Project[]>([])
  const [nearMatches, setNearMatches] = useState<Project[]>([])
  const [hasSearched, setHasSearched] = useState(false)

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
        

        const initialQuantities = data.modulesDB.reduce((acc, module) => {
          acc[module.id] = module.id === 'BBM-001' ? 1 : 0
          return acc
        }, {} as Record<string, number>);
        setManualQuantities(initialQuantities)
        
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading data:', err)
        setLoading(false)
      })
  }, [])

  const handleSuggestProjects = () => {
    if (!data) return
    
    setAnalyzing(true)
    setHasSearched(true)
    setPerfectMatches([])
    setNearMatches([])

    let userInventory: Record<string, number> = {}

    if (inputType === 'text') {
        const aliasToModuleMap: Record<string, string> = {}
        data.modulesDB.forEach(module => {
            module.name.toLowerCase().split(/\s+/).forEach(part => aliasToModuleMap[part] = module.id);
            module.aliases.forEach(alias => aliasToModuleMap[alias.toLowerCase()] = module.id)
        })

        const words = textInput.toLowerCase().split(/[\s,]+/)
        userInventory['BBM-001'] = 1 // Always have the TRU

        for (let i = 0; i < words.length; i++) {
            const word = words[i]
            const quantity = parseInt(word)

            if (!isNaN(quantity)) {
                if (i + 1 < words.length) {
                    const nextWord = words[i+1]
                    const moduleId = aliasToModuleMap[nextWord]
                    if (moduleId) {
                        userInventory[moduleId] = (userInventory[moduleId] || 0) + quantity
                        i++; 
                    }
                }
            } else {
                const moduleId = aliasToModuleMap[word]
                if (moduleId) {
                    userInventory[moduleId] = (userInventory[moduleId] || 0) + 1
                }
            }
        }
    } else {
      userInventory = { ...manualQuantities };
    }
    
    setTimeout(() => {
        const recommended = {
            perfect: [] as Project[],
            near: [] as Project[],
        };

        data.projectsDB.forEach(project => {
            let missingCount = 0;
            const missingModules: { module_id: string; quantity: number; missing: number }[] = [];

            project.required_modules.forEach(req => {
                const userQty = userInventory[req.module_id] || 0
                if (userQty < req.quantity) {
                    missingCount += (req.quantity - userQty)
                    missingModules.push({ ...req, missing: req.quantity - userQty })
                }
            })

            if (missingCount === 0) {
                recommended.perfect.push(project)
            } else if (missingCount <= 2) { // Criteria for a near match
                recommended.near.push({ ...project, missing_modules: missingModules })
            }
        });

        setPerfectMatches(recommended.perfect)
        setNearMatches(recommended.near)
        setAnalyzing(false)
    }, 1500)
  }

  const updateManualQuantity = (moduleId: string, change: number) => {
    // Prevent TRU from going below 1
    if (moduleId === 'BBM-001' && manualQuantities[moduleId] + change < 1) return;
    setManualQuantities(prev => ({
      ...prev,
      [moduleId]: Math.max(0, (prev[moduleId] || 0) + change)
    }))
  }

  const isSuggestDisabled = () => {
    if (loading || analyzing) return true
    if (inputType === 'text') return !textInput.trim()
    
    return Object.entries(manualQuantities).every(([id, qty]) => id === 'BBM-001' || qty === 0)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-lg text-neutral-400">Loading BitBlox Database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid gap-10 md:grid-cols-5">
        {/* --- LEFT INPUT COLUMN --- */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-neutral-900/50 p-6 rounded-xl ring-1 ring-neutral-800">
            <h2 className="text-xl font-semibold text-neutral-100 mb-4">Project Suggester</h2>
            
            {/* Input Mode Toggle */}
            <div className="flex bg-neutral-800 rounded-lg p-1 mb-5">
              <button
                onClick={() => setInputType('text')}
                className={`w-1/2 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  inputType === 'text' 
                    ? 'bg-[#00CE93] text-black shadow-[0_0_15px_-3px_rgba(0,206,147,0.5)]' 
                    : 'text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                Text Input
              </button>
              <button
                onClick={() => setInputType('manual')}
                className={`w-1/2 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  inputType === 'manual' 
                    ? 'bg-[#00CE93] text-black shadow-[0_0_15px_-3px_rgba(0,206,147,0.5)]' 
                    : 'text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                Manual Selection
              </button>
            </div>

            {inputType === 'text' ? (
              <div>
                <p className="text-sm text-neutral-400 mb-3">Describe your modules in plain English. For example: "I have 2 motors, 1 LED, and 1 sensor"</p>
                <textarea
                  rows={5}
                  className="w-full bg-neutral-800 px-3 py-2 border border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00CE93] transition-all duration-300"
                  placeholder="Example: 2 motors, 1 LED blox, 1 distance sensor, 1 sound blox"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={loading}
                />
              </div>
            ) : (
              <div className="max-h-120 overflow-y-auto pr-2 space-y-2">
                <p className="text-sm text-neutral-400 mb-3">Manually select the modules you have:</p>
                {data?.modulesDB.map(module => (
                  <div key={module.id} className="flex items-center justify-between bg-neutral-800 p-2 rounded-md">
                    <span className="text-sm text-neutral-200">{module.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateManualQuantity(module.id, -1)}
                        disabled={module.id === 'BBM-001' && manualQuantities[module.id] <= 1}
                        className="bg-neutral-700 w-7 h-7 rounded-md text-lg text-neutral-300 hover:bg-neutral-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="font-mono w-8 text-center text-neutral-100">{manualQuantities[module.id] || 0}</span>
                      <button
                        onClick={() => updateManualQuantity(module.id, 1)}
                        className="bg-neutral-700 w-7 h-7 rounded-md text-lg text-neutral-300 hover:bg-neutral-600 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleSuggestProjects}
              disabled={isSuggestDisabled()}
              className="w-full mt-6 bg-[#00CE93] text-black py-3 px-4 rounded-md font-semibold hover:bg-[#00b37f] focus:outline-none focus:ring-2 focus:ring-[#00CE93] focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-95 hover:shadow-[0_0_20px_-5px_rgba(0,206,147,0.7)]"
            >
              {analyzing ? 'Analyzing...' : loading ? 'Loading Database...' : 'Suggest Projects'}
            </button>
          </div>

          <div className="bg-neutral-900/50 p-6 rounded-xl ring-1 ring-neutral-800">
            <h3 className="text-lg font-medium text-neutral-300 mb-3">Examples</h3>
            <ul className="text-sm text-neutral-400 space-y-2 list-disc list-inside">
              <li>"2 motors, 1 LED, 1 distance sensor"</li>
              <li>"1 motor driver, 4 motors, 2 LEDs"</li>
              <li>"1 sound blox, 1 button, 1 display"</li>
            </ul>
          </div>
        </div>

        {/* --- RIGHT RESULTS COLUMN --- */}
        <div className="md:col-span-3">
          <div className="min-h-[500px]">
            {analyzing ? (
              <div className="flex items-center justify-center h-full pt-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CE93] mx-auto mb-4"></div>
                  <p className="text-neutral-400 mt-4">Analyzing your modules...</p>
                </div>
              </div>
            ) : !hasSearched ? (
               <div className="text-center py-20">
                 <div className="text-6xl mb-4">🤖</div>
                 <h3 className="text-2xl font-semibold text-neutral-200 mb-2">Ready to Suggest!</h3>
                 <p className="text-neutral-400 mt-2 max-w-md mx-auto">Tell us what modules you have, and we'll find the perfect projects for you.</p>
               </div>
            ) : perfectMatches.length === 0 && nearMatches.length === 0 ? (
               <div className="text-center py-20">
                 <div className="text-6xl mb-4">😕</div>
                 <h3 className="text-2xl font-semibold text-neutral-200 mb-2">No Projects Found</h3>
                 <p className="text-neutral-400 mt-2 max-w-md mx-auto">We couldn't find any projects that match your current modules. Try adding more modules or check out our full project catalog.</p>
               </div>
            ) : (
              <div className="space-y-10">
                {perfectMatches.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[#00CE93]">Perfect Matches</h2>
                    {perfectMatches.map(project => (
                      <ProjectCard key={project.project_id} project={project} modules={data?.modulesDB || []} />
                    ))}
                  </div>
                )}
                {nearMatches.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-amber-400">Near Matches</h2>
                    {nearMatches.map(project => (
                      <ProjectCard key={project.project_id} project={project} modules={data?.modulesDB || []} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


function ProjectCard({ project, modules }: { project: Project; modules: Module[] }) {
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
        case 'Beginner': return 'bg-green-800/80 text-green-300 border-green-600/50';
        case 'Intermediate': return 'bg-yellow-800/80 text-yellow-300 border-yellow-600/50';
        case 'Advanced': return 'bg-red-800/80 text-red-300 border-red-600/50';
        default: return 'bg-neutral-700 text-neutral-300 border-neutral-600';
    }
  }

  return (
    <div className="bg-neutral-900/50 p-6 rounded-xl ring-1 ring-neutral-800 transition-all duration-300 hover:ring-[#00CE93] hover:shadow-[0_0_25px_-5px_rgba(0,206,147,0.3)]">
        <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-neutral-100">{project.name}</h3>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getDifficultyBadge(project.difficulty)}`}>
                {project.difficulty}
            </span>
        </div>
        <p className="text-neutral-400 text-sm mb-4 line-clamp-3">{project.description}</p>
        
        {project.missing_modules && project.missing_modules.length > 0 && (
            <div className="bg-yellow-900/50 border border-yellow-400/20 rounded-lg p-3 mb-4">
                <h4 className="font-semibold text-yellow-400 text-sm mb-2">You are missing:</h4>
                <ul className="text-sm text-neutral-300 space-y-1">
                    {project.missing_modules.map(m => (
                        <li key={m.module_id}>
                            <span className="font-mono bg-yellow-400/20 text-yellow-300 rounded px-1.5 py-0.5 text-xs mr-2">{m.missing}x</span> 
                            {modules.find(mod => mod.id === m.module_id)?.name}
                        </li>
                    ))}
                </ul>
            </div>
        )}
        
        <Link href={`/projects/${project.project_id}`} className="text-sm font-medium text-[#00CE93] hover:underline">
            See Details →
        </Link>
    </div>
  )
} 
