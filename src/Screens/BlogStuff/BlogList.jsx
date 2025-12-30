import { useEffect, useState } from "react";
import getBlogs from "../../js/GetBlogs.js";
import getTags from "../../js/GetTags.js";
import { Link } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

function BlogList() {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);

    // Fetch blogs
    useEffect(() => {
        async function fetchBlogs() {
            try {
                const data = await getBlogs();
                if (data) {
                    setBlogs(data);
                    setFilteredBlogs(data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchBlogs();
    }, []);

    // Fetch tags
    useEffect(() => {
        async function fetchTags() {
            try {
                const tags = await getTags();
                setAvailableTags(tags && tags.length ? tags : fallbackTags);
            } catch {
                setAvailableTags(fallbackTags);
            }
        }
        fetchTags();
    }, []);

    const fallbackTags = [
        { tag_name: "Grammar" },
        { tag_name: "Pronunciation" },
        { tag_name: "Culture" },
        { tag_name: "History" },
        { tag_name: "Vocabulary" },
        { tag_name: "Conversation" },
    ];

    // Filter blogs
    useEffect(() => {
        let filtered = [...blogs];

        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((blog) =>
                blog.title?.toLowerCase().includes(query) ||
                blog.content?.toLowerCase().includes(query) ||
                blog.author?.toLowerCase().includes(query)
            );
        }

        if (selectedTags.length > 0) {
            filtered = filtered.filter((blog) => {
                const blogTags = blog.tags?.map((t) => t.tag_name) || [];
                return selectedTags.every((tag) => blogTags.includes(tag));
            });
        }

        setFilteredBlogs(filtered);
    }, [searchQuery, selectedTags, blogs]);

    if (loading) return <div style={styles.loading}>Loading...</div>;
    if (error) return <div style={styles.loading}>Error: {error}</div>;

    return (
        <div style={styles.page}>
            <h1 style={styles.heading}>Posts</h1>

            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <TagSelector
                availableTags={availableTags}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
            />

            <ul style={styles.container}>
                {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                        <BlogCard key={blog._id} blog={blog} />
                    ))
                ) : (
                    <p style={{ paddingLeft: "20px" }}>No posts found.</p>
                )}
            </ul>
        </div>
    );
}

// ------------------ LOCAL COMPONENT: SEARCH BAR ------------------

function SearchBar({ searchQuery, setSearchQuery }) {
    const handleSearchClick = () => {};
    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSearchClick();
    };

    return (
        <div style={styles.searchContainer}>
            <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                style={styles.searchInput}
            />
            <button style={styles.searchButton} onClick={handleSearchClick}>
                Search
            </button>
        </div>
    );
}

// ------------------ LOCAL COMPONENT: TAG SELECTOR ------------------

function TagSelector({ availableTags, selectedTags, setSelectedTags }) {
    const handleTagClick = (tagName) => {
        const newTags = [...selectedTags];
        if (newTags.includes(tagName)) {
            setSelectedTags(newTags.filter((t) => t !== tagName));
        } else {
            newTags.push(tagName);
            setSelectedTags(newTags);
        }
    };

    const clearAll = () => setSelectedTags([]);

    return (
        <div style={styles.tagContainer}>
            <button style={styles.clearButton} onClick={clearAll}>
                Clear All
            </button>
            {availableTags.map((tag, i) => {
                const selected = selectedTags.includes(tag.tag_name);
                return (
                    <div
                        key={i}
                        style={{
                            ...styles.tag,
                            ...(selected ? styles.tagSelected : {}),
                        }}
                        onClick={() => handleTagClick(tag.tag_name)}
                    >
                        {tag.tag_name}
                    </div>
                );
            })}
        </div>
    );
}

// ------------------ LOCAL COMPONENT: BLOG CARD ------------------

function BlogCard({ blog }) {
    const [hover, setHover] = useState(false);
    const [userReaction, setUserReaction] = useState(null); // 'like' | 'dislike' | null
    const likeCount = blog.likes?.length || 0;
    const dislikeCount = blog.dislikes?.length || 0;

    function stripHtml(html) {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    const toggleReaction = (type) => {
        setUserReaction(prev => (prev === type ? null : type));
        // optionally update likes/dislikes counts here if you want
    };

    const buttonStyle = (isActive) => ({
        backgroundColor: isActive ? "blueviolet" : "#f0f0f0",
        border: "none",
        padding: "4px 8px",
        borderRadius: "6px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        color: "black", // always keep icon black
        fontSize: "0.9rem"
    });

    return (
        <li
            style={hover ? { ...styles.card, ...styles.cardHover } : styles.card}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Link
                to={`/posts/${blog._id}`}
                style={{ textDecoration: "none", display: "flex", flexDirection: "column", height: "100%" }}
            >
                <div style={styles.title}>{blog.title}</div>
                <div style={styles.preview}>
                    {stripHtml(blog.content).slice(0, 150) + (blog.content.length > 150 ? "..." : "")}
                </div>
            </Link>
            <div style={styles.footer}>
                <button style={buttonStyle(userReaction === "like")} onClick={() => toggleReaction("like")}>
                    <FaThumbsUp /> {likeCount}
                </button>
                <button style={buttonStyle(userReaction === "dislike")} onClick={() => toggleReaction("dislike")}>
                    <FaThumbsDown /> {dislikeCount}
                </button>
            </div>
        </li>
    );
}

// ------------------ STYLES ------------------

const styles = {
    page: { padding: "20px", fontFamily: "Arial, sans-serif", color: "#000" },
    heading: { marginBottom: "20px" },
    loading: { padding: "20px", color: "#000" },
    container: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px",
        listStyle: "none",
    },
    card: {
        backgroundColor: "#f8f9fa",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
        cursor: "pointer",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        color: "#000",
    },
    cardHover: {
        transform: "translateY(-5px)",
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    },
    title: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "10px", color: "#000" },
    preview: { fontSize: "1rem", color: "#000", flex: "1", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" },
    footer: { marginTop: "15px", display: "flex", alignItems: "center", gap: "15px", color: "#000" },
    likeIcon: { fontSize: "1.2rem", cursor: "pointer" },
    likeCount: { fontSize: "0.95rem", color: "#000" },

    // Search bar
    searchContainer: { display: "flex", gap: "10px", marginBottom: "20px" },
    searchInput: { flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #ccc", color: "#000" },
    searchButton: { padding: "10px 20px", borderRadius: "8px", border: "none", backgroundColor: "blueviolet", color: "#fff", cursor: "pointer" },

    // Tags
    tagContainer: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" },
    tag: { padding: "6px 12px", borderRadius: "16px", backgroundColor: "#ce9affff", cursor: "pointer", transition: "all 0.2s ease", fontSize: "0.85rem", color: "#000" },
    tagSelected: { backgroundColor: "blueviolet", color: "#fff" },
    clearButton: { padding: "5px 10px", borderRadius: "8px", border: "none", backgroundColor: "#a54a4aff", color: "#fff", cursor: "pointer", marginBottom: "10px", fontSize: "0.85rem" },
};


export default BlogList;
