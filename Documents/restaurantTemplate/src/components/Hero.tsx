import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { restaurantData } from '@/data/restaurant';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Restaurant interior"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {restaurantData.name}
        </h1>
        <p className="text-xl md:text-2xl mb-6 font-light">
          {restaurantData.tagline}
        </p>
        <p className="text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          {restaurantData.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/menu">
            <Button size="lg" className="w-full sm:w-auto">
              View Our Menu
            </Button>
          </Link>
          <Link href="/reservations">
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white text-white hover:bg-white hover:text-gray-900">
              Make a Reservation
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}