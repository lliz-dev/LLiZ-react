import { useState, useEffect } from "react";
import getTags from "../../js/GetTags.js"; // Import your getTags function

function BlogTagSelector({ onTagChange, initialTags = [] }) {
    const fallbackTags = [
        { tag_name: "Grammar" },
        { tag_name: "Pronunciation" },
        { tag_name: "Culture" },
        { tag_name: "History" },
        { tag_name: "Vocabulary" },
        { tag_name: "Conversation" },
    ];

    const [availableTags, setAvailableTags] = useState(fallbackTags);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        async function fetchTags() {
            try {
                const tags = await getTags();
                if (tags && tags.length > 0) {
                    setAvailableTags(tags);
                } else {
                    console.warn("No tags fetched, using fallback tags.");
                }
            } catch (error) {
                console.error("Failed to fetch tags, using fallback:", error);
            }
        }
        fetchTags();
    }, []);

    // Set initial tags when they're provided
    useEffect(() => {
        if (initialTags && initialTags.length > 0) {
            const tagNames = initialTags.map(tag => 
                typeof tag === 'string' ? tag : tag.tag_name
            );
            setSelectedTags(tagNames);
        }
    }, [initialTags]);

    const handleTagChange = (tagName) => {
        const newSelectedTags = [...selectedTags];
        if (newSelectedTags.includes(tagName)) {
            const index = newSelectedTags.indexOf(tagName);
            newSelectedTags.splice(index, 1);
        } else {
            newSelectedTags.push(tagName);
        }

        setSelectedTags(newSelectedTags);
        onTagChange(newSelectedTags);
    };

    const clearAllTags = () => {
        setSelectedTags([]);
        onTagChange([]);
    };

    // CSS-in-JS styles
    const styles = {
        container: {
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "10px",
            padding: "10px",
        },
        tag: {
            padding: "8px 16px",
            borderRadius: "20px",
            backgroundColor: "#ce9affff",
            cursor: "pointer",
            transition: "all 0.2s ease",
            userSelect: "none",
        },
        tagSelected: {
            backgroundColor: "blueviolet",
            color: "#fff",
        },
        label: {
            marginLeft: "5px",
            cursor: "pointer",
        },
        clearButton: {
            padding: "10px 15px 10px 5px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#a54a4aff",
            color: "#fff",
            cursor: "pointer",
            marginBottom: "10px",
        },
    };

    return (
        <div>
            <h3>Select Tags:</h3>
            <button style={styles.clearButton} onClick={clearAllTags}>
                Clear All
            </button>
            <div style={styles.container}>
                {availableTags.map((tag, index) => {
                    const isSelected = selectedTags.includes(tag.tag_name);
                    return (
                        <div
                            key={index}
                            style={{
                                ...styles.tag,
                                ...(isSelected ? styles.tagSelected : {}),
                            }}
                            onClick={() => handleTagChange(tag.tag_name)}
                            required
                        >
                            <span style={styles.label}>{tag.tag_name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default BlogTagSelector;
