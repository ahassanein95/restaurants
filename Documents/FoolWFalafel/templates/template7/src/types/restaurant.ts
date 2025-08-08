export interface MenuItem {
  item: string;
  price: number;
  currency: string;
}

export interface MenuCategories {
  [categoryName: string]: MenuItem[];
}

export interface RestaurantData {
  name: string;
  description: string;
  phone: string;
  address: string;
  email: string;
  website: string;
  heroImage: string;
  heroImages: string[];
  aboutImage: string;
  fullScreenImages: string[];
  menu_categories: MenuCategories;
}

export interface NavigationProps {
  restaurantName: string;
}

export interface HeroProps {
  heroImages: string[];
  restaurantName: string;
  description: string;
}

export interface MenuProps {
  menuCategories: MenuCategories;
}

export interface ContactProps {
  phone: string;
  address: string;
  email: string;
}

export interface AboutProps {
  description: string;
  aboutImage: string;
  restaurantName: string;
}