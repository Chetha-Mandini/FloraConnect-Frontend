import { MotionConfig } from "motion/react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import {
  HeroSection,
  QuickFeatures,
  FeaturedFlowers,
  GrowerSection,
  UpcomingEvents,
} from "../../components/home/HomeSections";

export default function HomePage() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <HeroSection />
        <QuickFeatures />
        <FeaturedFlowers />
        <GrowerSection />
        <UpcomingEvents />
      </main>
      <Footer />
    </MotionConfig>
  );
}
