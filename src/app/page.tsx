import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QuoteBanner from "@/components/QuoteBanner";
import About from "@/components/About";
import NewArrivals from "@/components/NewArrivals";
import ExclusiveCollections from "@/components/ExclusiveCollections";
import TailoredSection from "@/components/TailoredSection";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <QuoteBanner />
      <About />
      <NewArrivals />
      <ExclusiveCollections />
      <TailoredSection />
      <CTABanner />
      <Footer />
    </>
  );
}
