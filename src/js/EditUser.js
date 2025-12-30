import setUpdatedSession from "./setUpdatedSession.js";
import {useNavigate} from "react-router-dom";

const editUser = async (userData) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/edit/${userData.userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify({
                user_id: userData.userId,
                user_email: userData.userEmail,
                user_name: userData.userName,
                user_password: userData.userPassword
            })
        });

        const result = await response.json();

        setUpdatedSession(
            result.user.user_name,
            result.user.user_id,
            result.user.user_email
        )

        if (response.ok) {
            return result.message;
        } else {
            if (response.status === 401) {
                // Handle token expiration
                alert('Session expired. Please log in again.');
                window.location.href = '/login';  // Redirect to login page
                return;
            }
            const error = await response.json();
            throw new Error(error.message || 'Something went wrong');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        return null;
    }
};

export default editUser