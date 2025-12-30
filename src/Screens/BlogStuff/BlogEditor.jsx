import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "../../Editor.jsx";
import BlogTagSelector from "./BlogTagSelector.jsx";

function BlogEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loggedInUserId = JSON.parse(sessionStorage.getItem('userid'));

    useEffect(() => {
        async function fetchBlog() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`);
                const data = await response.json();

                // Check if user is the author
                if (String(data.authorId) !== String(loggedInUserId)) {
                    setError("You are not authorized to edit this post");
                    setLoading(false);
                    return;
                }

                setTitle(data.title);
                setContent(data.content);
                setTags(data.tags || []);
                setLoading(false);
            } catch (err) {
                setError("Failed to load blog post");
                setLoading(false);
            }
        }

        fetchBlog();
    }, [id, loggedInUserId]);

    const handleTitleChange = (event) => setTitle(event.target.value);
    const handleContentChange = (value) => setContent(value);
    const handleTagChange = (selectedTags) => setTags(selectedTags);

    const submitBlog = async (event) => {
        event.preventDefault();

        if (tags.length === 0) {
            alert("Please select at least one tag before submitting the blog.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                     "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({ title, content, tags,authorId:loggedInUserId })
            });

            if (response.ok) {
                alert("Blog updated successfully!");
                navigate(`/posts/${id}`);
            } else {
                alert("Failed to update blog");
            }
        } catch (err) {
            alert("Error updating blog: " + err.message);
        }
    };

    if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;
    if (error) return <div style={{ padding: "20px", color: "red" }}>{error}</div>;

    return (
        <div style={{ maxWidth: "900px", margin: "20px auto", padding: "30px 20px", backgroundColor: "#f9f9ff", borderRadius: "12px", boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}>
            <h1>Edit Blog Post</h1>
            <form onSubmit={submitBlog} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                <input 
                    type="text" 
                    value={title} 
                    onChange={handleTitleChange} 
                    placeholder="Title goes here" 
                    style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #ccc" }} 
                />
                <BlogTagSelector onTagChange={handleTagChange} initialTags={tags} />
                <Editor value={content} onChange={handleContentChange} />
                <div style={{ display: "flex", gap: "10px" }}>
                    <button 
                        type="submit" 
                        style={{ backgroundColor: "blueviolet", color: "white", borderRadius: "8px", padding: "12px 25px", border: "none", cursor: "pointer", fontWeight: "bold" }}
                    >
                        Save Changes
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate(`/posts/${id}`)}
                        style={{ backgroundColor: "#ccc", color: "#333", borderRadius: "8px", padding: "12px 25px", border: "none", cursor: "pointer", fontWeight: "bold" }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BlogEditor;
