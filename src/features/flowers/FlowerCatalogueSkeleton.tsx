import Skeleton from "../../components/ui/Skeleton";

export default function FlowerCatalogueSkeleton() {
  return (
    <main id="main" className="foundation-main catalogue-page" aria-busy="true">
      <p className="sr-only" role="status">
        Loading flower catalogue...
      </p>
      <div className="catalogue-skeleton-intro" aria-hidden="true">
        <Skeleton className="skeleton-label" />
        <Skeleton className="skeleton-heading" />
        <Skeleton className="skeleton-description" />
        <Skeleton className="skeleton-toolbar" />
      </div>
      <div className="catalogue-grid" aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => (
          <div className="catalogue-item" key={index}>
            <Skeleton className="catalogue-photo" />
            <div className="catalogue-card-body skeleton-card-body">
              <Skeleton className="skeleton-label" />
              <Skeleton className="skeleton-title" />
              <Skeleton />
              <Skeleton />
              <Skeleton className="skeleton-short" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
