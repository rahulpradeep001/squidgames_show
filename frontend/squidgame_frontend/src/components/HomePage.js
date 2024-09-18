import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const [episodes, setEpisodes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://rahulpradeepkumar.pythonanywhere.com/api/episodes/')
            .then(response => response.json())
            .then(data => setEpisodes(data))
            .catch(error => console.error('Error fetching episodes:', error));
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
            </section>
        </div>
    );
};

export default HomePage;
