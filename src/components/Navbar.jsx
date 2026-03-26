import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "MyCinema", path: "/mycinema" },
    { name: "Coming Soon", path: "/comingsoon" },
    { name: "MaiCinemaTV", path: "/studios" },
    { name: "Events", path: "/events" }
  ];

  return (
    <nav style={styles.nav}>
      <Link
        to="/"
        style={styles.logoWrap}
        onMouseEnter={(e) => {
          const img = e.currentTarget.querySelector("img");
          if (img) img.style.transform = "scale(1.12)";
        }}
        onMouseLeave={(e) => {
          const img = e.currentTarget.querySelector("img");
          if (img) img.style.transform = "scale(1)";
        }}
      >
        <img src={logo} alt="MaiCinema" style={styles.logo} />
      </Link>

      <div style={styles.links}>
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            style={styles.link}
            onMouseEnter={(e) => {
              e.target.style.color = "red";
              e.target.style.transform = "scale(1.12)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "white";
              e.target.style.transform = "scale(1)";
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    padding: "12px 20px", // ✅ FIXED (was 25px 60px)
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
    zIndex: 100
  },

  logoWrap: {
    display: "inline-block",
    textDecoration: "none"
  },

  logo: {
    height: "clamp(50px, 8vw, 110px)", // ✅ responsive logo
    width: "auto",
    display: "block",
    transition: "transform 0.3s ease"
  },

  links: {
    display: "flex",
    gap: "clamp(10px, 3vw, 40px)", // ✅ responsive spacing
    alignItems: "center",
    flexWrap: "wrap", // ✅ prevents overflow on mobile
    justifyContent: "flex-end",
    maxWidth: "70%"
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "clamp(12px, 2.5vw, 18px)", // ✅ responsive text
    fontWeight: "500",
    transition: "all 0.3s ease",
    display: "inline-block"
  }
};

export default Navbar;