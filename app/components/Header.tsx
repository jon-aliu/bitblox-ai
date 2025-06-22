'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: '/suggester', label: 'Suggester AI' },
    { href: '/projects', label: 'Projects' },
    { href: '/modules', label: 'Modules' },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-neutral-100">BitBlox Project Creator AI</span>
            </Link>

            <nav className="hidden md:flex space-x-8">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive(link.href)
                      ? 'text-[#00CE93]'
                      : 'text-neutral-300 hover:text-neutral-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu} 
                className="z-50 text-neutral-300 hover:text-neutral-100"
                aria-label="Toggle mobile menu"
              >
                <div className="w-6 h-6 relative">
                  <span className={`absolute h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 top-1/2' : 'top-1/4'}`}></span>
                  <span className={`absolute h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : 'top-1/2'}`}></span>
                  <span className={`absolute h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 top-1/2' : 'top-3/4'}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <nav className="flex flex-col items-center justify-center h-full space-y-8">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={toggleMobileMenu}
              className={`text-3xl font-bold transition-all duration-300 ${
                isActive(link.href)
                  ? 'text-[#00CE93]'
                  : 'text-neutral-400 hover:text-white'
              } animate-fade-in-up`}
              style={{ animationDelay: `${index * 150 + 200}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
} 