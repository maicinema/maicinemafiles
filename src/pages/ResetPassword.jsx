import { useState } from "react";
import { supabase } from "../lib/supabase";

function ResetPassword() {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleReset(e) {
  e.preventDefault();

  if (password !== confirmPassword) {
    setMessage("Passwords do not match");
    return;
  }

  setLoading(true);

  const { error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) {
    setMessage(error.message);
  } else {
    setMessage("✅ Password updated successfully");

    // ✅ FORCE FULL RESET
    setPassword("");
    setConfirmPassword("");

    // ✅ EXTRA: clear browser autofill
    document.querySelectorAll("input").forEach(input => input.value = "");
  }

  setLoading(false);
}

  return (
    <div style={styles.page}>

      <div style={styles.box}>
        <h2 style={{ marginBottom: "20px" }}>Reset Password</h2>

        <form onSubmit={handleReset}>

          {/* NEW PASSWORD */}
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eye}
            >
              👁
            </span>
          </div>

          {/* CONFIRM PASSWORD */}
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button style={styles.button} disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>

        </form>

        <p style={{ marginTop: "15px" }}>{message}</p>

      </div>

    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#000",
    color: "white"
  },
  box: {
    width: "320px",
    padding: "40px",
    background: "#111",
    borderRadius: "8px"
  },
  input: {
    display: "block",
    marginBottom: "12px",
    padding: "10px",
    width: "100%"
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#e50914",
    color: "white",
    border: "none",
    cursor: "pointer"
  },
  eye: {
    position: "absolute",
    right: "10px",
    top: "10px",
    cursor: "pointer"
  }
};

export default ResetPassword;