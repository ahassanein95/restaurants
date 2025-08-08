import Image from 'next/image';
import { RestaurantData } from '@/types/restaurant';

interface HeroProps {
  data: RestaurantData;
}

export default function Hero({ data }: HeroProps) {
  return (
    <section id="intro" className="wrapper style1 fullscreen fade-up relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src={data.heroImage}
          alt={data.name}
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>
      <div className="inner relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-light mb-6 text-white">
          {data.name}
        </h1>
        <p className="text-lg md:text-xl leading-relaxed mb-8 text-white/80 max-w-2xl mx-auto">
          {data.description}
        </p>
      </div>
    </section>
  );
}