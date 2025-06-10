'use client'

import { useEffect, useState } from 'react'

const educationData = [
  {
    id: 1,
    school: 'Hanoi University of Science and Technology',
    program: 'Mathematics and Informatics',
    year: '2021-2025',
  },
]

export default function AboutSection() {
  const [education, setEducation] = useState([])

  useEffect(() => {
    setEducation(educationData)
  }, [])

  return (
    <section id="about" className="relative text-foreground mt-18">
      {/* Background Gradient Blur */}
      <div className="absolute z-0 top-[93rem] inset-x-0 h-64 flex items-start pointer-events-none">
        <div className="h-24 w-64 bg-gradient-to-br from-primary via-secondary to-[#570cac] blur-2xl opacity-20" />
      </div>

      <div className="relative z-10 md:grid md:grid-cols-2 gap-8 items-start py-8 px-4 xl:gap-16 sm:py-16 xl:px-16">
        {/* Education Column */}
        <div data-aos="flip-right">
          <h2 className="text-4xl font-bold mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              My Education
            </span>
          </h2>
          <div className="space-y-8 py-8">
            {education.map((item) => (
              <div
                key={item.id}
                className="flex items-center w-full md:w-[80%] rounded-xl bg-white/80 dark:bg-[#111a3e] shadow-lg border border-border dark:border-[#1f1641] p-2"
              >
                <div className="w-1/4 ml-10">
                  <img
                    src="https://img.icons8.com/ios-glyphs/60/6b21a8/graduation-cap--v1.png"
                    alt="graduation cap"
                    className="w-12 h-12"
                  />
                </div>
                <div className="w-3/4 pl-4">
                  <h3 className="text-xl font-semibold uppercase bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    {item.school}
                  </h3>
                  <p className="mt-1">{item.program}</p>
                  <p className="mt-1">{item.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Me Column */}
        <div
          className="flex flex-col text-left h-full"
          data-aos="flip-right"
        >
          <h2 className="text-4xl font-bold mb-8">
            More{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              About Me
            </span>
          </h2>
          <p className="text-base lg:text-lg py-8 text-muted-foreground text-black">
            🌱 I am a passionate Web Developer with a strong background in web development. I specialize in building modern, scalable, and high-performance web applications using technologies like Vue.js, React, Node.js (NestJS), and Golang.
            <br />
            💡 I love turning ideas into reality through clean, efficient, and maintainable code. My focus is on user experience, performance optimization, and scalable architecture.
            <br />
            🚀 Constantly learning and exploring new technologies, I thrive in collaborative environments where innovation and problem-solving are key.
            <br />
            📌 Let’s connect and build something amazing!
          </p>
        </div>
      </div>
    </section>
  )
}