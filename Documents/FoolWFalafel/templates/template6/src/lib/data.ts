import { RestaurantData, MenuCategory } from '@/types/restaurant';
import restaurantData from '@/data/restaurant.json';

export function getRestaurantData(): RestaurantData {
  return restaurantData as RestaurantData;
}

export function getMenuCategories(): MenuCategory[] {
  const data = getRestaurantData();
  const categoriesMap = new Map<string, MenuCategory>();
  
  data.menu.forEach(item => {
    if (!categoriesMap.has(item.category)) {
      categoriesMap.set(item.category, {
        name: item.category,
        items: []
      });
    }
    categoriesMap.get(item.category)!.items.push(item);
  });
  
  return Array.from(categoriesMap.values());
}

export function getFeaturedItems(count: number = 3) {
  const data = getRestaurantData();
  return data.menu.slice(0, count);
}