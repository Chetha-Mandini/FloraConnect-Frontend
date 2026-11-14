import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminProfileMenu({
  name,
  busy,
  onLogout,
}: {
  name: string;
  busy: boolean;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  useEffect(() => {
    const closeOutside = (event: Event) => {
      if (
        event.target instanceof Node &&
        !container.current?.contains(event.target)
      )
        setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("focusin", closeOutside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOutside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  // Route-aware key remount in the parent also closes on browser navigation.
  return (
    <div className="fc-admin-profile-menu" ref={container}>
      <button
        ref={trigger}
        type="button"
        aria-label="Administrator menu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            requestAnimationFrame(() =>
              container.current
                ?.querySelector<HTMLElement>('[role="menuitem"]')
                ?.focus(),
            );
          }
        }}
      >
        <span className="fc-admin-avatar" aria-hidden="true">
          {name.slice(0, 1)}
        </span>
        <span>{name}</span>
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Account actions"
          onKeyDown={(event) => {
            if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key))
              return;
            event.preventDefault();
            const items = [
              ...container.current!.querySelectorAll<HTMLElement>(
                '[role="menuitem"]:not(:disabled)',
              ),
            ];
            const index = items.indexOf(document.activeElement as HTMLElement);
            items[
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? items.length - 1
                  : (index +
                      (event.key === "ArrowDown" ? 1 : -1) +
                      items.length) %
                    items.length
            ]?.focus();
          }}
        >
          <Link
            role="menuitem"
            to="/admin/profile"
            onClick={() => setOpen(false)}
          >
            My profile
          </Link>
          <Link
            role="menuitem"
            to="/admin/settings"
            onClick={() => setOpen(false)}
          >
            System settings
          </Link>
          <button
            role="menuitem"
            type="button"
            disabled={busy}
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
