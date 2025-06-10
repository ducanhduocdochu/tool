// components/NavBar.jsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const menuItems = [
  { name: 'About Me', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleToggle = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const scrollToSection = (href) => {
    setIsMenuOpen(false)
    const section = document.querySelector(href)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="flex justify-between items-center p-6 pr-20 bg-opacity-50 relative z-20">
      <div className="text-2xl md:text-3xl font-bold text-primary dark:text-white drop-shadow-sm select-none">
        Portfolio
      </div>

      {/* Mobile toggle */}
      <div className="md:hidden z-40">
        <button
          onClick={handleToggle}
          className="block focus:outline-none rounded-full p-2 hover:bg-muted transition"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav
        className={`fixed inset-0 z-20 flex flex-col items-center justify-center bg-[#111827] md:relative md:bg-transparent md:flex-row md:justify-between transition-opacity duration-300 ${
          isMenuOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <ul className="flex flex-col items-center space-y-5 md:flex-row md:space-x-5 md:space-y-0">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => scrollToSection(item.href)}
                className="relative px-4 py-2 text-lg md:text-base font-medium text-foreground rounded-lg transition-colors
                  hover:text-primary hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 cursor-pointer"
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}