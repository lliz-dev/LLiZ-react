import sessionHandler from "./setUserSession.js";

async function postUser(userData) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/users/login`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_name: userData.user_name, // send the username
                user_password: userData.user_password, // send the plain-text password
            }),
        });

        if (!response.ok) {
            throw new Error("Invalid login credentials.");
        }

        const data = await response.json();
        console.log(data);
        // Handle session
        sessionHandler(
            data.user.user_name,
            data.user.user_id,
            data.user.role,
            data.user.user_email,
            data.token,
            data.refreshToken); // Save session (e.g., JWT or user data)
        return data
    } catch (error) {
        console.error("Login failed:", error);
    }
}

export default postUser;
