export default function LoadingState({
  message = "Loading…",
}: {
  message?: string;
}) {
  return (
    <div className="state-panel" role="status" aria-live="polite">
      <span className="loading-indicator" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
