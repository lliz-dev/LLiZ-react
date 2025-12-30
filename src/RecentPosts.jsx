import { useEffect, useState } from "react";
import getBlogs from "./js/GetBlogs.js";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import './styles/RecentPosts.css';

function RecentPosts() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    function stripHtml(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}


    useEffect(() => {
        async function fetchBlogs() {
            console.log("Fetching blogs...");
            try {
                const data = await getBlogs();
                if (!data) {
                    throw new Error("Failed to fetch blogs. Please check your connection.");
                }
                setBlogs(data);
            } catch (error) {
                console.error("Error during fetch:", error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchBlogs();
    }, []);

    console.log("Loading state:", loading);
    console.log("Error state:", error);
    console.log("Blogs state:", blogs);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!blogs || blogs.length === 0) return <div>No blogs found.</div>;

    const recentBlogs = blogs.slice(0, 3);

    const handleClick = (blog) => {
        navigate(`/posts/${blog._id}`);
    };

    return (
        <>
            <h2>Recent Posts</h2>
            <div className="recentPostsContainer">
                {recentBlogs.length > 0 ? (
                    recentBlogs.map((blog) => {
                        const likeCount = blog.likes ? blog.likes.length : 0;
                        const dislikeCount = blog.dislikes ? blog.dislikes.length : 0;
                        
                        return (
                            <Card className="recentpost" key={blog._id} onClick={() => handleClick(blog)} style={{ position: "relative" }}>
                                <Card.Body>
                                    <Card.Title>{blog.title}</Card.Title>
                                    <Card.Text>    {stripHtml(blog.content).slice(0, 150) + (blog.content.length > 150 ? "..." : "")}</Card.Text>
                                </Card.Body>
                                <div style={{
                                    position: "absolute",
                                    bottom: "10px",
                                    right: "10px",
                                    display: "flex",
                                    gap: "12px",
                                    fontSize: "0.9rem",
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                }}>
                                    <span>👍 {likeCount}</span>
                                    <span>👎 {dislikeCount}</span>
                                </div>
                            </Card>
                        );
                    })
                ) : (
                    <Card className="recentpost">
                        <Card.Body>
                            <Card.Title>No recent posts.</Card.Title>
                        </Card.Body>
                    </Card>
                )}
            </div>
        </>
    );
}

export default RecentPosts;
