import { RestaurantData } from '@/types/restaurant'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Menu from '@/components/Menu'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import restaurantData from '@/data/restaurant.json'

export default function Home() {
  const data: RestaurantData = restaurantData as RestaurantData

  return (
    <main className="min-h-screen">
      <Navigation restaurantName={data.name} />
      <Hero 
        heroImages={data.heroImages}
        restaurantName={data.name}
        description={data.description}
      />
      <Menu menuCategories={data.menu_categories} />
      <Contact 
        phone={data.phone}
        address={data.address}
        email={data.email}
      />
      <Footer restaurantName={data.name} />
    </main>
  )
}