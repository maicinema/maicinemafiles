import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase";

function CreateAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSubscribeFlow = location.state?.type === "subscribe";

  const [isLoginMode, setIsLoginMode] = useState(false);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLoginMode) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      if (isSubscribeFlow) {
        navigate("/subscribe");
      } else {
        navigate("/");
      }

      setLoading(false);
      return;
    }

    const passwordRule =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRule.test(password)) {
      alert(
        "Password must contain:\n\n• Minimum 8 characters\n• One uppercase letter\n• One lowercase letter\n• One number\n• One special character"
      );
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          age
        }
      }
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (isSubscribeFlow) {
      navigate("/subscribe");
    } else {
      navigate("/");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1>{isLoginMode ? "Log In to Your Account" : "Create Your Account"}</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        {!isLoginMode && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />

            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={styles.input}
              required
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <div style={styles.passwordContainer}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.passwordInput}
            required
          />

          <button
            type="button"
            style={styles.eyeButton}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        {!isLoginMode && (
          <p style={styles.passwordHint}>
            Password must be at least 8 characters and include uppercase,
            lowercase, number and special character.
          </p>
        )}

        <button style={styles.button} disabled={loading}>
          {loading
            ? isLoginMode
              ? "Logging in..."
              : "Creating account..."
            : isLoginMode
            ? "Log In"
            : "Continue"}
        </button>
      </form>

      <p
        style={styles.switchText}
        onClick={() => setIsLoginMode(!isLoginMode)}
      >
        {isLoginMode
          ? "Don't have an account? Create one"
          : "Already have an account? Log in"}
      </p>
    </div>
  );
}

const styles = {
  container: {
    background: "#000",
    color: "white",
    minHeight: "100vh",
    paddingTop: "120px",
    textAlign: "center"
  },

  form: {
    width: "320px",
    margin: "40px auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  input: {
    padding: "12px",
    border: "none"
  },

  passwordContainer: {
    display: "flex",
    alignItems: "center"
  },

  passwordInput: {
    padding: "12px",
    border: "none",
    flex: "1"
  },

  eyeButton: {
    background: "#111",
    border: "none",
    color: "white",
    padding: "0 12px",
    cursor: "pointer",
    fontSize: "16px"
  },

  passwordHint: {
    fontSize: "12px",
    color: "#aaa"
  },

  button: {
    background: "#e50914",
    border: "none",
    color: "white",
    padding: "14px",
    cursor: "pointer"
  },

  switchText: {
    marginTop: "20px",
    color: "#ccc",
    cursor: "pointer",
    fontSize: "14px"
  }
};

export default CreateAccount;