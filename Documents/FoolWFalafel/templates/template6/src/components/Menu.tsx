import { MenuCategory } from '@/types/restaurant';

interface MenuProps {
  categories: MenuCategory[];
}

const categoryIcons: { [key: string]: string } = {
  'Pizza': 'fa-pizza-slice',
  'Pasta': 'fa-utensils',
  'Main Course': 'fa-drumstick-bite',
  'Appetizer': 'fa-cheese',
  'Dessert': 'fa-ice-cream',
  'Salad': 'fa-leaf',
  'Wine': 'fa-wine-glass',
  'Coffee': 'fa-coffee',
  'Drinks': 'fa-wine-glass',
  'Seafood': 'fa-fish'
};

export default function Menu({ categories }: MenuProps) {
  return (
    <section id="menu" className="wrapper style3 fade-up">
      <div className="inner max-w-7xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-light mb-4 text-center text-white">
          Our Menu
        </h2>
        <p className="text-lg leading-relaxed mb-12 text-center text-white/80 max-w-2xl mx-auto">
          Discover our carefully crafted dishes made with the finest ingredients. 
          Each category offers a unique culinary experience that celebrates authentic flavors.
        </p>
        
        {/* Menu Categories */}
        <div className="space-y-12">
          {categories.map((category, categoryIndex) => (
            <div key={category.name} className="menu-category">
              {/* Category Header */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/20"></div>
                <div className="flex items-center px-6">
                  <span className={`icon solid major fas ${categoryIcons[category.name] || 'fa-utensils'} text-cyan-400 mr-4`}></span>
                  <h3 className="text-2xl md:text-3xl font-light text-white uppercase tracking-wider">
                    {category.name}
                  </h3>
                </div>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/20"></div>
              </div>
              
              {/* Menu Items Grid */}
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                {category.items.map((item, itemIndex) => (
                  <div 
                    key={item.id} 
                    className="menu-item group hover:bg-white/5 p-4 rounded-lg transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors duration-300 flex-1 pr-4">
                        {item.name}
                      </h4>
                      <div className="flex items-center">
                        <div className="w-16 h-px bg-gradient-to-r from-white/30 to-cyan-400/50 mx-3"></div>
                        <span className="text-xl font-light text-cyan-400 whitespace-nowrap">
                          ${item.price}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Category Separator - not on last category */}
              {categoryIndex < categories.length - 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}