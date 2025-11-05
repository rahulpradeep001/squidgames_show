import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import config from '../config';
import './episode.css';

const EpisodeDetail = () => {
    const { id } = useParams();
    const [episode, setEpisode] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentName, setCommentName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchEpisodeData = async () => {
            try {
                setLoading(true);
                setError(null);

                const episodeResponse = await fetch(`${config.API_URL}/episodes/${id}/`);
                if (!episodeResponse.ok) {
                    throw new Error(`Failed to load episode: ${episodeResponse.statusText}`);
                }
                const episodeData = await episodeResponse.json();
                setEpisode(episodeData);

                const commentsResponse = await fetch(`${config.API_URL}/episodes/${id}/comments/`);
                if (!commentsResponse.ok) {
                    throw new Error(`Failed to load comments: ${commentsResponse.statusText}`);
                }
                const commentsData = await commentsResponse.json();
                setComments(commentsData);
            } catch (error) {
                console.error('Error fetching episode data:', error);
                setError(error.message || 'Failed to load episode. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchEpisodeData();
    }, [id]);

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
        setSubmitError(null);
    };

    const handleCommentNameChange = (event) => {
        setCommentName(event.target.value);
        setSubmitError(null);
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        // Basic validation
        if (!commentName.trim()) {
            setSubmitError('Please enter your name.');
            return;
        }

        if (!newComment.trim()) {
            setSubmitError('Please enter a comment.');
            return;
        }

        if (newComment.length < 5) {
            setSubmitError('Comment must be at least 5 characters long.');
            return;
        }

        if (newComment.length > 2000) {
            setSubmitError('Comment must not exceed 2000 characters.');
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError(null);
            setSubmitSuccess(false);

            const response = await fetch(`${config.API_URL}/episodes/${id}/comments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: newComment,
                    comment_name: commentName,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();

                // Handle rate limiting
                if (response.status === 429) {
                    throw new Error('Too many comments. Please wait before commenting again.');
                }

                // Handle validation errors
                if (errorData.content) {
                    throw new Error(errorData.content[0]);
                }
                if (errorData.comment_name) {
                    throw new Error(errorData.comment_name[0]);
                }

                throw new Error('Failed to post comment. Please try again.');
            }

            const newCommentData = await response.json();
            setComments([...comments, newCommentData]);
            setNewComment('');
            setCommentName('');
            setSubmitSuccess(true);

            // Clear success message after 3 seconds
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (error) {
            console.error('Error posting comment:', error);
            setSubmitError(error.message || 'Failed to post comment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="loading">Loading episode...</div>;

    if (error) {
        return (
            <div className="error-message">
                <h3>Error</h3>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    if (!episode) return <div className="loading">Episode not found</div>;

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
                    <p><strong>Telecast Date:</strong> {new Date(episode.telecast_date).toLocaleDateString()}</p>
                </div>
            </section>
            <section id="comments-section" className="comments-section">
                <h2>Comments ({comments.length})</h2>
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
                    <h3>Add a Comment</h3>
                    {submitError && (
                        <div className="error-alert">{submitError}</div>
                    )}
                    {submitSuccess && (
                        <div className="success-alert">Comment posted successfully!</div>
                    )}
                    <input
                        type="text"
                        value={commentName}
                        onChange={handleCommentNameChange}
                        placeholder="Your name"
                        required
                        maxLength="100"
                        disabled={isSubmitting}
                    />
                    <textarea
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="Add a comment..."
                        required
                        maxLength="2000"
                        disabled={isSubmitting}
                    ></textarea>
                    <div className="character-count">
                        {newComment.length} / 2000 characters
                    </div>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Posting...' : 'Submit'}
                    </button>
                </form>
            </section>
        </div>
    );
};

export default EpisodeDetail;
