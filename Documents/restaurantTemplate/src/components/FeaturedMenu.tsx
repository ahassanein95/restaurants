import Link from 'next/link';
import MenuCard from '@/components/MenuCard';
import Button from '@/components/ui/Button';
import { menuData } from '@/data/menu';

export default function FeaturedMenu() {
  // Get featured and popular items
  const featuredItems = menuData
    .flatMap(category => category.items)
    .filter(item => item.featured || item.popular)
    .slice(0, 6);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Dishes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular and signature dishes, crafted with the finest ingredients
            and traditional techniques passed down through generations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
        
        <div className="text-center">
          <Link href="/menu">
            <Button size="lg">
              View Full Menu
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}