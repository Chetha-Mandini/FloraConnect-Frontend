export default function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <section className="state-panel empty-state-panel" aria-live="polite">
      <h2>{title}</h2>
      <p>{message}</p>
    </section>
  );
}
