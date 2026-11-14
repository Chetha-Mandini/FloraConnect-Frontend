import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Brand from "./Brand";
import MobileMenu from "./MobileMenu";

type NavbarProps = {
  isAuthenticated?: boolean;
};

export default function Navbar({ isAuthenticated = false }: NavbarProps) {
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const closePanels = () => {
    setSearch(false);
  };
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (search) input.current?.focus();
  }, [search]);
  return (
    <header
      className={`site-header${scrolled ? " scrolled" : ""}`}
      onKeyDown={(event) => {
        if (event.key === "Escape") setSearch(false);
      }}
    >
      <div className="header-inner container">
        <Brand />
        <div className="header-actions">
          <button
            className="icon-button search-toggle"
            aria-label="Search catalogue"
            aria-expanded={search}
            aria-controls="site-search"
            onClick={() => setSearch((current) => !current)}
          >
            <Search size={19} />
          </button>
          {isAuthenticated ? (
            <>
              <Link
                className="button outline profile-button"
                to="/profile"
                onClick={closePanels}
              >
                Profile
              </Link>
              <Link
                className="button primary"
                to="/logout"
                onClick={closePanels}
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                className="button outline login-button"
                to="/login"
                onClick={closePanels}
              >
                Login
              </Link>
              <Link
                className="button primary"
                to="/register"
                onClick={closePanels}
              >
                Register
              </Link>
            </>
          )}
        </div>
        <MobileMenu />
      </div>
      {search && (
        <form
          id="site-search"
          className="site-search container"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const query = input.current?.value.trim() ?? "";
            navigate(
              `/flowers${query ? `?q=${encodeURIComponent(query)}` : ""}`,
            );
            setSearch(false);
          }}
        >
          <label htmlFor="flower-search">Find a flower</label>
          <input
            ref={input}
            id="flower-search"
            type="search"
            placeholder="Search flowers and varieties"
          />
          <button className="button primary">Search</button>
        </form>
      )}
    </header>
  );
}
