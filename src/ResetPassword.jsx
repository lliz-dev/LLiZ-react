import { useState } from "react";
import { useParams } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/forgotpswd/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid or expired link");
      }

      alert(data.message);
      setMessage(data.message);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Password</h2>
        <p style={styles.subtitle}>
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Resetting..." : "Reset Password"}
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
    background: "#f5f5f7",
  },

  card: {
    width: "100%",
    maxWidth: "400px",
    borderRadius: "14px",
    padding: "2rem",
    background: "#ffffff",
    boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
    color: "#111827",
  },

  title: {
    marginBottom: "0.25rem",
    fontSize: "1.6rem",
    fontWeight: "600",
  },

  subtitle: {
    fontSize: "0.9rem",
    color: "#6b7280",
    marginBottom: "1.75rem",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  input: {
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "0.95rem",
    color: "#111827",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },

  button: {
    padding: "0.8rem",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    color: "#fff",
    fontSize: "0.95rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "transform 0.1s ease, box-shadow 0.2s ease",
    boxShadow: "0 6px 14px rgba(124,58,237,0.35)",
  },

  message: {
    marginTop: "1rem",
    fontSize: "0.9rem",
    color: "#16a34a",
    textAlign: "center",
  },
};
