import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import './HomePage.css';

const HomePage = () => {
    const [episodes, setEpisodes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${config.API_URL}/episodes/`);

                if (!response.ok) {
                    throw new Error(`Failed to load episodes: ${response.statusText}`);
                }

                const data = await response.json();
                setEpisodes(data);
            } catch (error) {
                console.error('Error fetching episodes:', error);
                setError(error.message || 'Failed to load episodes. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchEpisodes();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredEpisodes = episodes.filter(episode =>
        episode.title.toLowerCase().includes(searchTerm) ||
        episode.about.toLowerCase().includes(searchTerm)
    );

    const handleEpisodeClick = (episodeId) => {
        navigate(`/episodes/${episodeId}`);
    };

    if (loading) {
        return (
            <div className="homepage">
                <div className="loading">Loading episodes...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="homepage">
                <div className="error-message">
                    <h3>Error</h3>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="homepage">
            <header className="title-bar">
                <h1>Squid Game</h1>
            </header>
            <nav className="navbar">
                <a href="/" className="nav-link">Home</a>
                <a href="#ep" className="nav-link">Episodes</a>
                <a href="/cast" className="nav-link">Cast</a>
            </nav>
            <section className="hero">
                <div className="hero-content">
                    <h2>Welcome to the World of Squid Game</h2>
                    <p>Explore each episode and dive into the gripping drama.</p>
                </div>
                <img src="https://variety.com/wp-content/uploads/2021/10/Squid-Game-Netflix.jpg" alt="Squid Game" className="hero-image" />
            </section>
            <section className="search-section">
                <input
                    type="text"
                    placeholder="Search for episodes..."
                    className="search-bar"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </section>
            <section className="episode-list-section">
                <h3>Episodes</h3>
                {filteredEpisodes.length === 0 ? (
                    <p className="no-results">No episodes found matching your search.</p>
                ) : (
                    <div id="ep" className="episode-cards">
                        {filteredEpisodes.map(episode => (
                            <div
                                key={episode.id}
                                className="episode-card"
                                onClick={() => handleEpisodeClick(episode.id)}
                            >
                                <img src={episode.image} alt={episode.title} className="episode-card-image" />
                                <div className="episode-card-info">
                                    <h4>{episode.title}</h4>
                                    <p>{episode.about}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;
