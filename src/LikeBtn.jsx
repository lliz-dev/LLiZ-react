import { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

function LikeDislike({ blogId, userId, authorId }) {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userReaction, setUserReaction] = useState(null); // 'like' | 'dislike' | null

    useEffect(() => {
        async function fetchBlog() {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${blogId}`);
            const data = await response.json();

            if (data.likes) setLikes(data.likes.length);
            if (data.dislikes) setDislikes(data.dislikes.length);
        }
        fetchBlog();
    }, [blogId]);

    const toggleReaction = async (type) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bloglikes/${blogId}/${type}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, authorId }),
        });
        const data = await res.json();
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setUserReaction(prev => (prev === type ? null : type));
    };

    const buttonStyle = (isActive, activeBg) => ({
        backgroundColor: isActive ? activeBg : "#f0f0f0",
        color: "black", // always keep icon black
        border: "none",
        padding: "6px 10px",
        borderRadius: "6px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "0.9rem"
    });

    return (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
                style={buttonStyle(userReaction === "like", "blueviolet")}
                onClick={() => toggleReaction("like")}
            >
                <FaThumbsUp /> {likes}
            </button>

            <button
                style={buttonStyle(userReaction === "dislike", "blueviolet")}
                onClick={() => toggleReaction("dislike")}
            >
                <FaThumbsDown /> {dislikes}
            </button>
        </div>
    );
}

export default LikeDislike;
