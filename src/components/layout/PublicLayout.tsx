import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

type PublicLayoutProps = {
  isAuthenticated?: boolean;
};

export default function PublicLayout({
  isAuthenticated = false,
}: PublicLayoutProps) {
  return (
    <div className="foundation-layout">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Navbar isAuthenticated={isAuthenticated} />
      <Outlet />
      <Footer />
    </div>
  );
}
