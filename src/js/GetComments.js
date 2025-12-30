// GetComments.js
async function getComments(blogId) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comments/blog/${blogId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            return await response.json();
        } 
        return [];
    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
}

export default getComments;
