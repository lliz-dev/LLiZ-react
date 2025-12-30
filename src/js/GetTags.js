async function getTags() {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/tags`; // Make sure this matches your backend route
        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default getTags;
