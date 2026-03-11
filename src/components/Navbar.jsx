import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {

  const logoStyle = {
    width: "220px",   // increased size
    cursor: "pointer",
    transition: "transform 0.3s ease"
  };

  return (
    <nav style={styles.navbar}>

      {/* LOGO */}
      <Link to="/">
        <img
          src={logo}
          alt="MaiCinema"
          style={logoStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.15)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
          }}
        />
      </Link>

      {/* NAV LINKS */}
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/mycinema" style={styles.link}>MyCinema</Link>
        <Link to="/comingsoon" style={styles.link}>Coming Soon</Link>
        <Link to="/studios" style={styles.link}>Studios</Link>
        <Link to="/events" style={styles.link}>Events</Link>
        <Link to="/tickets" style={styles.link}>Tickets</Link>
      </div>

    </nav>
  );
}

const styles = {
  navbar: {
    position: "absolute",
    top: 0,
    width: "100%",
    padding: "20px 60px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 100
  },

  links: {
    display: "flex",
    gap: "30px"
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500"
  }
};

export default Navbar;