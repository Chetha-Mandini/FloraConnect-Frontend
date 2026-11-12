import ShimmerImage from "../ui/ShimmerImage";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  features,
  featuredCategories,
  eventPreviews,
  heroMessages,
} from "../../pages/home/home.data";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Sprout } from "lucide-react";
import EventPreviewCard from "../ui/EventPreviewCard";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <p className="section-label">
        {label}
        <span />
      </p>
      <h2>{title}</h2>
      <p className="section-description">{children}</p>
    </>
  );
}

export function HeroSection() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    if (reduced || !playing || hovered) return;
    const timer = window.setInterval(
      () => setActive((index) => (index + 1) % heroMessages.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, [reduced, playing, hovered]);
  return (
    <section
      className="hero"
      aria-labelledby="hero-title"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setPlaying(false)}
    >
      <div className="hero-inner container">
        <div className="hero-copy">
          <div>
            <p className="community-badge">
              <Sprout size={19} /> Sri Lanka&apos;s Flower Community
            </p>
            <h1 id="hero-title">FloraConnect</h1>
          </div>
          <div
            className="hero-messages"
            aria-live={playing && !reduced ? "off" : "polite"}
            aria-atomic="true"
          >
            {heroMessages.map((message, index) => (
              <motion.div
                key={message.title}
                className="hero-message"
                aria-hidden={index !== active}
                initial={false}
                animate={{
                  opacity: index === active ? 1 : 0,
                  y: reduced || index === active ? 0 : 8,
                }}
                transition={{ duration: reduced ? 0 : 0.35, ease: "easeOut" }}
              >
                <p className="hero-subtitle">{message.title}</p>
                <p className="hero-description">{message.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="hero-actions">
            <Reveal delay={0.2}>
              <Link className="button primary" to="/flowers">
                Explore Catalogue <ArrowRight size={17} />
              </Link>
            </Reveal>
            <Reveal delay={0.28}>
              <Link className="button outline" to="/register">
                Join Our Community
              </Link>
            </Reveal>
          </div>
          <div
            className="hero-flourish"
            role="group"
            aria-label="Hero message controls"
          >
            {heroMessages.map((message, index) => (
              <button
                key={message.title}
                type="button"
                className="hero-dot"
                aria-label={`Show message ${index + 1}: ${message.title}`}
                aria-pressed={active === index}
                onClick={() => {
                  setActive(index);
                  setPlaying(false);
                }}
              >
                <span />
              </button>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-shape">
            <img
              src="/images/national-flower-hero-1448.webp"
              srcSet="/images/national-flower-hero-768.webp 768w, /images/national-flower-hero-1448.webp 1448w"
              sizes="(max-width: 767px) 100vw, 60vw"
              loading="eager"
              decoding="async"
              alt="Three blue-violet Nymphaea nouchali water lilies with golden centers, framed by soft sage curves and green botanical leaves"
              width="1448"
              height="1086"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function QuickFeatures() {
  return (
    <section
      className="quick-features container"
      aria-label="Explore the community"
    >
      {features.map(({ title, to, Icon }, i) => (
        <Reveal key={to} delay={i * 0.06}>
          <Link className="feature-card" to={to}>
            <Icon size={34} strokeWidth={1.4} />
            <span>{title}</span>
            <ArrowRight className="feature-arrow" size={16} />
          </Link>
        </Reveal>
      ))}
    </section>
  );
}

export function FeaturedFlowers() {
  return (
    <section
      className="featured-section container"
      aria-label="Featured flowers"
    >
      <Reveal className="featured-intro">
        <SectionHeading
          label="FEATURED FLOWERS"
          title="Explore Sri Lanka’s Beautiful Blooms"
        >
          Discover a wide variety of flowers from local growers.
        </SectionHeading>
        <Link className="button primary" to="/flowers">
          View Catalogue <ArrowRight size={16} />
        </Link>
      </Reveal>
      <div className="featured-grid">
        {featuredCategories.map((flower, i) => (
          <Reveal key={flower.name} delay={i * 0.07}>
            <Link
              className="flower-card"
              to={`/flowers?category=${flower.category}`}
            >
              <div className="flower-image">
                <ShimmerImage
                  src={`/images/${flower.image}`}
                  alt={flower.name}
                  width="360"
                  height="420"
                  loading="lazy"
                />
              </div>
              <span className="flower-card-info">
                <strong>{flower.name}</strong>
                <span className="round-arrow">
                  <ArrowRight size={16} />
                </span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function GrowerSection() {
  return (
    <section className="grower-section" aria-label="For our growers">
      <div className="grower-inner container">
        <Reveal className="grower-photos">
          <img
            className="grower-main-image"
            src="/images/floraconnect-hero.png"
            alt="Illustration of a flower grower tending blooms in Sri Lanka’s hill country"
            width="600"
            height="450"
            loading="lazy"
          />
          <img
            className="grower-detail-image"
            src="/images/flowers.jpg"
            alt="A colorful collection of freshly grown flowers"
            width="260"
            height="220"
            loading="lazy"
          />
        </Reveal>
        <Reveal className="grower-copy">
          <SectionHeading label="FOR OUR GROWERS" title="Showcase Your Farm">
            Reach more buyers and grow your business with FloraConnect.
          </SectionHeading>
          <Link className="button primary" to="/register?application=grower">
            Join as a Grower <ArrowRight size={17} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function UpcomingEvents() {
  return (
    <section className="events-section container" aria-label="Upcoming events">
      <Reveal>
        <SectionHeading
          label="UPCOMING EVENTS"
          title="Be a Part of Our Community"
        >
          Join upcoming events and learn from industry experts.
        </SectionHeading>
        <Link className="button primary" to="/events">
          View All Events <ArrowRight size={16} />
        </Link>
      </Reveal>
      <div className="events-cards">
        <div className="events-grid">
          {eventPreviews.map((event, index) => (
            <Reveal key={event.title} delay={index * 0.08}>
              <EventPreviewCard {...event} />
            </Reveal>
          ))}
        </div>
        <p className="events-publication-note" role="status">
          Explore our community event categories. No upcoming events have been
          published yet.
        </p>
      </div>
    </section>
  );
}
