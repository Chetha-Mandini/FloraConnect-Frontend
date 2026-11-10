import { NavLink, Outlet } from "react-router-dom";
import Brand from "../components/layout/Brand";

export default function AppLayout() {
  return (
    <div className="foundation-layout">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="foundation-header">
        <Brand />
        <nav className="foundation-nav" aria-label="Main navigation">
          <NavLink to="/flowers">Flowers</NavLink>
          <NavLink to="/associations">Associations</NavLink>
          <NavLink to="/announcements">Announcements</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </nav>
      </header>
      <Outlet />
      <footer className="foundation-footer">
        <p>© 2026 TourGo organization. All rights reserved.</p>
        <NavLink to="/">Back to FloraConnect home</NavLink>
      </footer>
    </div>
  );
}
