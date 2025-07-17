import Image from 'next/image';
import { MenuItem } from '@/types/restaurant';
import { formatPrice, getDietaryIcon, getSpicyLevel } from '@/lib/utils';

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {item.image && (
        <div className="relative h-48 w-full">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {item.featured && (
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Featured
              </span>
            )}
            {item.popular && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Popular
              </span>
            )}
          </div>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <span className="text-lg font-bold text-orange-600 ml-2">
            {formatPrice(item.price)}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 leading-relaxed">
          {item.description}
        </p>
        
        {item.dietary.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.dietary.map((diet, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                title={diet.type}
              >
                {getDietaryIcon(diet.type)}
                <span className="ml-1 capitalize">{diet.type.replace('-', ' ')}</span>
                {diet.type === 'spicy' && diet.level && (
                  <span className="ml-1">{getSpicyLevel(diet.level)}</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}