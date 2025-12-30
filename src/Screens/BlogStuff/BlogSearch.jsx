import { useState } from "react";

export default function BlogSearch({ blogs, onResults }) {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        const filtered = blogs.filter((blog) => {
            const search = query.toLowerCase();
            return (
                blog.title?.toLowerCase().includes(search) ||
                blog.content?.toLowerCase().includes(search) ||
                blog.author?.toLowerCase().includes(search)
            );
        });
        onResults(filtered);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div style={styles.container}>
            <input
                type="text"
                placeholder="Search posts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                style={styles.input}
            />
            <button onClick={handleSearch} style={styles.button}>
                Search
            </button>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "0 20px 20px",
    },
    input: {
        flex: 1,
        padding: "10px 12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
    },
    button: {
        padding: "10px 20px",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "#4f46e5",
        color: "#fff",
        fontSize: "14px",
        cursor: "pointer",
    },
};
