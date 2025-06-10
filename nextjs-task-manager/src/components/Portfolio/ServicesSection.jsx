// components/ServicesSection.jsx
'use client'

import { useEffect, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

const initialServices = [
  {
    id: 1,
    icon: 'https://img.icons8.com/ios-filled/100/ffffff/google-code.png',
    name: 'WEB DEVELOPMENT',
    description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta, ut!',
  },
  {
    id: 2,
    icon: 'https://img.icons8.com/external-vectorslab-glyph-vectorslab/100/ffffff/external-Technical-Writing-mobile-app-development-vectorslab-glyph-vectorslab.png',
    name: 'TECHNICAL WRITING',
    description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta, ut!',
  },
  {
    id: 3,
    icon: 'https://img.icons8.com/external-solid-design-circle/100/ffffff/external-Mobile-Development-digital-marketing-solid-design-circle.png',
    name: 'MOBILE DEVELOPMENT',
    description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta, ut!',
  },
  {
    id: 4,
    icon: 'https://img.icons8.com/ios-filled/100/ffffff/email-open.png',
    name: 'EMAIL MARKETING',
    description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta, ut!',
  },
  {
    id: 5,
    icon: 'https://img.icons8.com/ios-filled/100/ffffff/windows10-personalization.png',
    name: 'GRAPHIC DESIGN',
    description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta, ut!',
  },
  {
    id: 6,
    icon: 'https://img.icons8.com/ios-filled/100/ffffff/web-design.png',
    name: 'WEB DESIGN',
    description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta, ut!',
  },
]

export default function ServicesSection() {
  const [services, setServices] = useState([])

  useEffect(() => {
    AOS.init({ once: true })
    setServices(initialServices)
  }, [])

  return (
    <section id="services" className="text-white mt-20">
      <div className="px-4 xl:pl-16">
        <h2 className="text-4xl font-bold mb-4">My Services</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 pt-10 sm:grid-cols-2 md:gap-10 md:pt-12 lg:grid-cols-3 py-8 px-4 xl:px-16">
        {services.map((service) => (
          <div
            key={service.id}
            className="px-8 py-12 rounded-xl bg-[#111a3e] shadow-lg border border-[#1f1641]"
            data-aos="fade-up"
          >
            <div className="mx-auto h-24 w-24 text-center xl:h-28 xl:w-28">
              <img src={service.icon} alt={`${service.name} icon`} className="mx-auto" />
            </div>
            <div className="text-center mt-4">
              <h3 className="pt-8 text-lg font-semibold uppercase bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary lg:text-xl">
                {service.name}
              </h3>
              <p className="text-gray-300 pt-4 text-sm md:text-base">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}