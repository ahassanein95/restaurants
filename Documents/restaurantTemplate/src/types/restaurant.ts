export interface Restaurant {
  name: string;
  tagline: string;
  description: string;
  contact: Contact;
  hours: Hours;
  social: Social;
  branding: Branding;
}

export interface Contact {
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Hours {
  [key: string]: {
    open: string;
    close: string;
    closed?: boolean;
  };
}

export interface Social {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  yelp?: string;
}

export interface Branding {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  favicon?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  dietary: DietaryInfo[];
  featured?: boolean;
  popular?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
  order: number;
}

export interface DietaryInfo {
  type: 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'nut-free' | 'spicy';
  level?: 1 | 2 | 3; // For spicy level
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: 'food' | 'restaurant' | 'events' | 'staff';
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
  source?: 'google' | 'yelp' | 'facebook' | 'internal';
}