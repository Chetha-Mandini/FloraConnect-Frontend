import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
export default function AppLayout() {
  return (
    <div className="foundation-layout">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
