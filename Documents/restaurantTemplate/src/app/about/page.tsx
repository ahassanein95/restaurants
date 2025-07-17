import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { restaurantData } from '@/data/restaurant';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        <Image
          src="/images/restaurant/about-hero.jpg"
          alt="Restaurant kitchen"
          fill
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Story</h1>
            <p className="text-xl">Discover the passion behind {restaurantData.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              A Legacy of Authentic Italian Cuisine
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {restaurantData.description}
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Founded in 1985 by the Rossi family, {restaurantData.name} has been serving 
              authentic Italian cuisine for over three decades. Our recipes have been 
              passed down through generations, each dish telling a story of tradition, 
              passion, and the love for genuine Italian flavors.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We believe that great food brings people together. Every ingredient is 
              carefully selected, every dish is prepared with love, and every guest 
              is treated like family. This is what makes {restaurantData.name} not 
              just a restaurant, but a home away from home.
            </p>
            <Link href="/reservations">
              <Button size="lg">
                Book Your Table
              </Button>
            </Link>
          </div>
          
          <div className="relative">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/restaurant/family-kitchen.jpg"
                alt="Restaurant family in kitchen"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Passion</h3>
              <p className="text-gray-600">
                We put our heart into every dish, creating food that brings joy and comfort to our guests.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600">
                Only the finest ingredients make it to our kitchen, ensuring every meal meets our high standards.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Family</h3>
              <p className="text-gray-600">
                We treat every guest as part of our extended family, creating a warm and welcoming atmosphere.
              </p>
            </div>
          </div>
        </div>

        {/* Chef Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/restaurant/head-chef.jpg"
                alt="Head Chef Marco Rossi"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Meet Our Head Chef
            </h2>
            <h3 className="text-xl font-semibold text-orange-600 mb-4">Marco Rossi</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Chef Marco Rossi brings over 20 years of culinary expertise to {restaurantData.name}. 
              Born and raised in Naples, Italy, he learned the art of cooking from his grandmother 
              and later honed his skills in some of Italy&apos;s most prestigious kitchens.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              His philosophy is simple: respect the ingredients, honor the traditions, and 
              cook with amore. Under his leadership, our kitchen creates dishes that transport 
              you straight to the heart of Italy with every bite.
            </p>
            <blockquote className="border-l-4 border-orange-500 pl-4 italic text-gray-700">
              &ldquo;Cooking is not just about feeding people; it&apos;s about creating memories, 
              sharing culture, and bringing people together around the table.&rdquo;
            </blockquote>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-orange-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Experience Our Story for Yourself
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Come and be part of our story. Whether it&apos;s a romantic dinner, family celebration, 
            or casual lunch with friends, we&apos;re here to make your experience memorable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Our Menu
              </Button>
            </Link>
            <Link href="/reservations">
              <Button size="lg" className="w-full sm:w-auto">
                Make a Reservation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}