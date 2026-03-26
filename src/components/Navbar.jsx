import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "MyCinema", path: "/mycinema" },
    { name: "Coming Soon", path: "/comingsoon" },
    { name: "MaiCinemaTV", path: "/studios" },
    { name: "Events", path: "/events" }
  ];

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logoWrap}>
        <img src={logo} alt="MaiCinema" style={styles.logo} />
      </Link>

      {/* ✅ Desktop Links */}
      <div style={styles.linksDesktop}>
        {navItems.map((item) => (
          <Link key={item.name} to={item.path} style={styles.link}>
            {item.name}
          </Link>
        ))}
      </div>

      {/* ✅ Hamburger Button */}
      <div style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* ✅ Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              style={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 100,
    boxSizing: "border-box"
  },

  logoWrap: {
    display: "inline-block"
  },

  logo: {
    height: "clamp(50px, 8vw, 110px)"
  },

  /* ✅ DESKTOP */
  linksDesktop: {
    display: "flex",
    gap: "30px"
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px"
  },

  /* ✅ MOBILE */
  hamburger: {
    display: "none",
    fontSize: "28px",
    cursor: "pointer"
  },

  mobileMenu: {
    position: "absolute",
    top: "70px",
    right: "20px",
    background: "black",
    padding: "20px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  mobileLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px"
  }
};

/* ✅ RESPONSIVE LOGIC (important) */
if (window.innerWidth < 768) {
  styles.linksDesktop.display = "none";
  styles.hamburger.display = "block";
}

export default Navbar;