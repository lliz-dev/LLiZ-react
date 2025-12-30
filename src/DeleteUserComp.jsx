import deleteUser from "./js/deleteUser.js";
import {useState} from "react";
import './styles/Form.css'
import {useNavigate} from "react-router-dom";

function DeleteUserComponent() {
    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!userEmail || !userName || !userPassword) {
            alert("Please fill in all fields");
            return;
        }

        const userData = {
            userEmail,
            userName,
            userPassword,
        };

        const userId = sessionStorage.getItem('userid');
        const message = await deleteUser(userId, userData);
        if (message) {
            sessionStorage.clear();
            alert(message); // Show success message
            navigate('/')
        } else {
            alert("Failed to delete user. Please try again.");
        }
    };

    return (
        <div>

            <h2>Delete User</h2>
            <p>
                <input
                    type="email"
                    placeholder="User Email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                />
            </p>

            <p>
                <input
                    type="text"
                    placeholder="User Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
            </p>

            <p>
                <input
                    type="password"
                    placeholder="User Password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                />
            </p>
                <button onClick={handleDelete}>Delete User</button>
        </div>
);
}

export default DeleteUserComponent;
