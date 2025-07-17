import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function getDayName(day: string): string {
  const days: { [key: string]: string } = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };
  return days[day.toLowerCase()] || day;
}

export function getDietaryIcon(type: string): string {
  const icons: { [key: string]: string } = {
    vegetarian: '🥬',
    vegan: '🌱',
    'gluten-free': '🌾',
    'dairy-free': '🥛',
    'nut-free': '🥜',
    spicy: '🌶️'
  };
  return icons[type] || '';
}

export function getSpicyLevel(level?: number): string {
  if (!level) return '';
  return '🌶️'.repeat(level);
}