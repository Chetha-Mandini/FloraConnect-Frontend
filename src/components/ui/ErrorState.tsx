export default function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="state-panel error-state" role="alert">
      <h2>Something went wrong</h2>
      <p>{message}</p>
      {onRetry && (
        <button className="button outline" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
