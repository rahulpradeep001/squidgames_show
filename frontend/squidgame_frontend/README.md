Squid Game TV Show Website
Overview
This is a React and Django REST Framework based website that showcases the popular TV show, Squid Game. The website includes:

A Home Page with a list of episodes and a search bar to easily find episodes.
A Cast Page that displays detailed information about the cast.
Individual Episode Pages that contain episode overviews, telecast dates, and user comments.
The website is designed to provide a clean, modern, and aesthetic look with a dark theme.

Features
Home Page:

Lists all episodes with their title, overview, telecast date, and image.
Includes a search bar to quickly find specific episodes.
Each episode links to its own detailed page.
Cast Page:

Displays cast members' names, profiles, and descriptions.
Episode Pages:

Provides an overview of the episode.
Displays the telecast date.
Allows users to post and view comments about the episode.
Technologies Used
Frontend: React.js
Axios for API requests.
CSS for styling with a glassy and modern aesthetic touch.
Backend: Django and Django REST Framework
Models: Episode, Cast, Comment.
API Views: To fetch and create episodes, cast, and comments.
Database: SQLite (default Django database)
Models
Episode
title: CharField (max_length=255) - The episode's title.
about: TextField - A brief overview of the episode.
telecast_date: DateField - The episode's air date.
image: ImageField (optional) - The episode's image.
Cast
name: CharField (max_length=100) - The cast member's name.
profile: URLField - The URL to the cast member's profile.
description: TextField - A description of the cast member.
Comment
episode: ForeignKey (Episode) - The episode associated with the comment.
comment_name: CharField (max_length=100) - Name of the commenter.
content: TextField - The content of the comment.
comment_date: DateTimeField - The date the comment was posted.
API Endpoints
Episodes
GET /episodes/: Fetch all episodes.
GET /episodes/:id/: Fetch a single episode by ID.
POST /episodes/: Create a new episode (Admin feature).
PUT /episodes/:id/: Update an episode (Admin feature).
DELETE /episodes/:id/: Delete an episode (Admin feature).
Cast
GET /cast/: Fetch all cast members.
Comments
GET /episodes/:id/comments/: Fetch comments for an episode.
POST /episodes/:id/comments/: Add a new comment to an episode.
Installation Instructions
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/squid-game-website.git
Install dependencies:

Backend (Django):

bash
Copy code
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
Frontend (React):

bash
Copy code
cd frontend
npm install
npm start
Run the Django development server at http://localhost:8000/ and the React development server at http://localhost:3000/.

Hosting
The website is hosted on PythonAnywhere for the backend (Django) and the frontend (React). Visit the live site at: your-live-site-url

Future Improvements
Add pagination for episodes and cast members.
Implement authentication for posting comments.
Improve episode filtering based on telecast date or title.
License
This project is open-source and available under the MIT License. Feel free to contribute and enhance it further!
