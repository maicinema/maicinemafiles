import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // keep your correct logo file here

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
          if (img) {
            img.style.transform = "scale(1.12)";
          }
        }}
        onMouseLeave={(e) => {
          const img = e.currentTarget.querySelector("img");
          if (img) {
            img.style.transform = "scale(1)";
          }
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
    padding: "25px 60px",
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
    height: "110px",
    width: "auto",
    display: "block",
    transition: "transform 0.3s ease"
  },

  links: {
    display: "flex",
    gap: "40px",
    alignItems: "center"
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    display: "inline-block"
  }
};

export default Navbar;