'use client'

import { useEffect, useState } from 'react'

const initialSkills = [
  {
    id: 1,
    name: 'Javascript, Python, C#, Java, Golang (Programming Languages)',
    width: '65%',
  },
  {
    id: 2,
    name: 'HTML, CSS, JavaScript, Bootstrap, TailwindCSS, ReactJS, ReduxJS, NextJS (Frontend)',
    width: '70%',
  },
  {
    id: 3,
    name: 'RESTful APIs, NodeJS, Mongoose, ExpressJS, NestJS, Java Spring Boot, .NET Core, Gin (Backend)',
    width: '80%',
  },
  {
    id: 4,
    name: 'MySQL, PostgreSQL, MongoDB, Redis, Cloudinary, AWS S3, DigitalOcean (Database)',
    width: '70%',
  },
  {
    id: 5,
    name: 'Linux, Docker, GitHub, GitHub Actions, GitLab, Jenkins, DockerHub (DevOps)',
    width: '60%',
  },
]

const initialExperiences = [
  {
    id: 1,
    role: 'Web Developer',
    company: 'Udata Company',
    date: 'July 2024 - January 2025',
  },
]

export default function ExperienceAndSkills() {
  const [skills, setSkills] = useState([])
  const [experiences, setExperiences] = useState([])

  useEffect(() => {
    setSkills(initialSkills)
    setExperiences(initialExperiences)
  }, [])

  return (
    <section id="skills" className="relative text-foreground mt-18">
      {/* Decorative blur spans */}
      <div className="absolute right-0 top-[110rem] h-full w-full flex justify-end opacity-20 pointer-events-none">
        <span className="w-16 h-32 rounded-l-full bg-primary blur-2xl" />
        <span className="w-16 h-32 rounded-r-full bg-pink-200 dark:bg-[#f88fc2] blur-2xl mt-14" />
      </div>

      <div className="relative z-10 md:grid md:grid-cols-2 gap-8 items-start py-8 px-4 xl:gap-16 xl:px-16">
        {/* Skills Column */}
        <div className="flex flex-col w-full h-full text-left" data-aos="fade-right">
          <h2 className="text-4xl font-bold mb-8">
            My{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Skills
            </span>
          </h2>
          <div className="space-y-6">
            {skills.map((skill) => (
              <div key={skill.id}>
                <div className="flex items-end justify-between">
                  <h4 className="font-semibold uppercase">{skill.name}</h4>
                  <h3 className="text-2xl font-bold">{skill.width}</h3>
                </div>
                <div className="mt-2 h-1 w-full bg-gray-200 dark:bg-[#131d30] rounded-full">
                  <div
                    className="h-1 rounded-full bg-primary"
                    style={{ width: skill.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experiences Column */}
        <div className="flex flex-col h-full text-left" data-aos="fade-left">
          <h2 className="text-4xl font-bold mb-8">
            My{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Experiences
            </span>
          </h2>
          <div className="space-y-8">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="flex items-center rounded-xl p-4 bg-white/80 dark:bg-[#111a3e] shadow-lg border border-gray-200 dark:border-[#1f1641] w-full"
              >
                <div className="w-1/4 flex justify-center">
                  <img
                    src="https://img.icons8.com/ios-filled/100/6b21a8/lawyer.png"
                    alt="experience icon"
                    className="w-12 h-12"
                  />
                </div>
                <div className="w-3/4 pl-4">
                  <h3 className="text-2xl font-semibold uppercase bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    {exp.role}
                  </h3>
                  <p className="mt-1">{exp.company}</p>
                  <p className="mt-1">{exp.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}