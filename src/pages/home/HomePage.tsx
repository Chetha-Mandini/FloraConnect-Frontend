import { MotionConfig } from "motion/react";
import {
  HeroSection,
  QuickFeatures,
  FeaturedFlowers,
  ExploreAssociations,
  LatestAnnouncements,
  HowItWorks,
  GrowerSection,
  UpcomingEvents,
} from "../../components/home/HomeSections";

export default function HomePage() {
  return (
    <MotionConfig reducedMotion="user">
      <main id="main">
        <HeroSection />
        <QuickFeatures />
        <FeaturedFlowers />
        <ExploreAssociations />
        <LatestAnnouncements />
        <HowItWorks />
        <GrowerSection />
        <UpcomingEvents />
      </main>
    </MotionConfig>
  );
}
