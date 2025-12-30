import { useState } from "react";
import { sendEmail, alterEmail } from "../../js/EmailFunctions.js";
import { useNavigate } from "react-router-dom";

export default function ChangeEmail() {
  const userEmail = JSON.parse(sessionStorage.getItem("email"));
  const navigate = useNavigate();

  const [newEmail, setNewEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [code, setCode] = useState(["", "", "", ""]);

  const changeEmail = async () => {
    if (!userEmail) {
      alert("No email found. Please log in again.");
      navigate("/login");
      return;
    }

    const response = await sendEmail(userEmail);
    if (response) setEmailSent(true);
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  const handleSubmitCode = async () => {
    const finalCode = code.join("-");

    const emailData = {
      code: finalCode,
      newEmail,
      userId: JSON.parse(sessionStorage.getItem("userid")),
    };

    const response = await alterEmail(emailData);
    if (response) {
      sessionStorage.clear();
      navigate("/profile");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Change Email</h1>

        {!emailSent ? (
          <>
            <p style={styles.subtitle}>
              We’ll send a verification code to your current email.
            </p>
            <button style={styles.button} onClick={changeEmail}>
              Send Verification Email
            </button>
          </>
        ) : (
          <>
            <p style={styles.subtitle}>
              Enter the 4-digit code and your new email address.
            </p>

            <label style={styles.label}>New Email</label>
            <input
              type="email"
              placeholder="new@email.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              style={styles.emailInput}
            />

            <div style={styles.codeContainer}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  style={styles.codeInput}
                />
              ))}
            </div>

            <button style={styles.button} onClick={handleSubmitCode}>
              Verify & Update Email
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fb",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
    textAlign: "center",
  },
  title: {
    marginBottom: "10px",
    fontSize: "24px",
    fontWeight: "600",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  label: {
    display: "block",
    textAlign: "left",
    fontSize: "14px",
    marginBottom: "6px",
  },
  emailInput: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  codeContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "20px",
  },
  codeInput: {
    width: "50px",
    height: "50px",
    textAlign: "center",
    fontSize: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "blueviolet",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
  },
};
