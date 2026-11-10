import { useState } from "react";
import type { FormEvent } from "react";
import { Link, NavLink } from "react-router-dom";
import ApiStatus from "../../features/health/ApiStatus";
import Icon from "../../components/ui/Icon";
import Brand from "../../components/layout/Brand";
import Modal from "../../components/ui/Modal";
import { flowers } from "../../features/flowers/data/flowers";
import type { Flower } from "../../features/flowers/data/flowers";
import { features } from "./home.data";

type Panel =
  | "join"
  | "login"
  | "associations"
  | "marketplace"
  | "events"
  | "notices"
  | "about"
  | "credits"
  | null;
export default function HomePage() {
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All flowers");
  const [expanded, setExpanded] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [selected, setSelected] = useState<Flower | null>(null);
  const visible = flowers.filter(
    (f) =>
      `${f.name} ${f.scientific} ${f.category}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()) &&
      (category === "All flowers" || f.category === category),
  );
  function openPanel(value: Panel) {
    setMenu(false);
    setPanel(value);
  }
  function search(e: FormEvent) {
    e.preventDefault();
    setExpanded(true);
    setCategory("All flowers");
    document.getElementById("flowers")?.scrollIntoView({ behavior: "smooth" });
  }
  const close = () => {
    setPanel(null);
    setSelected(null);
  };
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Brand />
          <nav
            className={menu ? "main-nav is-open" : "main-nav"}
            aria-label="Main navigation"
          >
            <NavLink to="/" onClick={() => setMenu(false)}>
              Home
            </NavLink>
            <NavLink to="/flowers" onClick={() => setMenu(false)}>
              Explore Flowers
            </NavLink>
            <NavLink to="/associations" onClick={() => setMenu(false)}>
              Associations
            </NavLink>
            <NavLink to="/announcements" onClick={() => setMenu(false)}>
              Announcements
            </NavLink>
            <button onClick={() => openPanel("marketplace")}>
              Marketplace
            </button>
            <button onClick={() => openPanel("events")}>Events</button>
            <button onClick={() => openPanel("about")}>About</button>
          </nav>
          <form className="header-search" role="search" onSubmit={search}>
            <Icon name="search" />
            <input
              aria-label="Search flowers"
              placeholder="Search flowers and varieties…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          <div className="header-actions">
            <Link className="button outline login-button" to="/login">
              Login
            </Link>
            <Link className="button primary" to="/register">
              Get Started
            </Link>
            <button
              className="icon-button mobile-toggle"
              aria-label={menu ? "Close navigation" : "Open navigation"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              <Icon name={menu ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <img
            className="hero-background"
            src="/images/floraconnect-hero.png"
            alt="Sri Lankan flower grower tending colorful blooms in the misty hill country"
            fetchPriority="high"
          />
          <div className="hero-wash" />
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">
                PEOPLE <span>•</span> FLOWERS <span>•</span> OPPORTUNITIES
              </p>
              <h1 id="hero-title">
                Connecting
                <br />
                <em>Sri Lanka’s</em>
                <br />
                <span className="headline-last">Flower Community.</span>
              </h1>
              <p className="hero-description">
                FloraConnect brings together flower growers, associations,
                buyers and enthusiasts — creating new opportunities for a
                brighter, more connected floriculture industry.
              </p>
              <div className="hero-actions">
                <button
                  className="button primary"
                  onClick={() => openPanel("join")}
                >
                  Join the Community <Icon name="arrow" />
                </button>
                <a className="button outline" href="#flowers">
                  <Icon name="flower" />
                  Explore Flowers
                </a>
              </div>
              <div className="community-proof">
                <div className="community-emblem" aria-hidden="true">
                  <Icon name="people" />
                </div>
                <div>
                  <p>
                    <strong>Local growers</strong>
                    <span>•</span>
                    <strong>Shared possibilities</strong>
                  </p>
                  <small>Growing a more prosperous Sri Lanka, together.</small>
                </div>
              </div>
            </div>
            <p className="handwritten hero-note">
              Flowers
              <br />
              &nbsp; People
              <br />
              &nbsp;&nbsp; Prosperity <span>❧</span>
            </p>
            <aside className="hero-rail" aria-label="Community highlights">
              <button
                className="opportunity-card"
                onClick={() => openPanel("marketplace")}
              >
                <img src="/images/flowers.jpg" alt="Pink and white flowers" />
                <span>
                  Local Flowers<small>Global Possibilities</small>
                  <span className="round-arrow">
                    <Icon name="arrow" />
                  </span>
                </span>
              </button>
              <button
                className="quick-card"
                onClick={() => openPanel("notices")}
              >
                <span className="feature-icon">
                  <Icon name="building" />
                </span>
                <span>
                  <strong>
                    Government
                    <br />
                    Notice References
                  </strong>
                  <small>
                    A place for verified sources and industry opportunities.
                  </small>
                </span>
                <span className="quick-arrow">›</span>
              </button>
              <button
                className="quick-card"
                onClick={() => openPanel("events")}
              >
                <span className="feature-icon">
                  <Icon name="calendar" />
                </span>
                <span>
                  <strong>Upcoming Events</strong>
                  <small>
                    Exhibitions, workshops
                    <br />
                    and association meetings.
                  </small>
                </span>
                <span className="quick-arrow">›</span>
              </button>
            </aside>
            <p className="handwritten soil-note">
              From
              <br />
              Our Soil
              <br />
              to Brighter
              <br />
              Tomorrows <span>❧</span>
            </p>
          </div>
        </section>
        <section className="benefits" aria-label="Why FloraConnect">
          <div className="benefits-inner">
            {features.map((f) => (
              <div className="benefit" key={f.title}>
                <span className="feature-icon">
                  <Icon name={f.icon} />
                </span>
                <div>
                  <h2>
                    {f.title}
                    <br />
                    {f.subtitle}
                  </h2>
                  <p>{f.description}</p>
                </div>
              </div>
            ))}
            <blockquote>
              “A stronger flower industry
              <br />
              for a more beautiful Sri Lanka.”<span aria-hidden="true">❧</span>
            </blockquote>
          </div>
        </section>
        <section
          className="discovery"
          id="flowers"
          aria-labelledby="flowers-title"
        >
          <div className="discovery-inner">
            <div className="flower-catalogue">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">DISCOVER</p>
                  <h2 id="flowers-title">Sri Lanka’s Beautiful Flowers</h2>
                  <span className="pink-rule" />
                </div>
                <button
                  className="button outline view-all"
                  onClick={() => setExpanded(!expanded)}
                  aria-expanded={expanded}
                  aria-controls="catalogue-filters"
                >
                  {expanded ? "Hide Filters" : "View All Flowers"}
                  <Icon name="arrow" />
                </button>
              </div>
              <p className="section-description">
                Explore a diverse range of flowers loved by our growing
                community.
              </p>
              {expanded && (
                <div className="catalogue-filters" id="catalogue-filters">
                  <label className="catalogue-search">
                    <Icon name="search" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Find a flower…"
                      aria-label="Filter flowers by name"
                    />
                  </label>
                  <div
                    className="filter-options"
                    aria-label="Flower categories"
                  >
                    {[
                      "All flowers",
                      "Aquatic",
                      "Tropical",
                      "Orchids",
                      "Cut flowers",
                    ].map((c) => (
                      <button
                        key={c}
                        aria-pressed={category === c}
                        className={category === c ? "selected" : ""}
                        onClick={() => setCategory(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flower-grid" aria-live="polite">
                {visible.map((f) => (
                  <button
                    className="flower-card"
                    key={f.name}
                    onClick={() => setSelected(f)}
                    aria-label={`Explore ${f.name}`}
                  >
                    <img
                      src={`/images/${f.image}.jpg`}
                      alt={f.name}
                      loading="lazy"
                    />
                    <span className="flower-card-info">
                      <span>
                        <strong>{f.name}</strong>
                        <small>{f.scientific}</small>
                      </span>
                      <span className="round-arrow">
                        <Icon name="arrow" />
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              {visible.length === 0 && (
                <div className="empty-state">
                  <Icon name="flower" />
                  <h3>No flowers found</h3>
                  <p>Try a different name or clear your filters.</p>
                  <button
                    className="button outline"
                    onClick={() => {
                      setQuery("");
                      setCategory("All flowers");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
            <aside className="association-card">
              <img
                src="/images/water-lily.jpg"
                alt="Water lily in bloom"
                loading="lazy"
              />
              <div className="association-overlay" />
              <svg
                className="island-art"
                viewBox="0 0 120 210"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m41 7 9 5-5 10 10 13 4 18 13 13 9 20 3 17 16 22 9 24-3 20-12 19-21 13-20-3-16-12-8-23 3-24-4-18-9-18 2-20 4-19 1-23-6-14 7-2Z"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                {[
                  [45, 28],
                  [54, 54],
                  [60, 78],
                  [72, 98],
                  [53, 115],
                  [81, 128],
                  [41, 141],
                  [67, 154],
                  [89, 164],
                  [58, 177],
                  [76, 187],
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="2" fill="currentColor" />
                ))}
              </svg>
              <p className="map-caption">
                ROOTED ACROSS
                <br />
                SRI LANKA
              </p>
              <div className="association-copy">
                <p className="eyebrow">CONNECTED BY NATURE</p>
                <h2>
                  A Nation United
                  <br />
                  by Flowers
                </h2>
                <p>
                  Empowering growers through connection, knowledge and
                  opportunity.
                </p>
                <button
                  className="button light"
                  onClick={() => openPanel("associations")}
                >
                  Our Associations
                  <Icon name="arrow" />
                </button>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div>
          <p>© 2026 TourGo organization. All rights reserved.</p>
          <button onClick={() => openPanel("credits")}>Image credits</button>
        </div>
        <ApiStatus />
      </footer>
      {(panel || selected) && (
        <Modal
          title={
            selected
              ? selected.name
              : panel === "join"
                ? "Let’s grow together"
                : panel === "login"
                  ? "Welcome back"
                  : panel === "associations"
                    ? "Rooted in community"
                    : panel === "marketplace"
                      ? "New opportunities, naturally"
                      : panel === "events"
                        ? "Gather. Learn. Grow."
                        : panel === "notices"
                          ? "Official-source notice references"
                          : panel === "credits"
                            ? "Image credits"
                            : "A community in bloom"
          }
          onClose={close}
        >
          {selected ? (
            <div className="flower-detail">
              <img src={`/images/${selected.image}.jpg`} alt={selected.name} />
              <p className="detail-category">
                {selected.category} · {selected.scientific}
              </p>
              <p>{selected.detail}</p>
              <div className="info-note">
                Flower inspiration, not a live seller listing. Grower listings
                and inquiries are coming soon.
              </div>
              <button
                className="button primary"
                onClick={() => {
                  setSelected(null);
                  openPanel("join");
                }}
              >
                Explore the community
                <Icon name="arrow" />
              </button>
            </div>
          ) : panel === "join" || panel === "login" ? (
            <div className="account-preview">
              <p>
                {panel === "join"
                  ? "A place for growers, nurseries, associations and everyone who loves flowers."
                  : "Your growing community will be right here."}
              </p>
              <div className="info-note">
                {panel === "join"
                  ? "Member registration is coming soon."
                  : "Login is coming soon."}{" "}
                No account details are collected on this preview.
              </div>
              <div className="join-options">
                {[
                  "Flower growers & nurseries",
                  "Associations & chapters",
                  "Flower lovers & buyers",
                ].map((x) => (
                  <div key={x}>
                    <Icon name="leaf" />
                    <span>{x}</span>
                  </div>
                ))}
              </div>
              <button
                className="button primary"
                onClick={() => {
                  close();
                  document
                    .getElementById("flowers")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore flowers for now
                <Icon name="arrow" />
              </button>
              <p className="dialog-switch">
                {panel === "join"
                  ? "Already part of the community?"
                  : "New to FloraConnect?"}{" "}
                <Link to={panel === "join" ? "/login" : "/register"}>
                  {panel === "join" ? "Login" : "Get started"}
                </Link>
              </p>
            </div>
          ) : panel === "associations" ? (
            <>
              <p>
                Stronger connections start locally. FloraConnect will help you
                discover flower associations, regional chapters and membership
                opportunities across Sri Lanka.
              </p>
              <div className="info-note">
                The verified association directory and membership applications
                are coming soon. No association partnerships are claimed on this
                preview.
              </div>
              <button
                className="button primary"
                onClick={() => openPanel("join")}
              >
                Find your community
                <Icon name="people" />
              </button>
            </>
          ) : panel === "notices" ? (
            <>
              <p>
                A dedicated space for source-checked references to relevant
                government notices, training and floriculture opportunities.
              </p>
              <div className="info-note">
                No notices have been published yet. FloraConnect is an
                independent community platform, not a government service or an
                official representative.
              </div>
            </>
          ) : panel === "events" ? (
            <>
              <p>
                Make room for new ideas, shared knowledge and people who love to
                grow.
              </p>
              <div className="event-types">
                {[
                  "Flower exhibitions",
                  "Grower workshops",
                  "Association meetings",
                ].map((x) => (
                  <div key={x}>
                    <Icon name="calendar" />
                    <strong>{x}</strong>
                    <span>Coming soon</span>
                  </div>
                ))}
              </div>
              <p className="muted">
                Verified event dates and registration will appear here when
                available.
              </p>
            </>
          ) : panel === "marketplace" ? (
            <>
              <p>
                Connect with local growers, discover flower availability and
                start conversations about what you need.
              </p>
              <div className="info-note">
                Seller listings and direct inquiries are coming soon. Online
                payments, shipping and order fulfillment are not part of this
                release.
              </div>
              <button
                className="button primary"
                onClick={() => {
                  close();
                  document
                    .getElementById("flowers")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Discover flowers
                <Icon name="arrow" />
              </button>
            </>
          ) : panel === "credits" ? (
            <>
              <p>
                The hill-country grower hero is an AI-generated illustrative
                photograph. Flower photographs are sourced from Wikimedia
                Commons; source pages and original image licensing are linked in{" "}
                <a href="/credits/images.html" target="_blank" rel="noreferrer">
                  our image credits
                </a>
                .
              </p>
            </>
          ) : (
            <>
              <p>
                FloraConnect is a TourGo organization project bringing Sri
                Lanka’s flower growers, nurseries, associations and enthusiasts
                closer together.
              </p>
              <p>
                Our vision is simple: celebrate local flowers, share growing
                knowledge and open new opportunities through community.
              </p>
              <div className="info-note">
                This is a preview of a growing platform. Flower cards are
                illustrative; membership, seller listings and events will be
                introduced in future releases.
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
