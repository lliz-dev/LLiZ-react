import { useState } from "react";
import { sendEmail, alterEmail } from "./EmailFunctions";
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
    if (response) {
      setEmailSent(true);
    }
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
    console.log("Submitted code:", finalCode);
    
    const emailData = {
      code: finalCode,
      newEmail: newEmail,
      userId: JSON.parse(sessionStorage.getItem("userid")),
    };

    console.log(emailData);

    const response = await alterEmail(emailData);

    if (response) {
      alert("Email changed successfully. Please log in again.");
      sessionStorage.clear();
      navigate("/profile");
    }

  };

  return (
    <div>
      <h1>Change Email</h1>

      {!emailSent ? (
        <button className="btn-edit" onClick={changeEmail}>
          Send Email
        </button>
      ) : (
        <>
          <p>Enter the 4-digit code sent to your email and the new email address.</p>
            <p>New Email:</p>
           <p>
            <input
              type="email"
              placeholder="New Email Address" onChange={(e) => setNewEmail(e.target.value)}></input>
           </p>

          <div style={{ display: "flex", gap: "10px" }}>
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                style={{
                  width: "40px",
                  height: "40px",
                  fontSize: "20px",
                  textAlign: "center",
                }}
              />
            ))}
          </div>

            <br/>
        <p>
           <button className="btn-edit" onClick={handleSubmitCode}>
            Verify Code
          </button>
        </p>

        </>
      )}
    </div>
  );
}
