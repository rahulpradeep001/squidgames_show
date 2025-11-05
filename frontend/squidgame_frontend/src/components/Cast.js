import React, { useState, useEffect } from 'react';
import config from '../config';
import './cast.css';

const Cast = () => {
    const [cast, setCast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCast = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${config.API_URL}/cast/`);
                if (!response.ok) {
                    throw new Error(`Failed to load cast: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Fetched cast data:', data);
                setCast(data);
            } catch (error) {
                console.error('Error fetching cast:', error);
                setError(error.message || 'Failed to load cast. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCast();
    }, []);

    if (loading) {
        return (
            <div className="cast-page">
                <div className="loading">Loading cast...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cast-page">
                <div className="error-message">
                    <h3>Error</h3>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="cast-page">
            <header className="title-bar">
                <h1>Squid Games Cast</h1>
            </header>
            <nav className="navbar">
                <a href="/" className="nav-link">Home</a>
                <a href="/#ep" className="nav-link">Episodes</a>
                <a href="/cast" className="nav-link">Cast</a>
            </nav>
            <section className="cast-list-section">
                {cast.length > 0 ? (
                    <ul className="cast-list">
                        {cast.map((castMember) => (
                            <li key={castMember.id} className="cast-card">
                                <img
                                    src={castMember.profile}
                                    alt={castMember.name}
                                    className="cast-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                                    }}
                                />
                                <div className="cast-info">
                                    <h2>{castMember.name}</h2>
                                    <p>{castMember.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-results">No cast members found.</p>
                )}
            </section>
        </div>
    );
};

export default Cast;
