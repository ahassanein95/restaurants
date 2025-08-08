# Fool W Falafel Restaurant Website

A beautiful, modern, and responsive Next.js website for Fool W Falafel restaurant, featuring authentic Middle Eastern cuisine.

## Features

- 🎨 **Modern Design**: Beautiful gradient-based design with Middle Eastern aesthetics
- 📱 **Fully Responsive**: Optimized for all devices (mobile, tablet, desktop)
- 🖼️ **Image Carousel**: Hero section with automatic image rotation
- 🍽️ **Dynamic Menu**: Categorized menu with interactive filtering
- 📧 **Contact Form**: Functional contact form with validation
- ⚡ **Fast Performance**: Optimized images and modern Next.js architecture
- 🎯 **SEO Optimized**: Complete meta tags and structured data
- 🎨 **Smooth Animations**: CSS animations and scroll-triggered effects
- 📍 **Location Integration**: Google Maps integration for directions

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: Inter (Latin) + Amiri (Arabic)
- **Images**: Next.js Image optimization
- **Icons**: Heroicons (SVG)

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── globals.css        # Global styles and custom animations
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── About.tsx          # About section with stats
│   ├── Contact.tsx        # Contact form and info
│   ├── Footer.tsx         # Footer with links and social
│   ├── Hero.tsx           # Hero section with carousel
│   ├── Menu.tsx           # Menu with category filtering
│   └── Navigation.tsx     # Responsive navigation
├── data/
│   └── restaurant.json    # Restaurant data and menu
└── types/
    └── restaurant.ts      # TypeScript interfaces
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository or download the project files
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Customization

### Updating Restaurant Data

Edit `src/data/restaurant.json` to customize:
- Restaurant name and description
- Contact information
- Menu items and categories
- Images (hero, about, gallery)

### Styling

The website uses Tailwind CSS with custom colors and animations defined in:
- `tailwind.config.ts` - Custom theme colors and animations
- `src/app/globals.css` - Custom CSS animations and global styles

### Colors

The design uses a warm Middle Eastern color palette:
- **Primary**: Amber/Orange gradients (#eab308 to #ea580c)
- **Secondary**: Blue accents for contrast
- **Accent**: Purple highlights for special elements

## Components Overview

### Hero Section
- Image carousel with smooth transitions
- Restaurant name with gradient text
- Call-to-action buttons
- Scroll indicators

### Navigation
- Smooth scrolling between sections
- Responsive mobile menu
- Transparent/solid background on scroll
- Modern hamburger menu

### About Section
- Intersection Observer animations
- Feature cards with icons
- Statistics display
- Image with decorative elements

### Menu Section
- Category-based filtering
- Interactive menu cards
- Price formatting with currency
- Responsive grid layout

### Contact Section
- Functional contact form
- Contact information cards
- Operating hours
- Google Maps integration
- Social media links

### Footer
- Quick links navigation
- Menu categories
- Contact information
- Social media icons
- Back-to-top button

## Performance Optimizations

- Next.js Image component for optimized images
- Static generation for fast loading
- Responsive image sizes
- Efficient CSS with Tailwind
- Lazy loading with Intersection Observer
- Optimized fonts with Google Fonts

## SEO Features

- Complete meta tags
- Open Graph tags for social sharing
- Twitter Card support
- Structured data for restaurants
- Semantic HTML structure
- Accessible navigation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is created for Fool W Falafel restaurant. All rights reserved.

## Support

For questions or support, please contact the development team.