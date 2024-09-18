import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './cast.css'; // Import the CSS file for styling

const Cast = () => {
    const [cast, setCast] = useState([]);

    useEffect(() => {
        const fetchCast = async () => {
            try {
                const response = await axios.get('https://rahulpradeepkumar.pythonanywhere.com/api/cast/');
                console.log('Fetched cast data:', response.data);
                setCast(response.data);
            } catch (error) {
                console.error('Error fetching cast:', error);
            }
        };

        fetchCast();
    }, []);

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
                <ul className="cast-list">
                    {cast.length > 0 ? (
                        cast.map((castMember) => (
                            <li key={castMember.id} className="cast-card">
                                {/* Log the profile image URL to the console */}
                                {console.log('Image URL:', castMember.profile)}

                                {/* Render the image and cast info */}
                                <img src={castMember.profile} alt={castMember.name} className="cast-image" />
                                <div className="cast-info">
                                    <h2>{castMember.name}</h2>
                                    <p>{castMember.description}</p>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>Cast members data not found.</p>
                    )}
                </ul>
            </section>
        </div>
    );
};

export default Cast;
