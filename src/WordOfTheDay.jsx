import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import getWordOfDay from "./js/getWordOfDay.js";
//import './styles/WordOfTheDay.css'

function WordOfTheDay() {
    const [word, setWord] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchWord() {
            try {
                const data = await getWordOfDay();
                if(word === null){

                }
                setWord(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchWord();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ flex: 1, minWidth: "150px" }}> {/* Added min-width to prevent shrinking too small */}

                {(word==null)?
                    <div>
                        <Card style={{
                            background: "linear-gradient(to right, blueviolet, #602a9a)",
                            color: "white",
                            padding: "20px",
                            borderRadius: "10px",
                            textAlign: "center",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                        }}>
                            <Card.Body>
                                <Card.Title style={{ fontSize: "24px", fontWeight: "bold", backgroundColor: "#602897", borderRadius: "5px" }}>Word of the Day</Card.Title>
                                <h2 style={{ fontSize: "28px", margin: "10px 0" }}>No word of day found.</h2>
                            </Card.Body>
                        </Card>
                    </div>
                    :
                    <Card style={{
                        background: "linear-gradient(to right, blueviolet, #602a9a)",
                        color: "white",
                        padding: "20px",
                        borderRadius: "10px",
                        textAlign: "center",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                    }}>
                        <Card.Body>
                            <Card.Title style={{ fontSize: "24px", fontWeight: "bold", backgroundColor: "#602897", borderRadius: "5px" }}>Word of the Day</Card.Title>
                            <h2 style={{ fontSize: "28px", margin: "10px 0" }}>{word.word}</h2>
                            <p style={{ fontSize: "18px", lineHeight: "1.5" }}>{word.definition}</p>
                        </Card.Body>
                    </Card>
                }

        </div>
    );
}

export default WordOfTheDay;
