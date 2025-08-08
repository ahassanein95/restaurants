import React from 'react';
import restaurantData from '@/data/restaurant.json';

const Header: React.FC = () => {
  return (
    <header className="bg-white py-6 px-4 shadow-sm">
      <div className="max-w-6xl mx-auto text-center">
        <h1 
          className="text-5xl md:text-6xl text-gray-900 mb-2"
          style={{fontFamily: 'var(--font-family-bebas)'}}
        >
          {restaurantData.name}
        </h1>
        <p className="text-lg text-gray-600">
          {restaurantData.tagline}
        </p>
      </div>
    </header>
  );
};

export default Header;