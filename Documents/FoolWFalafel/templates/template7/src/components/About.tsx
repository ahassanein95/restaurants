'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AboutProps } from '@/types/restaurant'

export default function About({ description, aboutImage, restaurantName }: AboutProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const currentSection = sectionRef.current
    if (currentSection) {
      observer.observe(currentSection)
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection)
      }
    }
  }, [])

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Fresh Daily",
      description: "All ingredients prepared fresh every morning"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Made with Love",
      description: "Traditional recipes passed down through generations"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Fast Service",
      description: "Quick preparation without compromising quality"
    }
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-white to-amber-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className={`relative ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={aboutImage}
                alt={`About ${restaurantName}`}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-orange-400 to-red-500 rounded-full opacity-20"></div>
          </div>

          {/* Content Side */}
          <div className={`${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About{' '}
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  {restaurantName}
                </span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {description}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Experience the authentic flavors of the Middle East in every bite. Our commitment to 
                quality ingredients and traditional cooking methods ensures that each dish tells a 
                story of heritage and passion.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`text-center p-6 bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105 ${
                    isVisible ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${600 + index * 200}ms` }}
                >
                  <div className="text-amber-600 mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">10+</div>
                <div className="text-gray-600 text-sm">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">100+</div>
                <div className="text-gray-600 text-sm">Menu Items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">5000+</div>
                <div className="text-gray-600 text-sm">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}