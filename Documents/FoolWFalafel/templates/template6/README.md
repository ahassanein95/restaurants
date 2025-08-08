# Restaurant Template

A beautiful, responsive restaurant website template built with Next.js, TypeScript, and Tailwind CSS, using the HTML5 UP Hyperspace design.

## Features

- **Data-driven**: All content is managed through a single JSON file
- **Responsive design**: Works perfectly on desktop, tablet, and mobile
- **Modern tech stack**: Next.js 15, TypeScript, Tailwind CSS
- **Beautiful animations**: Smooth scrolling and fade-in effects
- **Image optimization**: Automatic image optimization with Next.js
- **SEO friendly**: Proper meta tags and semantic HTML

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**: Visit `http://localhost:3000`

## Customization

### Update Restaurant Information

Edit `src/data/restaurant.json` to customize your restaurant:

```json
{
  "name": "Your Restaurant Name",
  "description": "Your restaurant description...",
  "phone": "(555) 123-4567",
  "address": "123 Your Street, City, State 12345",
  "email": "info@yourrestaurant.com",
  "website": "www.yourrestaurant.com",
  "heroImage": "https://your-hero-image-url.jpg",
  "aboutImage": "https://your-about-image-url.jpg",
  "menu": [
    {
      "id": "1",
      "name": "Dish Name",
      "description": "Dish description...",
      "price": 25,
      "category": "Main Course",
      "image": "https://dish-image-url.jpg"
    }
  ],
  "gallery": [
    "https://gallery-image-1.jpg",
    "https://gallery-image-2.jpg"
  ]
}
```

### Menu Categories

The template automatically organizes menu items by category. Supported categories include:
- Pizza
- Pasta
- Main Course
- Appetizer
- Dessert
- Salad
- Drinks
- Seafood

### Images

- Use high-quality images (recommended: 1920x1080 for hero/about images)
- Images are automatically optimized by Next.js
- Supports any image URL (Unsplash, your own hosting, etc.)

### Colors and Styling

The template uses a purple/cyan color scheme. To customize:

1. Edit `src/app/globals.css` for global styles
2. Modify Tailwind classes in components for specific styling
3. Update the color scheme variables in the CSS

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── Hero.tsx            # Hero section
│   ├── About.tsx           # About section
│   ├── MenuSpotlight.tsx   # Featured dishes
│   ├── Menu.tsx            # Full menu
│   ├── Contact.tsx         # Contact section
│   ├── Sidebar.tsx         # Navigation sidebar
│   └── Footer.tsx          # Footer
├── data/
│   └── restaurant.json     # Restaurant data
├── lib/
│   └── data.ts            # Data utilities
└── types/
    └── restaurant.ts       # TypeScript types
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

## License

This template uses the HTML5 UP Hyperspace design, which is free for personal and commercial use under the CCA 3.0 license.

## Credits

- Design: [HTML5 UP](http://html5up.net)
- Built with: [Next.js](https://nextjs.org)
- Icons: [Font Awesome](https://fontawesome.com)
- Images: [Unsplash](https://unsplash.com)