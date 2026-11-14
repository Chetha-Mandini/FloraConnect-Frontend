import Skeleton from "./Skeleton";
export default function LoadingState({
  message = "Loading…",
}: {
  message?: string;
}) {
  return (
    <div className="state-panel" role="status" aria-live="polite">
      <div className="loading-skeleton-lines" aria-hidden="true">
        <Skeleton className="skeleton-title" />
        <Skeleton />
        <Skeleton className="skeleton-short" />
      </div>
      <p>{message}</p>
    </div>
  );
}
