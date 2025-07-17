# Restaurant Website Template

A modern, responsive restaurant website template built with Next.js 14, TypeScript, and Tailwind CSS. This template is designed to be easily customizable for any restaurant, allowing you to update the content with your restaurant's information.

## Features

✨ **Modern Design**: Clean, professional layout with responsive design  
🍽️ **Dynamic Menu**: Categorized menu with search and filter functionality  
📸 **Photo Gallery**: Organized gallery with lightbox functionality  
📱 **Mobile Responsive**: Optimized for all device sizes  
🔍 **SEO Optimized**: Built-in SEO best practices and metadata  
⚡ **Fast Performance**: Optimized images and loading  
🎨 **Easy Customization**: Simple configuration files for restaurant data  
📞 **Contact Features**: Contact forms and reservation system  
🌐 **Accessibility**: WCAG compliant design  

## Pages Included

- **Homepage**: Hero section, featured menu, about preview, testimonials
- **Menu**: Searchable and filterable menu with categories
- **Gallery**: Photo gallery with category filters and lightbox
- **About**: Restaurant story, values, and chef information
- **Contact**: Contact form, location, and hours
- **Reservations**: Online reservation request form

## Quick Start

1. **Clone and Install**
   ```bash
   git clone [repository-url]
   cd restaurant-template
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Visit [http://localhost:3000](http://localhost:3000)

## Customization Guide

### 1. Restaurant Information

Edit `src/data/restaurant.ts` to update your restaurant's basic information:

```typescript
export const restaurantData: Restaurant = {
  name: "Your Restaurant Name",
  tagline: "Your tagline here",
  description: "Your restaurant description",
  contact: {
    phone: "Your phone number",
    email: "your@email.com",
    address: {
      street: "Your address",
      city: "Your city",
      // ... more fields
    }
  },
  // ... more configuration
}
```

### 2. Menu Items

Update your menu in `src/data/menu.ts`:

```typescript
export const menuData: MenuCategory[] = [
  {
    id: "appetizers",
    name: "Appetizers",
    description: "Start your meal with these delicious options",
    order: 1,
    items: [
      {
        id: "item-1",
        name: "Your Dish Name",
        description: "Dish description",
        price: 12.99,
        category: "appetizers",
        image: "/images/food/your-dish.jpg",
        // ... more fields
      }
    ]
  }
]
```

### 3. Gallery Images

Add your images to `src/data/gallery.ts`:

```typescript
export const galleryData: GalleryImage[] = [
  {
    id: "image-1",
    src: "/images/gallery/your-image.jpg",
    alt: "Description of your image",
    category: "food", // food, restaurant, events, staff
    featured: true // optional
  }
]
```

### 4. Add Your Images

Place your images in the `public/images/` directory:

```
public/images/
├── food/           # Menu item images
├── gallery/        # Gallery images
├── restaurant/     # Restaurant interior/exterior
├── hero-bg.jpg     # Homepage hero background
├── og-image.jpg    # Social media preview image
└── logo.png        # Your restaurant logo
```

### 5. Styling and Branding

Update colors and branding in `src/data/restaurant.ts`:

```typescript
branding: {
  primaryColor: "#8B4513",    // Your primary color
  secondaryColor: "#D2691E",  // Your secondary color
  logo: "/images/logo.png",   // Your logo path
  favicon: "/favicon.ico"     // Your favicon
}
```

For more extensive styling changes, edit the Tailwind CSS classes in the components or modify `src/app/globals.css`.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── about/
│   ├── contact/
│   ├── gallery/
│   ├── menu/
│   ├── reservations/
│   ├── layout.tsx       # Main layout with header/footer
│   └── page.tsx         # Homepage
├── components/          # Reusable React components
│   ├── ui/              # UI components (Button, etc.)
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── data/                # Restaurant configuration files
│   ├── restaurant.ts    # Main restaurant info
│   ├── menu.ts          # Menu items
│   ├── gallery.ts       # Gallery images
│   └── testimonials.ts  # Customer testimonials
├── lib/                 # Utility functions
└── types/               # TypeScript type definitions
```

## Built With

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React](https://reactjs.org/)** - UI library
- **[Next.js Image](https://nextjs.org/docs/api-reference/next/image)** - Optimized images

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

This template can be deployed on any platform that supports Next.js:

- **Vercel** (recommended): Connect your Git repository for automatic deployments
- **Netlify**: Build command: `npm run build`, publish directory: `.next`
- **Any hosting provider**: Build with `npm run build` and serve the `.next` folder

## SEO Features

- Automatic sitemap generation
- Open Graph meta tags
- Twitter Card support
- Structured data for restaurants
- Semantic HTML structure
- Optimized images with alt tags

## Customization Tips

1. **Colors**: Search for color classes like `text-orange-600` and `bg-orange-600` to change the color scheme
2. **Fonts**: Update the font import in `src/app/layout.tsx`
3. **Content**: All text content is easily editable in the data files
4. **Forms**: Contact and reservation forms can be connected to your preferred backend service
5. **Analytics**: Add Google Analytics or other tracking in `src/app/layout.tsx`

## Support

For questions or issues with this template, please check the documentation or create an issue in the repository.

## License

This project is open source and available under the [MIT License](LICENSE).