import Header from '@/components/Header'
import Hero from '@/components/Hero'
import CategoryGrid from '@/components/CategoryGrid'
import FeaturedProducts from '@/components/FeaturedProducts'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <Footer />
    </div>
  )
}
