import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { restaurantData } from "@/data/restaurant";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: `${restaurantData.name} - ${restaurantData.tagline}`,
  description: restaurantData.description,
  keywords: ["restaurant", "italian", "dining", "food", "pizza", "pasta"],
  authors: [{ name: restaurantData.name }],
  creator: restaurantData.name,
  publisher: restaurantData.name,
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourrestaurant.com",
    siteName: restaurantData.name,
    title: `${restaurantData.name} - ${restaurantData.tagline}`,
    description: restaurantData.description,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${restaurantData.name} Restaurant`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${restaurantData.name} - ${restaurantData.tagline}`,
    description: restaurantData.description,
    images: ["/images/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
