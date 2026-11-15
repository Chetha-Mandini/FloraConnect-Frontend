import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Flower2,
  Leaf,
  MapPin,
  RotateCcw,
  Sprout,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import BotanicalBranch from "../../components/ui/BotanicalBranch";

const previewGrowers = [
  {
    name: "Sample Grower 01",
    location: "Kandy",
    specialization: "Orchids",
    image: "/images/featured-orchid-360.webp",
  },
  {
    name: "Sample Grower 02",
    location: "Gampaha",
    specialization: "Flowering Plants",
    image: "/images/featured-rose-360.webp",
  },
  {
    name: "Sample Grower 03",
    location: "Kurunegala",
    specialization: "Ornamental Plants",
    image: "/images/featured-anthurium-360.webp",
  },
  {
    name: "Sample Grower 04",
    location: "Matara",
    specialization: "Indoor Plants",
    image: "/images/featured-sunflower-360.webp",
  },
];

const previewPlants = [
  {
    name: "Dendrobium Orchid",
    image: "/images/featured-orchid-360.webp",
  },
  {
    name: "Cattleya Orchid",
    image: "/images/featured-anthurium-360.webp",
  },
  {
    name: "Phalaenopsis Orchid",
    image: "/images/featured-sunflower-360.webp",
  },
  {
    name: "Vanda Orchid",
    image: "/images/featured-rose-360.webp",
  },
];

function PreviewNotice() {
  return (
    <p className="grower-preview-notice" role="note">
      Design preview — illustrative content only; these are not live grower
      profiles or listings.
    </p>
  );
}

export function GrowersDirectoryDesignPreview() {
  return (
    <div className="grower-design-preview">
      <header className="catalogue-intro grower-directory-intro grower-preview-intro">
        <div>
          <p className="foundation-eyebrow">FLORACONNECT COMMUNITY</p>
          <h1>Growers</h1>
          <p className="foundation-description">
            Discover individual flower growers from across Sri Lanka.
          </p>
        </div>
        <div className="catalogue-total grower-directory-total grower-preview-total">
          <UsersRound size={25} aria-hidden="true" />
          <strong>Preview</strong>
          <span>
            directory
            <br />
            layout
          </span>
        </div>
        <BotanicalBranch className="grower-preview-branch" />
      </header>

      <PreviewNotice />

      <form className="catalogue-toolbar grower-directory-toolbar grower-preview-toolbar">
        <label className="catalogue-search-field grower-directory-search">
          <span className="sr-only">Search growers by name</span>
          <svg
            className="grower-preview-search-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4" />
          </svg>
          <input
            type="search"
            placeholder="Search by grower name..."
            disabled
            aria-label="Search by grower name (preview only)"
          />
        </label>
        <label className="catalogue-select-field grower-directory-select">
          <MapPin
            className="grower-directory-select-icon"
            size={17}
            aria-hidden="true"
          />
          <span className="sr-only">Location</span>
          <select aria-label="Location (preview only)" disabled>
            <option>Location</option>
          </select>
          <ChevronDown
            className="grower-select-chevron"
            size={15}
            aria-hidden="true"
          />
        </label>
        <label className="catalogue-select-field grower-directory-select">
          <Leaf
            className="grower-directory-select-icon"
            size={17}
            aria-hidden="true"
          />
          <span className="sr-only">Specialization</span>
          <select aria-label="Specialization (preview only)" disabled>
            <option>Specialization</option>
          </select>
          <ChevronDown
            className="grower-select-chevron"
            size={15}
            aria-hidden="true"
          />
        </label>
        <button
          className="button outline grower-filter-reset"
          type="button"
          disabled
        >
          <RotateCcw size={15} aria-hidden="true" />
          Reset Filters
        </button>
      </form>

      <div className="catalogue-results-bar grower-preview-results">
        <p>Illustrative profile cards</p>
        <label>
          Sort by:
          <select aria-label="Sort by (preview only)" disabled>
            <option>Newest</option>
          </select>
          <ChevronDown size={14} aria-hidden="true" />
        </label>
      </div>

      <div className="grower-directory-grid grower-preview-grid">
        {previewGrowers.map((grower) => (
          <article className="grower-directory-card" key={grower.name}>
            <img
              className="grower-avatar grower-card-photo"
              src={grower.image}
              alt=""
              aria-hidden="true"
            />
            <div className="grower-card-content">
              <div className="grower-preview-card-heading">
                <span className="grower-preview-avatar" aria-hidden="true">
                  <UserRound size={20} />
                </span>
                <div>
                  <h2>{grower.name}</h2>
                  <p className="grower-card-location">
                    <MapPin size={13} aria-hidden="true" />
                    {grower.location}
                  </p>
                </div>
              </div>
              <span className="grower-specialization-tag">
                <Sprout size={13} aria-hidden="true" />
                {grower.specialization}
              </span>
              <Link
                className="button primary grower-card-link"
                to="/growers/design-preview"
                aria-label={`View illustrative profile for ${grower.name}`}
              >
                View Profile <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <nav
        className="grower-preview-pagination"
        aria-label="Grower directory pagination preview"
      >
        <button type="button" disabled aria-label="Previous page">
          <ChevronLeft size={17} aria-hidden="true" />
        </button>
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            className={page === 1 ? "is-current" : ""}
            type="button"
            disabled
            aria-current={page === 1 ? "page" : undefined}
            aria-label={`Page ${page}`}
            key={page}
          >
            {page}
          </button>
        ))}
        <span aria-hidden="true">…</span>
        <button type="button" disabled aria-label="Page 6">
          6
        </button>
        <button type="button" disabled aria-label="Next page">
          <ChevronRight size={17} aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}

export function GrowerProfileDesignPreview() {
  return (
    <div className="grower-design-preview grower-profile-design-preview">
      <Link className="grower-back-link" to="/growers">
        <ArrowLeft size={16} aria-hidden="true" /> Back to Growers
      </Link>

      <PreviewNotice />

      <section className="grower-profile-intro grower-preview-profile-intro">
        <img
          className="grower-avatar grower-profile-photo"
          src="/images/featured-orchid-1080.webp"
          alt="Illustrative orchid image; not a grower photograph"
        />
        <div className="grower-profile-copy">
          <p className="foundation-eyebrow">ILLUSTRATIVE PROFILE PREVIEW</p>
          <h1>Sample Orchid Grower</h1>
          <p className="grower-profile-location">
            <MapPin size={17} aria-hidden="true" />
            Gampaha, Western Province
          </p>
          <p className="grower-profile-biography">
            This sample text demonstrates how a grower biography will appear
            when verified public profile information is available.
          </p>
          <span className="grower-specialization-tag">
            <Flower2 size={15} aria-hidden="true" />
            Specialization: Orchids
          </span>
          <div className="grower-preview-actions">
            <button
              className="button primary grower-inquiry-button"
              type="button"
              disabled
            >
              Send Inquiry
            </button>
            <button
              className="button outline grower-contact-button"
              type="button"
              disabled
            >
              Contact Grower
            </button>
          </div>
        </div>
      </section>

      <section
        className="grower-plants-section grower-preview-plants-section"
        aria-labelledby="grower-plants-heading"
      >
        <div className="grower-plants-heading">
          <h2 id="grower-plants-heading">Flower Plants from This Grower</h2>
          <button type="button" disabled>
            View All Plants <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
        <div className="grower-plants-grid">
          {previewPlants.map((plant) => (
            <article className="grower-plant-card" key={plant.name}>
              <div className="grower-plant-image">
                <img src={plant.image} alt="" aria-hidden="true" />
              </div>
              <div className="grower-plant-copy">
                <h3>{plant.name}</h3>
                <span>Orchid</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
