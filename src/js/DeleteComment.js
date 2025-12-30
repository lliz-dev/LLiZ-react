const deleteComment = async (commentId) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
                        },
        });

        const result = await response.json();

        if (response.ok) {
            return result.message; // Successfully deleted
        } else {
            throw new Error(result.error || 'Failed to delete comment');
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        return null;
    }
};

export default deleteComment;
