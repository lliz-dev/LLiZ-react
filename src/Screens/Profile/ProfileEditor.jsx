import { useState } from "react";
import { useNavigate } from "react-router-dom";
import editUser from "../../js/EditUser.js";

function ProfileEditor() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState(sessionStorage.getItem("userid")); // Assuming userId is stored in sessionStorage
    const navigate = useNavigate();

    const handleChangeEmail = (event) => setEmail(event.target.value);
    const handleChangeUsername = (event) => setUsername(event.target.value);
    const handleChangePassword = (event) => setPassword(event.target.value);

    const formSubmit = async (event) => {
        event.preventDefault();

        const userData = {
            userId: userId,
            userEmail: email,
            userName: username,
            userPassword: password
        };

        const message = await editUser(userData);

        if (message) {
            alert('Details updated!');

            navigate('/profile'); // Redirect after successful update
        } else {
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className={"content"}>
            <h1>Edit Profile</h1>
            <form onSubmit={formSubmit}>
                <p>
                    <input
                        className={"formInput"}
                        type={"email"}
                        placeholder={"Email goes here"}
                        value={email}
                        onChange={handleChangeEmail}
                    />
                </p>

                <p>
                    <input
                        className={"formInput"}
                        type={"text"}
                        placeholder={"Username goes here"}
                        value={username}
                        onChange={handleChangeUsername}
                    />
                </p>

                <p>
                    <input
                        className={"formInput"}
                        type={"password"}
                        placeholder={"Password goes here"}
                        value={password}
                        onChange={handleChangePassword}
                    />
                </p>

                <p>
                    <input className={"formInputSubmit"} type={"submit"} value={"Save Details"} />
                </p>
            </form>
        </div>
    );
}

export default ProfileEditor;
