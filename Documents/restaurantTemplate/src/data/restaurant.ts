import { Restaurant } from '@/types/restaurant';

export const restaurantData: Restaurant = {
  name: "Bella Vista",
  tagline: "Authentic Italian Cuisine in the Heart of the City",
  description: "Experience the finest Italian flavors with our traditional recipes passed down through generations. Our chefs use only the freshest ingredients to create memorable dining experiences.",
  contact: {
    phone: "(555) 123-4567",
    email: "info@bellavista.com",
    address: {
      street: "123 Main Street",
      city: "Downtown",
      state: "CA",
      zipCode: "90210",
      country: "USA"
    },
    coordinates: {
      lat: 34.0522,
      lng: -118.2437
    }
  },
  hours: {
    monday: { open: "11:00", close: "22:00" },
    tuesday: { open: "11:00", close: "22:00" },
    wednesday: { open: "11:00", close: "22:00" },
    thursday: { open: "11:00", close: "22:00" },
    friday: { open: "11:00", close: "23:00" },
    saturday: { open: "10:00", close: "23:00" },
    sunday: { open: "10:00", close: "21:00" }
  },
  social: {
    facebook: "https://facebook.com/bellavista",
    instagram: "https://instagram.com/bellavista",
    twitter: "https://twitter.com/bellavista",
    yelp: "https://yelp.com/biz/bellavista"
  },
  branding: {
    primaryColor: "#8B4513",
    secondaryColor: "#D2691E",
    logo: "/images/logo.png",
    favicon: "/favicon.ico"
  }
};