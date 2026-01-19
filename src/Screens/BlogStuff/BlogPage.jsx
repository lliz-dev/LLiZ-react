import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import '../../styles/BlogPage.css';
import parse from 'html-react-parser';
import CommentSection from "../../CommentSection.jsx";
import LikeDislike from "../../LikeBtn.jsx";
import { Helmet } from "react-helmet-async";

function BlogPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [tags, setTags] = useState([]);
    const [showSharePopup, setShowSharePopup] = useState(false);

    const loggedInUserId = JSON.parse(sessionStorage.getItem('userid'));
    const shareUrl = window.location.href;

    useEffect(() => {
        async function fetchBlog() {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/blogs/${id}`
            );
            const data = await response.json();
            setBlog(data);
            setTags(data.tags || []);
        }

        fetchBlog();
    }, [id]);

    const handleDeleteBlog = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this blog post? This action cannot be undone."
        );
        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/blogs/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ authorId: loggedInUserId })
                }
            );

            if (response.ok) {
                alert("Blog post deleted successfully!");
                navigate("/posts");
            } else {
                alert("Failed to delete blog post");
            }
        } catch (err) {
            alert("Error deleting blog: " + err.message);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert("Link copied to clipboard!");
            setShowSharePopup(false);
        } catch {
            alert("Failed to copy link");
        }
    };

    if (!blog) return <div>Loading...</div>;

    const isAuthor = String(blog.authorId) === String(loggedInUserId);

    const styles = {
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            gap: "10px",
        },
        buttonGroup: {
            display: "flex",
            gap: "10px",
        },
        editButton: {
            backgroundColor: "blueviolet",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
            textDecoration: "none",
        },
        deleteButton: {
            backgroundColor: "#dc3545",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
        },
        shareButton: {
            backgroundColor: "#222",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
        },
        overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
        },
        popup: {
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            width: "100%",
            maxWidth: "400px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        },
        popupHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
        },
        copyInput: {
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
        },
        closeBtn: {
            background: "none",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
        },
        copyBtn: {
            width: "100%",
            backgroundColor: "blueviolet",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
        },
    };

   return (
    <>
    <Helmet>
    <title>{blog.title} | YourSiteName</title>
    <meta
        name="description"
        content={blog.excerpt || blog.content.replace(/<[^>]+>/g, '').slice(0, 160)}
    />
    <link rel="canonical" href={shareUrl} />
    </Helmet>

    <article style={{ padding: 20 }}>
        {/* SEO Header */}
        <header style={styles.header}>
            <h1 style={{ margin: 0 }}>{blog.title}</h1>

            <div style={styles.buttonGroup}>
                <button
                    style={styles.shareButton}
                    onClick={() => setShowSharePopup(true)}
                >
                    Share
                </button>

                {isAuthor && (
                    <>
                        <Link to={`/edit/${id}`} style={styles.editButton}>
                            Edit Post
                        </Link>
                        <button
                            onClick={handleDeleteBlog}
                            style={styles.deleteButton}
                        >
                            Delete Post
                        </button>
                    </>
                )}
            </div>
        </header>

        {/* Author + Meta Info */}
        <p className="createdBy">
            By <strong>{blog.author}</strong>
        </p>

        {/* Tags = internal links */}
        <div className="tags">
            {tags.map((tag, index) => (
                <span key={index} className="blogTag">
                    {tag.tag_name}
                </span>
            ))}
        </div>


        {/* Blog content */}
        <section>
            {parse(blog.content)}
        </section>

        <br />

        {/* Engagement */}
        <LikeDislike
            blogId={id}
            authorId={blog.authorId}
            initialLikes={blog.likes?.length || blog.likes || 0}
        />

        <CommentSection blogId={id} />

        {/* Share Popup */}
        {showSharePopup && (
            <div
                style={styles.overlay}
                onClick={() => setShowSharePopup(false)}
            >
                <div
                    style={styles.popup}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div style={styles.popupHeader}>
                        <h3 style={{ margin: 0 }}>Share this post</h3>
                        <button
                            style={styles.closeBtn}
                            onClick={() => setShowSharePopup(false)}
                        >
                            ✕
                        </button>
                    </div>

                    <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        style={styles.copyInput}
                    />

                    <button
                        style={styles.copyBtn}
                        onClick={handleCopyLink}
                    >
                        Copy Link
                    </button>
                </div>
            </div>
        )}
    </article>
    </>  
);

}

export default BlogPage;
