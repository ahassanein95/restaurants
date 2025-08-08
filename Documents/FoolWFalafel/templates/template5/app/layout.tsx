import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bella Vista - Authentic Italian Cuisine',
  description: 'Experience the finest Italian dining with fresh ingredients and traditional recipes passed down through generations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50">
        {children}
      </body>
    </html>
  );
}