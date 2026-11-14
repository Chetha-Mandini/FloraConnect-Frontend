import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { navigationLinks } from "./navigation";

export default function MobileMenu() {
  const [openAt, setOpenAt] = useState<string | null>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const worldVarieties =
    params.get("tab") !== "growers" &&
    (params.get("tab") === "varieties" ||
      ["q", "category", "letter", "collection", "sort", "page"].some((key) =>
        params.has(key),
      ));
  const open = openAt === location.key;

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenAt(null);
        toggle.current?.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <>
      <nav
        id="main-navigation"
        className={`main-nav${open ? " is-open" : ""}`}
        aria-label="Main navigation"
      >
        {navigationLinks.map(({ label, to }) => {
          const active = to.startsWith("/flowers")
            ? location.pathname === "/flowers" &&
              to.includes("tab=varieties") === worldVarieties
            : to === "/"
              ? location.pathname === "/"
              : location.pathname === to ||
                location.pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className={active ? "active" : undefined}
              aria-current={active ? "page" : undefined}
              onClick={() => setOpenAt(null)}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        ref={toggle}
        type="button"
        className="icon-button mobile-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpenAt(open ? null : location.key)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
    </>
  );
}
