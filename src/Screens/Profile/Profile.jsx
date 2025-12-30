import "../../styles/Profile.css";
import {Link, useNavigate} from "react-router-dom";

function Profile() {
    const email = sessionStorage.getItem('email');
    const username = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');
    const navigate = useNavigate();

    // If no username is set in sessionStorage, show login link
    if (!username) {
        return (
            <div className="profile-container">
                <h1><Link to={'/login'}>Login to view your profile</Link></h1>
            </div>
        );
    }

    const logout = () => {
        sessionStorage.clear();
        alert("You have logged out.");
        navigate("/");
    }

    const deleteAcc = () =>{
        navigate("/deleteAccount");
    }

    const edit = () =>{
        navigate("/editprofile");
    }

    const changeEmail = () =>{
        navigate("/change-email");
    }

    const forgotPassword = () =>{
        navigate("/forgot-password");
    }
    
    return (
        <div className="profile-container">
            <div className="profile-header">
                <img
                    className="profile-picture"
                    src="/profile.png" // Placeholder image
                    alt={`${username}'s profile`}
                />
                <h1 className="profile-username">{username}</h1>
                <p className="profile-role">{email}</p>
                <p className="profile-role">{role}</p>
            </div>

            <div className="profile-actions">
                {/* <p>
                    <button className="btn-edit" onClick={edit}>Edit Profile</button>
                </p> */}

                <p>
                    <button className="btn-edit" onClick={changeEmail}>Change Email</button>
                </p>

                <p>
                    <button className="btn-edit" onClick={forgotPassword}>Change Password</button>
                </p>

                <p>
                    <button className="btn-delete" onClick={deleteAcc}>Delete Account</button>
                </p>

                <p>
                    <button className="btn-logout" onClick={logout}>Log Out</button>
                </p>

            </div>
        </div>
    );
}

export default Profile;