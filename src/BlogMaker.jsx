import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate
import Editor from "./Editor.jsx";
import postBlog from "./js/PostBlog.js";
import BlogTagSelector from "./BlogTagSelector.jsx";

function BlogMaker() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState([]);
    const navigate = useNavigate(); // <-- initialize navigate
    let author = JSON.parse(sessionStorage.getItem('username'));
    let authorid = JSON.parse(sessionStorage.getItem('userid'));

    const handleTitleChange = (event) => setTitle(event.target.value);
    const handleContentChange = (value) => setContent(value);
    const handleTagChange = (selectedTags) => setTags(selectedTags);

    const submitBlog = async (event) => {
        event.preventDefault();

        if (tags.length === 0) {
            alert("Please select at least one tag before submitting the blog.");
            return;
        }

        const blogData = { title, content, author, tags, authorid };;

        const response = await postBlog(blogData);
        if (response) {
            alert("Blog posted successfully!");
            navigate("/posts"); 
            setTitle("");
            setContent("");
            setTags([]);
        }
    };

    return (
        <div style={{ maxWidth: "900px", margin: "20px auto", padding: "30px 20px", backgroundColor: "#f9f9ff", borderRadius: "12px", boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}>
            <h1>Create New Post</h1>
            <form onSubmit={submitBlog} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                <input type="text" value={title} onChange={handleTitleChange} placeholder="Title goes here" style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #ccc" }} />
                <BlogTagSelector onTagChange={handleTagChange} />
                <Editor value={content} onChange={handleContentChange} />
                <button type="submit" style={{ backgroundColor: "blueviolet", color: "white", borderRadius: "8px", padding: "12px 25px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                    Submit
                </button>
            </form>
        </div>
    );
}

export default BlogMaker;
