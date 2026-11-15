import { Flower2, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState";
import PageContainer from "../../components/layout/PageContainer";
import Skeleton from "../../components/ui/Skeleton";
import GrowerAvatar from "./GrowerAvatar";
import { GrowerProfileDesignPreview } from "./GrowerDesignPreview";
import type { GrowerPageStatus, PublicGrower } from "./growerTypes";

export default function GrowerProfilePage({
  grower,
  status = "unavailable",
  onRetry,
}: {
  grower?: PublicGrower;
  status?: GrowerPageStatus;
  onRetry?: () => void;
}) {
  const { id = "" } = useParams();
  const canShowProfile = status === "ready" && Boolean(grower);
  const returnTo = `/growers/${encodeURIComponent(grower?.id ?? id)}`;

  if (status === "unavailable") {
    return (
      <PageContainer className="catalogue-page grower-profile-page grower-page-enter">
        <GrowerProfileDesignPreview />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="catalogue-page grower-profile-page grower-page-enter">
      <Link className="grower-back-link" to="/growers">
        <span aria-hidden="true">←</span> Back to Growers
      </Link>

      {status === "loading" && (
        <section
          className="grower-profile-loading"
          aria-busy="true"
          aria-label="Loading grower profile"
        >
          <span className="sr-only" role="status">
            Loading grower profile...
          </span>
          <Skeleton className="grower-profile-loading-photo" />
          <div>
            <Skeleton className="skeleton-label" />
            <Skeleton className="grower-profile-loading-title" />
            <Skeleton className="skeleton-description" />
            <Skeleton className="grower-profile-loading-copy" />
          </div>
        </section>
      )}

      {status === "error" && (
        <section className="grower-directory-state" role="alert">
          <h1>Grower profile could not be loaded</h1>
          <p>Please check your connection and try again.</p>
          {onRetry && (
            <button className="button primary" type="button" onClick={onRetry}>
              Retry
            </button>
          )}
        </section>
      )}

      {status === "not-found" && (
        <section className="grower-directory-state">
          <h1>Grower profile not found</h1>
          <p>
            This public grower profile may have been removed or unpublished.
          </p>
          <Link className="button primary" to="/growers">
            Back to Growers
          </Link>
        </section>
      )}

      {status === "ready" && !grower && (
        <section className="grower-directory-state">
          <h1>Grower profile not found</h1>
          <p>
            This public grower profile may have been removed or unpublished.
          </p>
          <Link className="button primary" to="/growers">
            Back to Growers
          </Link>
        </section>
      )}

      {canShowProfile && grower && (
        <>
          <section className="grower-profile-intro">
            <GrowerAvatar
              name={grower.displayName}
              image={grower.profileImage}
              className="grower-profile-photo"
            />
            <div className="grower-profile-copy">
              <p className="foundation-eyebrow">FLORACONNECT GROWER</p>
              <h1>{grower.displayName}</h1>
              <p className="grower-profile-location">
                <MapPin size={17} aria-hidden="true" />
                {grower.district}, {grower.province}
              </p>
              <p className="grower-profile-biography">{grower.biography}</p>
              <span className="grower-specialization-tag">
                {grower.specialization}
              </span>
              <Link
                className="button primary grower-inquiry-button"
                to="/login"
                state={{ returnTo }}
              >
                Send Inquiry
              </Link>
              <p className="grower-inquiry-note">
                Sign in to continue to this grower profile.
              </p>
            </div>
          </section>

          <section
            className="grower-plants-section"
            aria-labelledby="grower-plants-heading"
          >
            <div className="grower-plants-heading">
              <p className="foundation-eyebrow">FROM THE GROWER</p>
              <h2 id="grower-plants-heading">Flower Plants from This Grower</h2>
            </div>
            {grower.publishedFlowerPlants.length > 0 ? (
              <div className="grower-plants-grid">
                {grower.publishedFlowerPlants.map((plant) => (
                  <Link
                    className="grower-plant-card"
                    key={plant.id}
                    to={`/flowers/${encodeURIComponent(plant.id)}`}
                    aria-label={`View ${plant.name}`}
                  >
                    <div className="grower-plant-image">
                      {plant.image ? (
                        <img
                          src={plant.image}
                          alt={plant.name}
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="grower-plant-image-fallback"
                          role="img"
                          aria-label={`${plant.name} photo unavailable`}
                        >
                          <Flower2 size={38} aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="grower-plant-copy">
                      <h3>{plant.name}</h3>
                      {plant.category && <span>{plant.category}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No published flower plants yet"
                message="Published flower plants from this grower will appear here."
              />
            )}
          </section>
        </>
      )}
    </PageContainer>
  );
}
