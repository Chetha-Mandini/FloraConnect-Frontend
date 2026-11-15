import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Flower2,
  Search,
} from "lucide-react";
import EmptyState from "../../components/ui/EmptyState";
import {
  growerFlowerListings,
  type GrowerFlowerListing,
} from "./growerFlowerListings";
import { normalizeFlowerText } from "./normalizeFlowerText";

const PAGE_SIZE = 12;

export default function GrowerFlowerCatalogue({
  listings = growerFlowerListings,
}: {
  listings?: GrowerFlowerListing[];
}) {
  const publishedListings = listings.filter(
    (listing) => listing.status === "PUBLISHED",
  );
  const [query, setQuery] = useState("");
  const [plantType, setPlantType] = useState("");
  const [location, setLocation] = useState("");
  const [growerId, setGrowerId] = useState("");
  const [page, setPage] = useState(1);

  const plantTypes = [
    ...new Set(publishedListings.map((item) => item.plantType)),
  ];
  const locations = [
    ...new Set(publishedListings.map((item) => item.location)),
  ];
  const growers = [
    ...new Map(
      publishedListings.map((item) => [item.growerId, item.growerName]),
    ),
  ];
  const filtered = publishedListings.filter(
    (item) =>
      normalizeFlowerText(
        `${item.name} ${item.growerName} ${item.location} ${item.plantType}`,
      ).includes(normalizeFlowerText(query)) &&
      (!plantType || item.plantType === plantType) &&
      (!location || item.location === location) &&
      (!growerId || item.growerId === growerId),
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = Boolean(query || plantType || location || growerId);

  function resetFilters() {
    setQuery("");
    setPlantType("");
    setLocation("");
    setGrowerId("");
    setPage(1);
  }

  function updateFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  return (
    <section aria-label="Grower flower listings">
      <form
        className="catalogue-toolbar grower-catalogue-toolbar"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="catalogue-search-field">
          <span className="sr-only">Search flower or plant name</span>
          <Search size={19} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => updateFilter(setQuery, event.target.value)}
            placeholder="Search flower or plant name..."
          />
        </label>
        <label className="catalogue-select-field">
          <span className="sr-only">Plant type</span>
          <select
            value={plantType}
            onChange={(event) => updateFilter(setPlantType, event.target.value)}
          >
            <option value="">All plant types</option>
            {plantTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <ChevronDown
            className="grower-select-chevron"
            size={15}
            aria-hidden="true"
          />
        </label>
        <label className="catalogue-select-field">
          <span className="sr-only">Location</span>
          <select
            value={location}
            onChange={(event) => updateFilter(setLocation, event.target.value)}
          >
            <option value="">All locations</option>
            {locations.map((itemLocation) => (
              <option key={itemLocation} value={itemLocation}>
                {itemLocation}
              </option>
            ))}
          </select>
          <ChevronDown
            className="grower-select-chevron"
            size={15}
            aria-hidden="true"
          />
        </label>
        <label className="catalogue-select-field">
          <span className="sr-only">Grower or nursery</span>
          <select
            value={growerId}
            onChange={(event) => updateFilter(setGrowerId, event.target.value)}
          >
            <option value="">Grower / Nursery</option>
            {growers.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <ChevronDown
            className="grower-select-chevron"
            size={15}
            aria-hidden="true"
          />
        </label>
        <button
          type="button"
          className="button outline grower-filter-reset"
          onClick={resetFilters}
          disabled={!hasFilters}
        >
          Reset Filters
        </button>
      </form>

      <div className="catalogue-results-bar" id="catalogue-results">
        <p role="status">
          {filtered.length
            ? `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} listings`
            : `${filtered.length} listings`}
        </p>
      </div>

      {visible.length ? (
        <div className="catalogue-grid">
          {visible.map((listing) => (
            <article
              className="catalogue-item grower-listing-card"
              key={listing.id}
            >
              <Link
                className="grower-listing-main"
                to={`/flowers/${encodeURIComponent(listing.id)}`}
                aria-label={`View ${listing.name}`}
              >
                <div className="catalogue-photo">
                  {listing.image ? (
                    <img
                      src={listing.image}
                      alt={listing.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="catalogue-photo-missing">
                      <Flower2 size={42} strokeWidth={1} aria-hidden="true" />
                      <span>Photo not available</span>
                    </div>
                  )}
                </div>
                <div className="catalogue-card-body">
                  <span className="catalogue-card-category">
                    {listing.plantType}
                  </span>
                  <h2>{listing.name}</h2>
                </div>
              </Link>
              <div className="grower-listing-meta">
                <Link to={`/growers/${encodeURIComponent(listing.growerId)}`}>
                  {listing.growerName}
                </Link>
                <span>{listing.location}</span>
              </div>
            </article>
          ))}
        </div>
      ) : hasFilters ? (
        <div className="grower-no-matches" role="status">
          <p>No matching plants found</p>
          <button
            type="button"
            className="catalogue-clear"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grower-empty-state">
          <EmptyState
            title="No grower flower listings yet"
            message="Flower plants offered by registered growers and nurseries will appear here soon."
          />
          <div className="grower-empty-actions">
            <Link className="button primary" to="/flowers?tab=varieties">
              Explore World Flower Varieties
            </Link>
            <Link className="button outline" to="/growers">
              View Growers
            </Link>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <nav className="catalogue-pagination" aria-label="Grower listing pages">
          <button
            className="button outline"
            disabled={page === 1}
            onClick={() => setPage((current) => current - 1)}
          >
            <ArrowLeft size={16} /> Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="button outline"
            disabled={page === totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Next <ArrowRight size={16} />
          </button>
        </nav>
      )}
    </section>
  );
}
