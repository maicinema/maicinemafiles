import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import logo from "../assets/logo.png";

function AdminNavbar() {

  const [locked, setLocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  let inactivityTimer;

  /* LOAD LOCK STATE */
  useEffect(() => {
  const isLocked = localStorage.getItem("admin_locked");
  if (isLocked === "true") {
    setLocked(true);
  }

  let timeout;

  const resetTimer = () => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      localStorage.setItem("admin_locked", "true");
      setLocked(true);
    }, 180000); // 3 minutes
  };

  // start immediately
  resetTimer();

  window.addEventListener("mousemove", resetTimer);
  window.addEventListener("keydown", resetTimer);
  window.addEventListener("click", resetTimer);

  return () => {
    clearTimeout(timeout);
    window.removeEventListener("mousemove", resetTimer);
    window.removeEventListener("keydown", resetTimer);
    window.removeEventListener("click", resetTimer);
  };
}, []);

  /* AUTO LOCK AFTER 2 MINUTES */
  function startInactivityTimer() {
    inactivityTimer = setTimeout(() => {
      localStorage.setItem("admin_locked", "true");
      setLocked(true);
    }, 120000); // 2 minutes
  }

  function resetTimer() {
    clearTimeout(inactivityTimer);
    startInactivityTimer();
  }

  /* MANUAL LOCK */
  function handleLock() {
    localStorage.setItem("admin_locked", "true");
    setLocked(true);
  }

  /* UNLOCK */
  async function handleUnlock() {
    setError("");

    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      setError("Session expired");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: data.user.email,
      password
    });

    if (error) {
      setError("Wrong password");
    } else {
      localStorage.setItem("admin_locked", "false");
      setLocked(false);
      setPassword("");
      resetTimer(); // restart timer
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

          <button onClick={handleLock} style={styles.lockBtn}>
            🔒
          </button>
        </div>
      </nav>

      {locked && (
        <div style={styles.overlay}>
          <div style={styles.lockBox}>
            <h2>🔒 Screen Locked</h2>

            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              style={styles.input}
            />

            <button onClick={handleUnlock} style={styles.unlockBtn}>
              Unlock
            </button>

            <p style={{color:"red"}}>{error}</p>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  nav:{width:"100%",background:"#000",padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center"},
  left:{display:"flex",alignItems:"center",gap:"12px"},
  logo:{height:"60px"},
  adminText:{color:"#e50914",fontSize:"20px",fontWeight:"700"},
  links:{display:"flex",gap:"20px",alignItems:"center"},
  link:{color:"white",textDecoration:"none"},
  lockBtn:{background:"#e50914",color:"white",border:"none",padding:"6px 10px",cursor:"pointer"},
  overlay:{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.97)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:9999},
  lockBox:{background:"#111",padding:"40px",borderRadius:"8px",textAlign:"center",width:"300px"},
  input:{marginTop:"15px",padding:"10px",width:"100%"},
  unlockBtn:{marginTop:"15px",padding:"10px",background:"#e50914",color:"white",border:"none",cursor:"pointer",width:"100%"}
};

export default AdminNavbar;