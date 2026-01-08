import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import '../../styles/BlogPage.css';
import parse from 'html-react-parser';
import CommentSection from "../../CommentSection.jsx";
import LikeDislike from "../../LikeBtn.jsx";

function BlogPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [tags,setTags] = useState([]);

    useEffect(() => {
        async function fetchBlog() {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`);
            const data = await response.json();
            setBlog(data);
            setTags(data.tags.map(tag => tag));
            console.log(data);
        }

        fetchBlog();
    }, [id]);

    const handleDeleteBlog = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({authorId:loggedInUserId })
            });

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

    if (!blog) return <div>Loading...</div>;

    const loggedInUserId = JSON.parse(sessionStorage.getItem('userid'));
    const isAuthor = String(blog.authorId) === String(loggedInUserId);

    const styles = {
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
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
            display: "inline-block",
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
        buttonGroup: {
            display: "flex",
            gap: "10px",
        },
    };

    return (
        <div style={{padding: 20}}>
            <div style={styles.header}>
                <h1 style={{ margin: 0 }}>{blog.title}</h1>
                {isAuthor && (
                    <div style={styles.buttonGroup}>
                        <Link to={`/edit/${id}`} style={styles.editButton}>
                            Edit Post
                        </Link>
                        <button onClick={handleDeleteBlog} style={styles.deleteButton}>
                            Delete Post
                        </button>
                    </div>
                )}
            </div>
            <div>
                <p className={"createdBy"}>By {blog.author}</p>
                <div className={"tags"}>
                    {
                        tags.map(function (currentTag, index) {
                            return (<div key={index} className={"blogTag"}>{currentTag.tag_name}</div>)
                        })
                    }
                </div>
                <div>
                    {parse(blog.content)}
                </div>
            </div>
            <br/>
            <br/>
            <LikeDislike blogId={id} authorId={blog.authorId} initialLikes={blog.likes?.length || blog.likes || 0} />

            <CommentSection blogId={id} />
        </div>
    );
}
export default BlogPage;