import Image from 'next/image';
import { RestaurantData } from '@/types/restaurant';

interface AboutProps {
  data: RestaurantData;
}

export default function About({ data }: AboutProps) {
  return (
    <section id="about" className="wrapper style2 spotlights">
      <section className="spotlight">
        <div className="image">
          <Image
            src={data.aboutImage}
            alt="About us"
            fill
            className="object-cover"
          />
        </div>
        <div className="content">
          <div className="inner">
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-gray-800">
              Our Story
            </h2>
            <p className="text-lg leading-relaxed mb-8 text-gray-600">
              {data.description}
            </p>
            <p className="text-lg leading-relaxed mb-8 text-gray-600">
              Located in the heart of Downtown at {data.address}, we pride ourselves on creating 
              memorable dining experiences for our guests. Every dish is prepared with passion 
              and attention to detail, ensuring that each visit is special.
            </p>
            <ul className="actions">
              <li>
                <a href="#menu" className="button bg-purple-600 text-white border-purple-600 hover:bg-purple-700">
                  View Our Menu
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </section>
  );
}