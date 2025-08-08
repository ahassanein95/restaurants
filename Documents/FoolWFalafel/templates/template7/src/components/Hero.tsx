'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { HeroProps } from '@/types/restaurant'

export default function Hero({ heroImages, restaurantName, description }: HeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 6000)

    return () => clearInterval(interval)
  }, [heroImages.length])

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index)
  }

  // Split restaurant name into words for animation
  const nameWords = restaurantName.split(' ')

  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #f59e0b 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #ea580c 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Floating Decorative Elements - Subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-20 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-gradient-to-br from-orange-400/8 to-red-600/8 rounded-full blur-3xl animate-pulse [animation-delay:3s]"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column - Text Content */}
            <div className="lg:col-span-7 text-left">
              {/* Animated Restaurant Name */}
              <div className="mb-8">
                {nameWords.map((word, index) => (
                  <div
                    key={index}
                    className={`inline-block mr-6 ${
                      isLoaded ? 'animate-slide-in-left' : 'opacity-0 translate-x-[-50px]'
                    }`}
                    style={{ animationDelay: `${index * 300}ms` }}
                  >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-400 drop-shadow-2xl leading-tight">
                      {word}
                    </h1>
                  </div>
                ))}
              </div>

              {/* Subtitle */}
              <div className="mb-8">
                <h2 className={`text-2xl md:text-3xl lg:text-4xl font-light text-amber-200 leading-relaxed ${
                  isLoaded ? 'animate-fade-in-up' : 'opacity-0'
                }`} style={{ animationDelay: '800ms' }}>
                  Authentic Middle Eastern
                </h2>
                <h2 className={`text-2xl md:text-3xl lg:text-4xl font-light text-orange-200 leading-relaxed ${
                  isLoaded ? 'animate-fade-in-up' : 'opacity-0'
                }`} style={{ animationDelay: '1200ms' }}>
                  Street Food Experience
                </h2>
              </div>

              {/* Description */}
              <p className={`text-lg md:text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl ${
                isLoaded ? 'animate-fade-in-up' : 'opacity-0'
              }`} style={{ animationDelay: '1600ms' }}>
                {description}
              </p>

              {/* CTA Button */}
              <div className={`${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '2000ms' }}>
                <button
                  onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-5 px-12 rounded-full text-lg transition-all duration-500 transform hover:scale-105 shadow-2xl border border-amber-400/30"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Explore Our Menu
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>
              </div>

            </div>

            {/* Right Column - Image Showcase */}
            <div className="lg:col-span-5 relative">
              {/* Main Image Container */}
              <div className={`relative ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`} style={{ animationDelay: '1000ms' }}>
                
                {/* Image Grid */}
                <div className="relative">
                  {/* Main Large Image */}
                  <div className="relative h-96 md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-500/30">
                    <Image
                      src={heroImages[currentImageIndex]}
                      alt={`Featured ${restaurantName} dish`}
                      fill
                      className="object-cover transition-all duration-1000 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    
                    {/* Image Overlay Content */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                        <div className="text-white">
                          <div className="text-sm text-amber-300 font-medium mb-1">Featured Today</div>
                          <div className="text-lg font-bold">Authentic Middle Eastern Flavors</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Small Preview Images */}
                  <div className="absolute -right-4 -bottom-4 space-y-3 hidden md:block">
                    {heroImages.slice(0, 2).map((image, index) => (
                      <div 
                        key={index}
                        className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl overflow-hidden shadow-xl border-3 border-white/20 backdrop-blur-sm cursor-pointer transition-transform hover:scale-105"
                        onClick={() => goToSlide(index)}
                      >
                        <Image
                          src={image}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-xl border border-amber-400/50">
                  <div className="text-sm font-bold">Fresh Daily</div>
                </div>
              </div>

              {/* Background Accent */}
              <div className="absolute top-8 right-8 w-72 h-72 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative overflow-hidden transition-all duration-500 ${
                index === currentImageIndex
                  ? 'w-12 h-3 bg-gradient-to-r from-amber-400 to-orange-500'
                  : 'w-3 h-3 bg-white/30 hover:bg-white/50'
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentImageIndex && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20">
        <button
          onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
          className="group flex flex-col items-center text-white/60 hover:text-amber-300 transition-all duration-300"
          aria-label="Scroll to menu"
        >
          <span className="text-sm font-medium mb-2 opacity-80">Scroll</span>
          <div className="w-6 h-10 border-2 border-current rounded-full relative">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-current rounded-full animate-bounce"></div>
          </div>
        </button>
      </div>
    </section>
  )
}