import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { pathname } = useLocation();

  // Overlay-Render-Steuerung für Ein-/Ausblende-Animation
  const [show, setShow] = useState(false);      // Overlay ist gerendert?
  const [closing, setClosing] = useState(false); // spielt Close-Animation?

  // beim Routewechsel Menü schließen
  useEffect(() => {
    if (show) handleClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Scroll lock, solange Overlay sichtbar ist (auch während Close-Anim)
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [show]);

  const handleOpen = () => {
    setClosing(false);
    setShow(true);
  };

  const handleClose = () => {
    // erst Animation abspielen, danach unmount
    setClosing(true);
  };

  const onOverlayAnimEnd = () => {
    if (closing) {
      setShow(false);
      setClosing(false);
    }
  };

  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        {/* Logo links */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark} aria-hidden="true" />
        </Link>

        {/* Desktop-Links mittig */}
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

        {/* Burger rechts (nur mobil sichtbar, via CSS) */}
        <button
          className={styles.burgerBtn}
          aria-label="Menü öffnen"
          aria-haspopup="dialog"
          aria-expanded={show && !closing}
          onClick={handleOpen}
        >
          <span className={styles.burgerBar} />
          <span className={styles.burgerBar} />
          <span className={styles.burgerBar} />
        </button>
      </div>

      {/* Overlay-Menü (bleibt beim Schließen während der Animation gemountet) */}
      {show && (
        <div
          className={`${styles.overlay} ${closing ? styles.slideOut : styles.slideIn}`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobiles Menü"
          onAnimationEnd={onOverlayAnimEnd}
        >
          {/* Close Button */}
          <button
            className={styles.closeBtn}
            aria-label="Menü schließen"
            onClick={handleClose}
          >
            <span className={styles.closeIcon} aria-hidden="true" />
          </button>

          {/* Suchfeld (wie in deinem Screenshot) */}
          <div className={styles.searchWrap}>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Suchen …"
              aria-label="Suche"
            />
            <span className={styles.searchIcon} aria-hidden="true">🔍</span>
          </div>

          {/* Linkliste */}
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
    </header>
  );
}
