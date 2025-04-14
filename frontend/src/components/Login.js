import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate("/projects"); // Redirect to dashboard
    } else {
      alert(result.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>Welcome Back</h2>
        <p style={styles.subtext}>Log in to continue</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
        <p style={styles.switchText}>
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            style={styles.linkButton}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(to right, #74ebd5, #ACB6E5)",
  },
  formBox: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
  },
  heading: {
    marginBottom: "10px",
    fontSize: "28px",
    color: "#333",
  },
  subtext: {
    marginBottom: "30px",
    color: "#666",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  switchText: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#333",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
    padding: 0,
    fontSize: "14px",
  },
};

