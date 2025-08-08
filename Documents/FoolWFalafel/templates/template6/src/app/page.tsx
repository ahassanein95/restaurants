import Hero from '@/components/Hero';
import About from '@/components/About';
import MenuSpotlight from '@/components/MenuSpotlight';
import Menu from '@/components/Menu';
import Contact from '@/components/Contact';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';
import { getRestaurantData, getMenuCategories, getFeaturedItems } from '@/lib/data';

export default function Home() {
  const restaurantData = getRestaurantData();
  const menuCategories = getMenuCategories();
  const featuredItems = getFeaturedItems(3);

  return (
    <>
      <Sidebar />
      <MobileNav />
      
      <div id="wrapper">
        <Hero data={restaurantData} />
        {/* <About data={restaurantData} /> */}
        {/* <MenuSpotlight items={featuredItems} /> */}
        <Menu categories={menuCategories} />
      </div>
      
      <Footer />
    </>
  );
}