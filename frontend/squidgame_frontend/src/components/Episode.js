import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './episode.css'; // Import the updated CSS file

const EpisodeDetail = () => {
    const { id } = useParams();
    const [episode, setEpisode] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentName, setCommentName] = useState(''); // State for user's name
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEpisodeData = async () => {
            try {
                const episodeResponse = await fetch(`https://rahulpradeepkumar.pythonanywhere.com/api/episodes/${id}/`);
                const episodeData = await episodeResponse.json();
                setEpisode(episodeData);

                const commentsResponse = await fetch(`https://rahulpradeepkumar.pythonanywhere.com/api/episodes/${id}/comments/`);
                const commentsData = await commentsResponse.json();
                setComments(commentsData);
            } catch (error) {
                console.error('Error fetching episode data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEpisodeData();
    }, [id]);

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleCommentNameChange = (event) => {
        setCommentName(event.target.value);
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`https://rahulpradeepkumar.pythonanywhere.com/api/episodes/${id}/comments/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newComment,
                    comment_name: commentName, // Send the user's name
                }),
            });
            const newCommentData = await response.json();
            setComments([...comments, newCommentData]);
            setNewComment('');
            setCommentName(''); // Reset the name field
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="episode-detail">
            <header className="title-bar">
                <h1>{episode.title}</h1>
            </header>
            <nav className="navbar">
                <a href="/" className="nav-link">Home</a>
                <a href="/#ep" className="nav-link">Episodes</a>
                <a href="/cast" className="nav-link">Cast</a>
            </nav>
            <section className="hero" style={{ backgroundImage: `url(${episode.image})` }}>
                <div id="ep" className="hero-content">
                    <p>{episode.about}</p>
                    <p><strong>Telecast Date:</strong> {new Date(episode.telecast_date).toLocaleDateString()}</p> {/* Display telecast date */}
                </div>
            </section>
            <section id="comments-section" className="comments-section">
                <h2>Comments</h2>
                <ul className="comments-list">
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <li key={comment.id} className="comment-item">
                                <h3>{comment.comment_name}</h3>
                                <p>{comment.content}</p>
                                <small>Posted on: {new Date(comment.comment_date).toLocaleString()}</small>
                            </li>
                        ))
                    ) : (
                        <p>No comments yet. Be the first to comment!</p>
                    )}
                </ul>
                <form onSubmit={handleCommentSubmit} className="comment-form">
                    <input
                        type="text"
                        value={commentName}
                        onChange={handleCommentNameChange}
                        placeholder="Your name"
                        required
                    />
                    <textarea
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="Add a comment..."
                        required
                    ></textarea>
                    <button type="submit">Submit</button>
                </form>
            </section>
        </div>
    );
};

export default EpisodeDetail;
