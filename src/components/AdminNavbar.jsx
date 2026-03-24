import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function AdminNavbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <img src={logo} alt="MaiCinema" style={styles.logo} />
        <span style={styles.adminText}>Admin</span>
      </div>

      <div style={styles.links}>
        <Link to="/admin" style={styles.link}>Dashboard</Link>
        <Link to="/admin/films" style={styles.link}>Films</Link>
        <Link to="/admin/events" style={styles.link}>Events</Link>
        <Link to="/admin/submissions" style={styles.link}>Submissions</Link>
        <Link to="/admin/studios" style={styles.link}>Studios</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    width: "100%",
    background: "#000",
    borderBottom: "1px solid #222",
    padding: "20px 40px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  logo: {
    height: "60px",
    width: "auto",
    display: "block"
  },
  adminText: {
    color: "#e50914",
    fontSize: "20px",
    fontWeight: "700"
  },
  links: {
    display: "flex",
    gap: "28px",
    alignItems: "center"
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500"
  }
};

export default AdminNavbar;