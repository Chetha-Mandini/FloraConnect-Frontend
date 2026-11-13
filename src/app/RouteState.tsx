import { Link } from "react-router-dom";

export function RoutePending() {
  return (
    <main
      role="status"
      aria-live="polite"
      style={{
        minHeight: "100svh",
        background: "#f7f9f6",
        padding: "40px",
        color: "#245c43",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <strong>FloraConnect</strong>
      <p>Opening your workspace…</p>
    </main>
  );
}
export function RouteFailure() {
  return (
    <main
      role="alert"
      style={{
        minHeight: "100svh",
        background: "#f7f9f6",
        padding: "40px",
        color: "#202720",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>Unable to open this page</h1>
      <p>
        The page could not load. Reload to get the latest application version.
      </p>
      <button onClick={() => window.location.reload()}>Reload page</button>
      <p>
        <Link to="/login" reloadDocument>
          Return to login
        </Link>
      </p>
    </main>
  );
}
