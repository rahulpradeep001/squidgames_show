import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage'; // Renamed to capitalized
import Episode from './components/Episode';   // Renamed to capitalized
import Cast from './components/Cast';         // Renamed to capitalized
// import './App.css';  // Global CSS

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />  {/* Capitalized */}
                <Route path="/episodes/:id" element={<Episode />} />  {/* Capitalized */}
                <Route path="/cast" element={<Cast />} />  {/* Capitalized */}
            </Routes>
        </Router>
    );
}

export default App;
