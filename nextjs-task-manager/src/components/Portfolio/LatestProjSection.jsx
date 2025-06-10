'use client'

import { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Sample projects data
const projectsData = [
  {
    id: 1,
    category: 'web development',
    image: 'https://mtv.vn/uploads/2023/02/25/meo-dd.jpg',
    title: 'Ecommerce Microservice',
    description:
      "Built a scalable API eCommerce platform with microservices: Identity, Product, Cart with Java Spring, Discount with NestJS, Scheduled Discount with ExpressJS, Order with Jin, Payment with .Net Core,... Communicate by Redis Stream by Redis, grpc, Restful Api, message queue by RabbitMQ. All service has coverage point > 93%, write Unit Tests, Isolation Tests, docs/docs-json API, docs API Postman.",
    technologies: [
      'Java Spring Boot',
      'NestJs, ExpressJs',
      '.Net Core',
      'Gin',
      'MongoDB',
      'MySQL',
      'Redis',
      'RabbitMQ',
    ],
    webURL: 'https://github.com/ducanhduocdochu/e-commercee',
  },
  {
    id: 2,
    category: 'web development',
    image: 'https://img.meta.com.vn/Data/image/2021/09/22/anh-meo-cute-de-thuong-dang-yeu-42.jpg',
    title: 'Set up CICD, Monitoring',
    description:
      'Developed and implemented CI/CD pipelines for automated software deployment using GitHub Actions, GitLab CI/CD, and Jenkins. Integrated Docker, Git, and DockerHub for efficient containerization and version control. Designed and deployed monitoring systems with Prometheus and Grafana to track real-time system performance and metrics. Built and deployed API-based applications, optimizing DevOps.',
    technologies: ['Github Action', 'Gitlab', 'Jenkins', 'Docker', 'Prometheus', 'Grafana'],
    webURL: 'https://github.com/ducanhduocdochu/setup_cicd_monitoring',
  },
  {
    id: 3,
    category: 'web development',
    image: 'https://th.bing.com/th/id/OIP.Psh5p4JHQVVxhvTJhyaL6QHaHa?rs=1&pid=ImgDetMain',
    title: 'Fullstack Development for a Social Networking Website',
    description:
      'Designed and implemented a microservices architecture, consisting of: Auth-server: Provides APIs for authentication and authorization. Backend-server: Manages APIs for users, posts, comments, likes, shares, follows, friendships, and notifications.Web-socket-server: Handles real-time notifications using RabbitMQ and WebSocket.',
    technologies: [
      'Discord Server',
      'MongoDB',
      'PostgreSQL',
      'Redis',
      'React',
      'Redux',
      'TailwindCSS',
      'Web socket',
    ],
    webURL: 'https://github.com/ducanhduocdochu/social',
  },
  {
    id: 4,
    category: 'web development',
    image: 'https://toigingiuvedep.vn/wp-content/uploads/2021/04/hinh-anh-nen-con-meo-cute.jpg',
    title: 'Fullstack Development - Cloning the Dev.to Website',
    description:
      'Developed a fullstack clone of the Dev.to website using the T3 stack, including: Frontend & Backend: Built with Next.js, authentication handled via NextAuth. API Communication: Integrated tRPC for seamless frontend-backend communication. Deployment: Hosted on Vercel, including database deployment. Image Storage: Utilized AWS and Cloudinary for media storage. Styling: Designed with Tailwind CSS for a modern and responsive UI.',
    technologies: ['NextJS', 'TypeScript', 'Cloudinary', 'TailwindCSS', 'NextAuth', 'Vercel', 'tRPC'],
    webURL: 'https://github.com/ducanhduocdochu/dev.to',
  },
]

export default function LatestProjSection() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    setProjects(projectsData)
    AOS.init({ once: true })
  }, [])

  return (
    <section id="projects" className="text-foreground mt-20">
      <div className="px-4 xl:pl-16">
        <div className="mb-4 md:flex md:justify-between xl:pr-16">
          <h2 className="text-4xl font-bold">My Latest Projects</h2>
        </div>

        <ul
          className="grid grid-cols-1 gap-6 pt-10 sm:grid-cols-2 md:gap-10 md:pt-12 lg:grid-cols-3 px-4 sm:py-16 xl:pr-16"
          data-aos="fade-right"
        >
          {projects.map((project) => (
            <li key={project.id} className="group">
              <div
                className="h-52 md:h-[24rem] rounded-t-xl relative bg-cover bg-center"
                style={{ backgroundImage: `url(${project.image})` }}
              >
                {/* 
                  Sửa hover: 
                  - Khi dark mode: overlay nên dùng bg-black/80, không dùng bg-opacity với dark:bg-[#181818], 
                  - Icon nên có màu đen ở light mode, trắng ở dark mode
                */}
                <div className={`
                  overlay absolute inset-0 
                  hidden items-center justify-center 
                  group-hover:flex 
                  transition-all duration-500
                  bg-black/0
                  group-hover:bg-black/80
                  dark:group-hover:bg-black/80
                `}>
                  <a
                    href={project.webURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-14 w-14 mr-2 border-2 rounded-full border-primary hover:border-secondary flex items-center justify-center bg-white/80 dark:bg-white/10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-10 w-10 text-black group-hover:text-secondary dark:text-white dark:group-hover:text-primary"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
                      />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="rounded-b-xl mt-3 bg-white/90 dark:bg-[#111a3e] shadow-lg border border-gray-200 dark:border-[#1f1641] py-6 px-4">
                <h3 className="text-lg font-semibold uppercase lg:text-xl">{project.title}</h3>
                <p className="text-muted-foreground mt-2">{project.description}</p>
                <div className="flex flex-wrap p-2.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="ml-1 mt-1 rounded-3xl bg-gray-100 text-primary dark:bg-[#111827] px-2 py-1 text-sm"
                      style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(9px)' }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}