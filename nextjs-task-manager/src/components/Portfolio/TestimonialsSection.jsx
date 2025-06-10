// components/TestimonialsSection.jsx
'use client'

import { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import AOS from 'aos'
import 'aos/dist/aos.css'

const testimonialsData = [
  {
    id: 1,
    fullName: 'Client 1',
    image: '/assets/image.png', // place image in public/assets
    comment:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam minima reprehenderit maiores itaque molestiae optio, voluptatibus iusto eos doloremque consectetur!',
  },
  {
    id: 2,
    fullName: 'Client 2',
    image: '/assets/image.png',
    comment:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam minima reprehenderit maiores itaque molestiae optio, voluptatibus iusto eos doloremque consectetur!',
  },
  {
    id: 3,
    fullName: 'Client 3',
    image: '/assets/image.png',
    comment:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam minima reprehenderit maiores itaque molestiae optio, voluptatibus iusto eos doloremque consectetur!',
  },
  {
    id: 4,
    fullName: 'Client 4',
    image: '/assets/image.png',
    comment:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam minima reprehenderit maiores itaque molestiae optio, voluptatibus iusto eos doloremque consectetur!',
  },
  {
    id: 5,
    fullName: 'Client 5',
    image: '/assets/image.png',
    comment:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam minima reprehenderit maiores itaque molestiae optio, voluptatibus iusto eos doloremque consectetur!',
  },
]

export default function TestimonialsSection() {
  useEffect(() => {
    AOS.init({ once: true })
  }, [])

  return (
    <section
      id="testimonials"
      className="text-white mt-20"
      data-aos="zoom-in"
    >
      <h2 className="text-4xl font-bold text-left mb-4 px-4 xl:pl-16">
        Testimonials
      </h2>
      <div className="px-4 xl:px-16">
        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            700: { slidesPerView: 2.5, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
          }}
        >
          {testimonialsData.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="carousel__item p-4">
                <div className="w-full mx-auto bg-[#111a3e] shadow-lg border border-[#1f1641] p-5 text-white font-light mb-6">
                  <div className="w-full flex mb-4 items-center">
                    <div className="overflow-hidden rounded-full w-10 h-10 bg-gray-50 border border-gray-200">
                      <img
                        src={t.image}
                        alt="testimonial image"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h6 className="ml-4 font-bold text-sm uppercase">
                      {t.fullName}
                    </h6>
                  </div>
                  <div className="w-full">
                    <p className="text-sm leading-tight">
                      <span className="text-lg leading-none italic font-bold text-white mr-1">"</span>
                      {t.comment}
                      <span className="text-lg leading-none italic font-bold text-white ml-1">"</span>
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}