import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import EmptyState from "../../components/ui/EmptyState";
import PageContainer from "../../components/layout/PageContainer";
import Skeleton from "../../components/ui/Skeleton";
import GrowerCard from "./GrowerCard";
import GrowerDirectoryFilters, {
  type GrowerFilters,
} from "./GrowerDirectoryFilters";
import type { GrowerPageStatus, PublicGrower } from "./growerTypes";

const PAGE_SIZE = 12;
const INITIAL_FILTERS: GrowerFilters = {
  search: "",
  district: "",
  specialization: "",
};

export default function GrowersDirectoryPage({
  growers = [],
  status = "unavailable",
  onRetry,
}: {
  growers?: PublicGrower[];
  status?: GrowerPageStatus;
  onRetry?: () => void;
}) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const canBrowse = status === "ready";
  const districts = useMemo(
    () => [
      ...new Set(growers.map((grower) => grower.district).filter(Boolean)),
    ],
    [growers],
  );
  const specializations = useMemo(
    () => [
      ...new Set(
        growers.map((grower) => grower.specialization).filter(Boolean),
      ),
    ],
    [growers],
  );
  const filteredGrowers = useMemo(() => {
    const query = filters.search.trim().toLocaleLowerCase();
    return growers.filter(
      (grower) =>
        (!query || grower.displayName.toLocaleLowerCase().includes(query)) &&
        (!filters.district || grower.district === filters.district) &&
        (!filters.specialization ||
          grower.specialization === filters.specialization),
    );
  }, [filters, growers]);
  const totalPages = Math.ceil(filteredGrowers.length / PAGE_SIZE);
  const visibleGrowers = filteredGrowers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const hasFilters = Boolean(
    filters.search || filters.district || filters.specialization,
  );

  function updateFilters(nextFilters: GrowerFilters) {
    setFilters(nextFilters);
    setPage(1);
  }

  function resetFilters() {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  }

  return (
    <PageContainer className="catalogue-page grower-directory-page grower-page-enter">
      <header className="catalogue-intro grower-directory-intro">
        <div>
          <p className="foundation-eyebrow">FLORACONNECT COMMUNITY</p>
          <h1>Growers</h1>
          <p className="foundation-description">
            Discover individual flower growers from across Sri Lanka.
          </p>
        </div>
        <div
          className="catalogue-total grower-directory-total"
          aria-label={
            canBrowse
              ? `${growers.length} published grower profiles`
              : "Published grower profile count unavailable"
          }
        >
          <strong>{canBrowse ? growers.length : "—"}</strong>
          <span>
            published grower
            <br />
            profiles
          </span>
        </div>
      </header>

      <section
        className="grower-directory-results"
        aria-label="Grower directory"
      >
        <GrowerDirectoryFilters
          filters={filters}
          districts={districts}
          specializations={specializations}
          disabled={!canBrowse}
          onChange={updateFilters}
          onReset={resetFilters}
        />

        <div className="catalogue-results-bar">
          <p role="status" aria-live="polite">
            {canBrowse
              ? filteredGrowers.length
                ? `${(page - 1) * PAGE_SIZE + 1}–${Math.min(
                    page * PAGE_SIZE,
                    filteredGrowers.length,
                  )} of ${filteredGrowers.length} growers`
                : "0 growers"
              : status === "loading"
                ? "Loading grower profiles..."
                : status === "error"
                  ? "Grower profiles unavailable"
                  : "Grower directory unavailable"}
          </p>
          {status === "unavailable" && (
            <p className="grower-directory-unavailable-note">
              Filters will be available when public grower profiles are
              connected.
            </p>
          )}
        </div>

        {status === "loading" && (
          <div
            className="grower-directory-grid"
            aria-busy="true"
            aria-label="Loading grower profiles"
          >
            {Array.from({ length: 8 }, (_, index) => (
              <article
                className="grower-directory-card grower-card-skeleton"
                key={index}
                aria-hidden="true"
              >
                <Skeleton className="grower-card-photo" />
                <div className="grower-card-content">
                  <Skeleton className="skeleton-title" />
                  <Skeleton className="skeleton-short" />
                  <Skeleton className="skeleton-label" />
                  <Skeleton className="grower-card-skeleton-button" />
                </div>
              </article>
            ))}
          </div>
        )}

        {status === "error" && (
          <section className="grower-directory-state" role="alert">
            <h2>Grower profiles could not be loaded</h2>
            <p>Please check your connection and try again.</p>
            {onRetry && (
              <button
                className="button primary"
                type="button"
                onClick={onRetry}
              >
                Retry
              </button>
            )}
          </section>
        )}

        {status === "unavailable" && (
          <section className="grower-directory-state" role="status">
            <h2>Grower directory is not available yet</h2>
            <p>
              Public grower profiles will appear here once the directory service
              is connected.
            </p>
          </section>
        )}

        {canBrowse && visibleGrowers.length > 0 && (
          <div className="grower-directory-grid">
            {visibleGrowers.map((grower) => (
              <GrowerCard key={grower.id} grower={grower} />
            ))}
          </div>
        )}

        {canBrowse && growers.length === 0 && (
          <EmptyState
            title="No grower profiles available yet"
            message="Registered flower growers will appear here once their public profiles are published."
          />
        )}

        {canBrowse && growers.length > 0 && filteredGrowers.length === 0 && (
          <section className="grower-directory-state" role="status">
            <h2>No matching growers found</h2>
            <button
              type="button"
              className="catalogue-clear"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </section>
        )}

        {canBrowse && totalPages > 1 && (
          <nav
            className="catalogue-pagination grower-directory-pagination"
            aria-label="Grower directory pages"
          >
            <button
              className="button outline"
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
            >
              <ArrowLeft size={16} aria-hidden="true" /> Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="button outline"
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next <ArrowRight size={16} aria-hidden="true" />
            </button>
          </nav>
        )}

        {canBrowse && growers.length > 0 && filteredGrowers.length > 0 && (
          <p className="sr-only" aria-live="polite">
            {hasFilters ? `${filteredGrowers.length} matching growers` : ""}
          </p>
        )}
      </section>
    </PageContainer>
  );
}
