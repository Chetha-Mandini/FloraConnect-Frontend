import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import Brand from "./Brand";

const navigation = [
  ["Home", "/"],
  ["Catalogue", "/flowers"],
  ["Growers", "/growers"],
  ["Associations", "/associations"],
  ["Events", "/events"],
  ["Announcements", "/announcements"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const closePanels = () => {
    setOpen(false);
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
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          setSearch(false);
          toggle.current?.focus();
        }
      }}
    >
      <div className="header-inner container">
        <Brand />
        <nav
          id="main-navigation"
          className={`main-nav${open ? " is-open" : ""}`}
          aria-label="Main navigation"
        >
          {navigation.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Search catalogue"
            aria-expanded={search}
            aria-controls="site-search"
            onClick={() => setSearch(!search)}
          >
            <Search size={19} />
          </button>
          <Link
            className="button outline login-button"
            to="/login"
            onClick={closePanels}
          >
            Login
          </Link>
          <Link className="button primary" to="/register" onClick={closePanels}>
            Register
          </Link>
          <button
            ref={toggle}
            className="icon-button mobile-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
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
            setOpen(false);
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
