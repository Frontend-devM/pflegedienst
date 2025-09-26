import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { pathname } = useLocation();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const idleTimerRef = useRef(0);
  const rafRef = useRef(0);

  // Menü bei Routewechsel schließen
  useEffect(() => setMenuOpen(false), [pathname]);

  // Scroll-Lock bei Overlay offen
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [menuOpen]);

  // Scroll-Logik: sichtbar während Scroll, ausblenden nach Idle
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY || 0;

        setScrolled(y > 8);        // Schatten/Hintergrund ab 8px
        setHidden(false);          // sofort einblenden, wenn gescrollt wird

        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
          if (window.scrollY > 80) setHidden(true); // nach 800ms Idle ausblenden
        }, 800);

        rafRef.current = 0;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  return (
    <>
      <header
        className={[
          styles.nav,
          hidden ? styles.navHidden : styles.navShown,
          scrolled ? styles.navScrolled : "",
        ].join(" ")}
      >
        <div className={styles.inner}>
          {/* Logo */}
          <Link to="/" className={styles.logo} aria-label="Startseite">
            <span className={styles.logoMark} aria-hidden="true" />
          </Link>

          {/* Desktop Links */}
          <nav className={styles.centerLinks} aria-label="Hauptnavigation">
            {[
              { to: "/", label: "Home" },
              { to: "/kandidaten", label: "Für Kandidaten" },
              { to: "/unternehmen", label: "Für Unternehmen" },
              { to: "/portfolio", label: "Leistungsportfolio" },
              { to: "/ueber-uns", label: "Über uns" },
              { to: "/kontakt", label: "Kontakt" },
            ].map((i) => (
              <NavLink
                key={i.to}
                to={i.to}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.linkActive : ""}`
                }
              >
                {i.label}
              </NavLink>
            ))}
          </nav>

          {/* Burger mobil */}
          <button
            className={styles.burgerBtn}
            aria-label="Menü öffnen"
            onClick={() => setMenuOpen(true)}
          >
            <span className={styles.burgerBar} />
            <span className={styles.burgerBar} />
            <span className={styles.burgerBar} />
          </button>
        </div>
      </header>

      {/* Spacer, damit Content nicht überlappt */}
      <div className={styles.navSpacer} />

      {/* Overlay Menü mobil */}
      {menuOpen && (
        <div
          className={`${styles.overlay} ${styles.slideIn}`}
          role="dialog"
          aria-modal="true"
        >
          <button
            className={styles.closeBtn}
            aria-label="Menü schließen"
            onClick={() => {
              const el = document.querySelector(`.${styles.overlay}`);
              if (!el) return setMenuOpen(false);
              el.classList.remove(styles.slideIn);
              el.classList.add(styles.slideOut);
              el.addEventListener("animationend", () => setMenuOpen(false), {
                once: true,
              });
            }}
          >
            <span className={styles.closeIcon} aria-hidden="true" />
          </button>

          <div className={styles.searchWrap}>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Suchen …"
              aria-label="Suche"
            />
            <span className={styles.searchIcon} aria-hidden="true">🔍</span>
          </div>

          <nav className={styles.mobileLinks} aria-label="Mobiles Menü">
            {[
              { to: "/", label: "Home" },
              { to: "/kandidaten", label: "Für Kandidaten" },
              { to: "/unternehmen", label: "Für Unternehmen" },
              { to: "/portfolio", label: "Leistungsportfolio" },
              { to: "/ueber-uns", label: "Über uns" },
              { to: "/kontakt", label: "Kontakt" },
              { to: "/datenschutz", label: "Datenschutz" },
              { to: "/impressum", label: "Impressum" },
            ].map((i) => (
              <NavLink
                key={i.to}
                to={i.to}
                className={({ isActive }) =>
                  `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ""}`
                }
              >
                {i.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
