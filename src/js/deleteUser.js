const deleteUser = async (userId, userData) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/edit/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Include token if required
            },
            body: JSON.stringify({
                user_email: userData.userEmail,
                user_name: userData.userName,
                user_password: userData.userPassword,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            return result.message; // Successfully deleted
        } else {
            throw new Error(result.error || 'Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        return null;
    }
};

export default deleteUser;
