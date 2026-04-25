import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import defaultLogo from "../assets/logo.png";
import { supabase } from "../lib/supabase";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(defaultLogo);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "MyCinema", path: "/mycinema" },
    { name: "Events", path: "/events" }
  ];

  useEffect(() => {
    loadLogo();
  }, []);

  async function loadLogo() {
    const { data, error } = await supabase
      .from("logos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      setLogoUrl(defaultLogo);
      return;
    }

    setLogoUrl(data[0].file_url);
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logoWrap}>
        <img src={logoUrl} alt="MaiCinema" style={styles.logo} />
      </Link>

      <div style={styles.linksDesktop}>
        {navItems.map((item) => (
          <Link key={item.name} to={item.path} style={styles.link}>
            {item.name}
          </Link>
        ))}
      </div>

      <div style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

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
    height: "clamp(50px, 8vw, 110px)",
    transition: "transform 0.3s ease"
  },

  linksDesktop: {
    display: window.innerWidth < 768 ? "none" : "flex",
    gap: "30px"
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    transition: "all 0.3s ease",
    display: "inline-block"
  },

  hamburger: {
    display: window.innerWidth < 768 ? "block" : "none",
    fontSize: "26px",
    cursor: "pointer",
    color: "white"
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

export default Navbar;