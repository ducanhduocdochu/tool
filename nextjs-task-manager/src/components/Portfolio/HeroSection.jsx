'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function HeroSection() {
  useEffect(() => {
    AOS.init({ once: true })
  }, [])

  return (
    <section className="relative w-full" data-aos="zoom-in-up">
      {/* Decorative Gradients */}
      <div className="absolute top-0 inset-x-0 h-64 flex items-start pointer-events-none">
        {/* Gradients adjust color for light/dark */}
        <div className="h-24 w-2/3 bg-gradient-to-br from-primary/40 to-secondary/30 dark:from-[#570cac] dark:to-primary blur-2xl opacity-0 dark:opacity-20" />
        <div className="h-20 w-3/5 bg-gradient-to-r from-primary/40 to-secondary/30 dark:from-[#670ccf] dark:to-pink-500 opacity-20 blur-2xl" />
      </div>

      <div className="w-full px-5 sm:px-8 md:px-12 lg:px-8 max-w-screen-lg lg:max-w-screen-xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-14 pt-24 lg:max-w-none max-w-2xl md:max-w-3xl mx-auto relative">
          {/* Left Text Column */}
          <div className="lg:py-6">
            <div className="text-center lg:text-left">
              <h1 className="pt-4 font-bold text-4xl md:text-5xl lg:text-6xl text-foreground">
                Hi guys 👋,
                <br />
                I&apos;m{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
                  Duc Anh
                </span>{' '}
                😁
              </h1>
            </div>
            <p className="text-muted-foreground pt-8 text-center lg:text-left mx-auto max-w-xl">
              🌱 A passionate software developer from Vietnam
              <br />
              🔭 I’m currently working on Updating...
              <br />
              📫 Feel free to reach me out{' '}
              <a href="mailto:tducanh263@gmail.com" className="text-primary underline underline-offset-2 hover:opacity-80 transition">
                tducanh263@gmail.com
              </a>
              <br />
              💬 GitHub url:{' '}
              <a
                href="https://github.com/ducanhduocdochu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-80 transition"
              >
                https://github.com/ducanhduocdochu
              </a>
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-9 sm:w-max sm:mx-auto lg:mx-0">
              <a
                href="mailto:tducanh263@gmail.com"
                className="relative group w-full sm:w-max px-6 md:px-7 py-3 rounded-full flex justify-center"
              >
                <span className="absolute inset-0 rounded-3xl dark:bg-white bg-primary border-2 border-transparent group-hover:scale-105 origin-center transition-all ease-in-out " />
                <span className="relative flex items-center justify-center text-white text-white dark:text-black">Hire Me</span>
              </a>

              <a
                href="/Tran-Duc-Anh-Web-Developer.pdf"
                download="Tran-Duc-Anh-Web-Developer.pdf"
                className="flex items-center gap-2 border border-primary px-6 md:px-7 py-3 rounded-full hover:scale-105 transition-all ease-in-out bg-background/80"
              >
                {/* Download SVG Icon */}
                <svg
                  className="download-icon"
                  width="18"
                  height="22"
                  viewBox="0 0 18 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 9L9 13M9 13L5 9M9 13V1"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1 17V18C1 18.7956 1.31607 19.5587 1.87868 20.1213C2.44129
                    20.6839 3.20435 21 4 21H14C14.7956 21 15.5587 20.6839 16.1213
                    20.1213C16.6839 19.5587 17 18.7956 17 18V17"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-primary">Download CV</span>
              </a>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:h-full md:flex relative">
            <div className="flex w-full h-96 min-h-[24rem] lg:h-full items-center relative">
              <div className="absolute z-0 top-1/2 -translate-y-1/2 w-5/6 right-0 h-[calc(80%+20px)] bg-gradient-to-tr from-primary/40 to-secondary/30 dark:from-[#570cac] dark:to-primary opacity-20 blur-2xl" />
              <div className="absolute z-10 p-2 top-1/2 -translate-y-1/2 right-0 md:right-40 sm:right-16 rounded-full shadow-lg border border-primary bg-background">
                <img
                  src="https://avatars.githubusercontent.com/u/100296074?v=4"
                  alt="Hero pic"
                  width={500}
                  height="auto"
                  loading="lazy"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}