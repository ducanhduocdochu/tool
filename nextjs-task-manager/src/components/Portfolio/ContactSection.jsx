'use client'

import { useState } from 'react'

export default function ContactSection() {
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' })
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: xử lý gửi form (API, email)
    console.log('Submit form:', formData)
    alert('Message sent! (demo)')
    setFormData({ email: '', subject: '', message: '' })
  }

  return (
    <section id="contact" className="text-foreground mt-20 relative">
      <h2 className="text-4xl font-bold mb-4 px-4 xl:pl-16">Let&apos;s Connect</h2>
      <div className="grid md:grid-cols-2 gap-4 px-4 xl:px-16 mt-8 relative" data-aos="zoom-in-up">
        {/* Info column */}
        <div>
          <p className="text-muted-foreground">
            I&apos;m always open to new opportunities and collaborations. Feel free to reach out to me for any exciting projects or discussions. Let&apos;s create something great together! 🚀
          </p>
          <div className="mt-5">
            {/* Email info */}
            <div className="flex items-center mb-10">
              <div className="p-2 bg-white/80 dark:bg-[#111a3e] w-12 h-12 flex justify-center items-center rounded-full border border-gray-200 dark:border-[#111a3e] backdrop-blur-lg">
                <img src="https://img.icons8.com/metro/50/6b21a8/new-post.png" alt="Email" className="w-6" />
              </div>
              <div className="ml-5">
                <h4 className="text-foreground">Email</h4>
                <p>tducanh263@gmail.com</p>
              </div>
            </div>
            {/* Phone info */}
            <div className="flex items-center mb-10">
              <div className="p-2 bg-white/80 dark:bg-[#111a3e] w-12 h-12 flex justify-center items-center rounded-full border border-gray-200 dark:border-[#111a3e] backdrop-blur-lg">
                <img src="https://img.icons8.com/ios-filled/50/6b21a8/phone.png" alt="Phone" className="w-6" />
              </div>
              <div className="ml-5">
                <h4 className="text-foreground">Phone</h4>
                <p>0842515966</p>
              </div>
            </div>
            {/* Facebook info */}
            <div className="flex items-center mb-10">
              <div className="p-2 bg-white/80 dark:bg-[#111a3e] w-12 h-12 flex justify-center items-center rounded-full border border-gray-200 dark:border-[#111a3e] backdrop-blur-lg">
                <img src="https://img.icons8.com/ios-filled/50/6b21a8/facebook.png" alt="Facebook" className="w-6" />
              </div>
              <div className="ml-5">
                <h4 className="text-foreground">Facebook</h4>
                <p>
                  <a
                    href="https://www.facebook.com/ducanhduocdochu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2 hover:opacity-80 transition"
                  >
                    https://www.facebook.com/ducanhduocdochu
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form column */}
        <div className="bg-white/90 dark:bg-[#111a3e] rounded-xl border border-gray-200 dark:border-[#111a3e] backdrop-blur-lg p-6">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6" data-aos="zoom-in-up">
            <div>
              <label htmlFor="email" className="block text-foreground mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email@gmail.com"
                className="w-full p-2.5 bg-gray-100 dark:bg-[#111827] text-foreground dark:text-gray-100 placeholder-gray-400 dark:placeholder-[#9CA2A9] rounded-lg text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-foreground mb-2 text-sm font-medium">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full p-2.5 bg-gray-100 dark:bg-[#111827] text-foreground dark:text-gray-100 placeholder-gray-400 dark:placeholder-[#9CA2A9] rounded-lg text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-foreground mb-2 text-sm font-medium">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Let's talk about ..."
                className="w-full p-2.5 bg-gray-100 dark:bg-[#111827] text-foreground dark:text-gray-100 placeholder-gray-400 dark:placeholder-[#9CA2A9] rounded-lg text-sm"
                rows={5}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 text-white bg-black rounded-full border-2 border-transparent hover:bg-blue-600 transition dark:text-black cursor-pointer"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Decorative gradient blur */}
        <div className="absolute -top-1/2 -left-1/2 transform translate-x-1/3 translate-y-1/3 bg-gradient-to-tr from-primary to-secondary opacity-25 blur-2xl h-20 w-80 z-0" />
      </div>
    </section>
  )
}