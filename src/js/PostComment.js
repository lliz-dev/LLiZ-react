async function postComment(commentData) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        });

        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error("Error posting comment:", error);
        console.error("COMMENT SAVE ERROR:", error);
        return null;
    }
}

export default postComment;
