import { useState, useEffect } from "react";
import getTags from "../../js/GetTags.js";

function BlogTagSelector({ onTagChange, initialTags = [] }) {
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        async function fetchTags() {
            const tags = await getTags();
            setAvailableTags(tags || []);
        }
        fetchTags();
    }, []);

    // ✅ Preload selected tags (EDIT mode)
    useEffect(() => {
        if (initialTags.length > 0) {
            setSelectedTags(initialTags);
        }
    }, [initialTags]);

    const toggleTag = (tag) => {
        const exists = selectedTags.some(t => t._id === tag._id);

        let updated;
        if (exists) {
            updated = selectedTags.filter(t => t._id !== tag._id);
        } else {
            updated = [...selectedTags, tag];
        }

        setSelectedTags(updated);
        onTagChange(updated); // 🔥 pass objects up
    };

    return (
        <div>
            <h3>Select Tags:</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {availableTags.map(tag => {
                    const isSelected = selectedTags.some(t => t._id === tag._id);

                    return (
                        <div
                            key={tag._id}
                            onClick={() => toggleTag(tag)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "20px",
                                cursor: "pointer",
                                backgroundColor: isSelected
                                    ? "blueviolet"
                                    : "#ce9affff",
                                color: isSelected ? "#fff" : "#000",
                            }}
                        >
                            {tag.tag_name}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default BlogTagSelector;
