# Restaurant Template Project

## Project Overview
A Next.js restaurant website template with TypeScript and Tailwind CSS. Data-driven architecture using JSON files for easy customization.

## Development Commands
```bash
# Start development server
npm run dev

# Build for production (always test before deploying)
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Project Structure
- `app/` - Next.js app directory with pages and layout
- `components/` - React components
  - `Header.tsx` - Restaurant header with Bebas Neue font
  - `HeroSection.tsx` - Adjectives and image section
- `data/` - JSON data files
  - `restaurant.json` - Restaurant information and content
- `public/` - Static assets
- `tailwind.config.ts` - Tailwind configuration with custom fonts

## Key Features
- **Responsive Design**: Mobile-first approach
- **Data-Driven**: Easy to customize via JSON files
- **Typography**: Bebas Neue font for headers
- **Styling**: Warm amber/brown color scheme
- **Components**: Modular React components

## Customization
Edit `data/restaurant.json` to change:
- Restaurant name and tagline
- Adjectives describing the restaurant
- Contact information
- Hours of operation
- Hero image path

## Font Setup
Bebas Neue font is loaded via Google Fonts in `app/globals.css` and configured in Tailwind config.