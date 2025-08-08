'use client'

import { useState, useEffect, useRef } from 'react'
import { MenuProps, MenuItem } from '@/types/restaurant'

export default function Menu({ menuCategories }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState(Object.keys(menuCategories)[0])
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const categories = Object.keys(menuCategories)

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

  const formatPrice = (price: number, currency: string) => {
    return `${price} ${currency}`
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: JSX.Element } = {
      'Shawarma': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      'Pastries': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A2.998 2.998 0 013 15.546V8.5l18-1v8.046z" />
        </svg>
      ),
      'Grilled': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
      'Appetizers': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      ),
      'Beverages': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3a2 2 0 002 2h4a2 2 0 002-2v-3M8 14V9a2 2 0 012-2h4a2 2 0 012 2v5M8 14l4-4 4 4" />
        </svg>
      ),
      'Breakfast': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    }
    return icons[category] || icons['Appetizers']
  }

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-amber-50 to-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our{' '}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Menu
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our authentic Middle Eastern dishes, crafted with traditional recipes and the finest ingredients
          </p>
        </div>

        {/* Category Tabs */}
        <div className={`mb-12 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-amber-50 border border-gray-200'
                }`}
              >
                {getCategoryIcon(category)}
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className={`${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuCategories[activeCategory]?.map((item: MenuItem, index: number) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {item.item}
                    </h3>
                    <div className="ml-4 flex-shrink-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800">
                        {formatPrice(item.price, item.currency)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Add some visual interest with a decorative line */}
                  <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full mb-4"></div>
                  
                  {/* Category badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {activeCategory}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}