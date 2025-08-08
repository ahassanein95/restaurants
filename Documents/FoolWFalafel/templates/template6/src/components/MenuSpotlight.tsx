import Image from 'next/image';
import { MenuItem } from '@/types/restaurant';

interface MenuSpotlightProps {
  items: MenuItem[];
}

export default function MenuSpotlight({ items }: MenuSpotlightProps) {
  return (
    <section id="featured" className="wrapper style2 spotlights">
      {items.map((item, index) => (
        <section key={item.id} className="spotlight">
          <div className={`image ${index % 2 === 1 ? 'md:order-2' : ''}`}>
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
          <div className={`content ${index % 2 === 1 ? 'md:order-1' : ''}`}>
            <div className="inner">
              <h2 className="text-3xl md:text-4xl font-light mb-2 text-gray-800">
                {item.name}
              </h2>
              <div className="text-sm text-purple-600 font-semibold mb-4 uppercase tracking-wider">
                {item.category}
              </div>
              <p className="text-lg leading-relaxed mb-4 text-gray-600">
                {item.description}
              </p>
              <div className="text-2xl font-light text-purple-600 mb-6">
                ${item.price}
              </div>
              <ul className="actions">
                <li>
                  <a href="#contact" className="button bg-purple-600 text-white border-purple-600 hover:bg-purple-700">
                    Reserve Table
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      ))}
    </section>
  );
}