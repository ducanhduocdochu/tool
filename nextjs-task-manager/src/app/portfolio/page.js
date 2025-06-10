'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamic imports for components with suspense
const NavBar = dynamic(() => import('@/components/Portfolio/NavBar'), { suspense: true })
const HeroSection = dynamic(() => import('@/components/Portfolio/HeroSection'), { suspense: true })
const AboutSection = dynamic(() => import('@/components/Portfolio/AboutSection'), { suspense: true })
const ExperienceAndSkills = dynamic(() => import('@/components/Portfolio/ExperienceAndSkills'), { suspense: true })
const LatestProjSection = dynamic(() => import('@/components/Portfolio/LatestProjSection'), { suspense: true })
const ContactSection = dynamic(() => import('@/components/Portfolio/ContactSection'), { suspense: true })
const Footer = dynamic(() => import('@/components/Portfolio/Footer'), { suspense: true })
const BackToTop = dynamic(() => import('@/components/Portfolio/BackToTop'), { suspense: true })

export default function PortfolioPage() {
  return (
    <div className="bg-white dark:bg-[#111827] min-h-screen transition-colors">
        <NavBar />
        <HeroSection />
        <AboutSection />
        <ExperienceAndSkills />
        <LatestProjSection />
        <ContactSection />
        <BackToTop />
    </div>
  )
}
