import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

function AdminNavbar() {

  /* ✅ ADDED (lock system) */
  const [locked,setLocked] = useState(false);
  const [password,setPassword] = useState("");

  const ADMIN_PASSWORD = "admin123"; // 🔒 change later

  function handleUnlock(){
    if(password === ADMIN_PASSWORD){
      setLocked(false);
      setPassword("");
    } else {
      alert("Wrong password");
    }
  }

  return (
    <>
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

          {/* 🔒 LOCK BUTTON (ADDED) */}
          <span
            onClick={()=>setLocked(true)}
            style={{cursor:"pointer", fontSize:"20px"}}
            title="Lock screen"
          >
            🔒
          </span>
        </div>
      </nav>

      {/* 🔒 LOCK SCREEN OVERLAY (ADDED) */}
      {locked && (
        <div style={styles.lockOverlay}>
          <div style={styles.lockBox}>
            <h2>Admin Locked</h2>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              style={styles.input}
            />

            <button
              onClick={handleUnlock}
              style={styles.unlockBtn}
            >
              Unlock
            </button>
          </div>
        </div>
      )}
    </>
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
  },

  /* 🔒 NEW STYLES */
  lockOverlay:{
    position:"fixed",
    top:0,
    left:0,
    width:"100%",
    height:"100%",
    background:"rgba(0,0,0,0.95)",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    zIndex:9999
  },

  lockBox:{
    background:"#111",
    padding:"30px",
    borderRadius:"8px",
    textAlign:"center",
    width:"300px"
  },

  input:{
    width:"100%",
    padding:"10px",
    marginTop:"15px",
    marginBottom:"15px",
    border:"none"
  },

  unlockBtn:{
    width:"100%",
    padding:"10px",
    background:"#e50914",
    border:"none",
    color:"white",
    cursor:"pointer"
  }
};

export default AdminNavbar;