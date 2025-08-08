import React from 'react';
import restaurantData from '@/data/restaurant.json';

const Menu: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-stone-50">
      <div className="max-w-4xl mx-auto">
        
        {/* Menu Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl text-slate-800 mb-6"
            style={{fontFamily: 'var(--font-family-bebas)'}}
          >
            Menu
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {restaurantData.description}
          </p>
        </div>

        {/* Menu Categories */}
        <div className="space-y-16">
          
          {/* Burgers */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-semibold text-slate-800 mb-8 border-b border-slate-200 pb-3">
              Burgers
            </h3>
            <div className="space-y-6">
              {restaurantData.menu.burgers.map((item, index) => (
                <div key={index} className="mb-6">
                  <div className="flex items-baseline justify-between mb-1">
                    <h4 className="text-lg font-medium text-slate-900">{item.name}</h4>
                    <span className="text-lg font-semibold text-slate-800">{item.price}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="w-8"></div>
                    <div className="flex space-x-2 flex-grow">
                      {Array.from({ length: 40 }, (_, i) => (
                        <div key={i} className="w-1 h-1 bg-red-600 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sides */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-semibold text-slate-800 mb-8 border-b border-slate-200 pb-3">
              Sides
            </h3>
            <div className="space-y-6">
              {restaurantData.menu.sides.map((item, index) => (
                <div key={index} className="mb-6">
                  <div className="flex items-baseline justify-between mb-1">
                    <h4 className="text-lg font-medium text-slate-900">{item.name}</h4>
                    <span className="text-lg font-semibold text-slate-800">{item.price}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="w-8"></div>
                    <div className="flex space-x-2 flex-grow">
                      {Array.from({ length: 40 }, (_, i) => (
                        <div key={i} className="w-1 h-1 bg-red-600 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Drinks */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-semibold text-slate-800 mb-8 border-b border-slate-200 pb-3">
              Beverages
            </h3>
            <div className="space-y-6">
              {restaurantData.menu.drinks.map((item, index) => (
                <div key={index} className="mb-6">
                  <div className="flex items-baseline justify-between mb-1">
                    <h4 className="text-lg font-medium text-slate-900">{item.name}</h4>
                    <span className="text-lg font-semibold text-slate-800">{item.price}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="w-8"></div>
                    <div className="flex space-x-2 flex-grow">
                      {Array.from({ length: 40 }, (_, i) => (
                        <div key={i} className="w-1 h-1 bg-red-600 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Contact Info */}
        <div className="text-center mt-16 pt-8 border-t border-slate-200">
          <p className="text-slate-600 mb-2">{restaurantData.contact.address}</p>
          <p className="text-slate-600">{restaurantData.contact.phone}</p>
        </div>

      </div>
    </section>
  );
};

export default Menu;