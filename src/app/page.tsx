import ChooseUs from "@/components/ChooseUs";
import FeaturedSection from "@/components/FeaturedSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Instructor from "@/components/Instructor";
import MovingCards from "@/components/MovingCards";
import UpcomingWebinars from "@/components/UpcomingWebinars";


export default function Home() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.04]">
      <HeroSection/>
      <FeaturedSection/>
      <ChooseUs/>
      <MovingCards/>
      <UpcomingWebinars/>
      <Instructor/>
      <Footer/>
    </main>
  );
}
