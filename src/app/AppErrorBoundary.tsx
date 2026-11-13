import { Component, type ReactNode } from "react";

export default class AppErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <main
          role="alert"
          style={{
            padding: 40,
            fontFamily: "system-ui, sans-serif",
            color: "#202720",
            background: "#f7f9f6",
            minHeight: "100svh",
          }}
        >
          <h1>Unable to open FloraConnect</h1>
          <p>Reload the page to recover. Diagnostic: APP_RENDER_FAILED</p>
          <button onClick={() => window.location.reload()}>Reload page</button>
          <p>
            <a href="/login">Return to login</a>
          </p>
        </main>
      );
    return this.props.children;
  }
}
