import { useState } from "react";
import { useNavigate } from "react-router-dom";
  
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/forgotpswd/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert(data.message);
      setMessage(data.message);

      navigate("/login");

    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>
        <p style={styles.subtitle}>
          Enter your email to receive a password reset link
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Send Reset Link
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
    color: "#000000ff",
  },
  title: {
    marginBottom: "0.5rem",
    fontSize: "1.6rem",
    fontWeight: "600",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#000000ff",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    color: "#000000ff",
    outline: "none",
    fontSize: "0.95rem",
  },
  button: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "none",
    background: "blueviolet",
    color: "#fff",
    fontSize: "0.95rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  message: {
    marginTop: "1rem",
    fontSize: "0.9rem",
    color: "#22c55e",
    textAlign: "center",
  },
};
