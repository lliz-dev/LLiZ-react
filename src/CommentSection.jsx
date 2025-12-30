import { useEffect, useState } from "react";
import getComments from "./js/GetComments.js";
import postComment from "./js/PostComment.js";
import deleteComment from "./js/DeleteComment.js";

function CommentSection({ blogId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState(null); // parent comment ID for replies
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        async function fetchComments() {
            const data = await getComments(blogId);
            setComments(data);
        }
        fetchComments();
    }, [blogId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const author = JSON.parse(sessionStorage.getItem('username')) || "Anonymous";
        const authorId = JSON.parse(sessionStorage.getItem('userid')) || "Anonymous";

        const commentData = {
            blogId,
            author,
            authorId,
            content: newComment,
            parentId: replyTo, // null if top-level comment
        };
console.log("Sending comment:", commentData);

        const savedComment = await postComment(commentData);
        if (savedComment) {
            setComments([...comments, savedComment]);
            setNewComment("");
            setReplyTo(null);
            alert("Comment posted successfully!");
        }
    };

    const handleDeleteComment = async (commentId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
        if (!confirmDelete) return;

        const result = await deleteComment(commentId);
        if (result) {
            setComments(comments.filter(c => c._id !== commentId));
            alert("Comment deleted successfully!");
        } else {
            alert("Failed to delete comment");
        }
    };

    const handleEditComment = (commentId, currentContent) => {
        setEditingCommentId(commentId);
        setEditContent(currentContent);
    };

    const handleSaveEdit = async (commentId) => {
        if (!editContent.trim()) {
            alert("Comment cannot be empty");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comments/${commentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({ content: editContent })
            });

            if (response.ok) {
                setComments(comments.map(c => 
                    c._id === commentId ? { ...c, content: editContent } : c
                ));
                setEditingCommentId(null);
                setEditContent("");
                alert("Comment updated successfully!");
            } else {
                alert("Failed to update comment");
            }
        } catch (err) {
            alert("Error updating comment: " + err.message);
        }
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditContent("");
    };

    const renderComments = (parentId = null, level = 0) => {
    const loggedInUserId = JSON.parse(sessionStorage.getItem('userid'));
    
    return comments
        .filter(c => String(c.parentId) === String(parentId))
        .map(c => {
            const parentComment = comments.find(p => String(p._id) === String(c.parentId));
            const replyingTo = parentComment ? parentComment.author : null;
            const isAuthor = String(c.authorId) === String(loggedInUserId);
            const isEditing = editingCommentId === c._id;

            // Adjust background for nested levels
            const bgColor = level === 0 ? "#f5f0ff" : `rgba(205, 153, 255, ${0.1 + level * 0.1})`;

            return (
                <div key={c._id} style={{ ...styles.comment, marginLeft: level * 20, backgroundColor: bgColor }}>
                    <div style={styles.commentHeader}>
                        <strong>{c.author}</strong>
                        <div style={styles.commentActions}>
                            {isAuthor && (
                                <>
                                    <button
                                        style={styles.editButton}
                                        onClick={() => handleEditComment(c._id, c.content)}
                                        title="Edit comment"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        style={styles.deleteButton}
                                        onClick={() => handleDeleteComment(c._id)}
                                        title="Delete comment"
                                    >
                                        🗑️
                                    </button>
                                </>
                            )}
                            {!isEditing && (
                                <button
                                    style={styles.replyButton}
                                    onClick={() => setReplyTo(c._id)}
                                >
                                    Reply
                                </button>
                            )}
                        </div>
                    </div>
                    {/* {replyingTo && <div style={styles.replyInfo}>Replying to {replyingTo}</div>} */}
                    {isEditing ? (
                        <div style={styles.editContainer}>
                            <textarea
                                style={styles.textarea}
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                            <div style={styles.editActions}>
                                <button 
                                    style={{ ...styles.postButton, fontSize: "0.8rem" }}
                                    onClick={() => handleSaveEdit(c._id)}
                                >
                                    Save
                                </button>
                                <button 
                                    style={{ ...styles.cancelButton, fontSize: "0.8rem" }}
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={styles.commentContent}>{c.content}</div>
                    )}
                    {!isEditing && renderComments(c._id, level + 1)}
                </div>
            );
        });
};


    const styles = {
        container: {
            padding: "20px",
            borderTop: "2px solid #ccc",
            marginTop: "20px",
            fontFamily: "Arial, sans-serif",
        },
        comment: {
            padding: "10px 15px",
            borderRadius: "10px",
            marginBottom: "10px",
            transition: "background 0.2s ease, box-shadow 0.2s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
        commentHeader: {
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
            alignItems: "center",
        },
        commentActions: {
            display: "flex",
            gap: "8px",
        },
        editButton: {
            backgroundColor: "transparent",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            padding: "0",
            transition: "transform 0.2s ease",
        },
        deleteButton: {
            backgroundColor: "transparent",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            padding: "0",
            transition: "transform 0.2s ease",
        },
        editContainer: {
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
        },
        editActions: {
            display: "flex",
            gap: "8px",
        },
        cancelButton: {
            backgroundColor: "#ccc",
            color: "#333",
            border: "none",
            borderRadius: "5px",
            padding: "2px 8px",
            cursor: "pointer",
        },
        replyButton: {
            backgroundColor: "blueviolet",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "2px 8px",
            fontSize: "0.8rem",
            cursor: "pointer",
        },
        commentContent: {
            fontSize: "0.95rem",
            color: "#333",
            lineHeight: "1.4",
        },
        textarea: {
            width: "100%",
            minHeight: "60px",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "10px",
            fontSize: "1rem",
        },
        postButton: {
            backgroundColor: "blueviolet",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.95rem",
        },
        replyInfo: {
            fontStyle: "italic",
            fontSize: "0.85rem",
            color: "#555",
            marginBottom: "5px",
        }
    };

    return (
        <div style={styles.container}>
            <h3>Comments ({comments.length})</h3>
            {comments.length === 0 && <p>No comments yet. Be the first to comment!</p>}
            <form onSubmit={handleSubmit}>
                {replyTo && (
                    <p style={styles.replyInfo}>
                        Replying to {comments.find(c => c._id === replyTo)?.author}{" "}
                        <button type="button" onClick={() => setReplyTo(null)}>Cancel</button>
                    </p>
                )}
                <textarea
                    style={styles.textarea}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                />
                <button type="submit" style={styles.postButton}>
                    Post Comment
                </button>
            </form>

<br></br>
            {renderComments()} 
        </div>
    );
}

export default CommentSection;
