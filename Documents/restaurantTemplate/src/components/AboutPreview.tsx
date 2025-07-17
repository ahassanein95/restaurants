import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { restaurantData } from '@/data/restaurant';

export default function AboutPreview() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {restaurantData.description}
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Since our founding, we&apos;ve been committed to providing an authentic Italian 
              dining experience that brings families and friends together. Our chefs combine 
              time-honored recipes with the freshest local ingredients to create dishes that 
              celebrate the rich culinary traditions of Italy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/about">
                <Button variant="outline">
                  Learn More About Us
                </Button>
              </Link>
              <Link href="/reservations">
                <Button>
                  Make a Reservation
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/restaurant/chef-cooking.jpg"
                alt="Chef preparing fresh pasta"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/restaurant/dining-room.jpg"
                alt="Restaurant dining room"
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}