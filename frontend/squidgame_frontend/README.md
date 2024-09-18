# Squid Game TV Show Website

## Overview
This is a **React** and **Django REST Framework** based website that showcases the popular TV show, **Squid Game**. The website includes:
- A **Home Page** with a list of episodes and a search bar to easily find episodes.
- A **Cast Page** that displays detailed information about the cast.
- Individual **Episode Pages** that contain episode overviews, telecast dates, and user comments.

The website is designed to provide a clean, modern, and aesthetic look with a dark theme.

## Features
- **Home Page**:
  - Lists all episodes with their title, overview, telecast date, and image.
  - Includes a search bar to quickly find specific episodes.
  - Each episode links to its own detailed page.

- **Cast Page**:
  - Displays cast members' names, profiles, and descriptions.

- **Episode Pages**:
  - Provides an overview of the episode.
  - Displays the telecast date.
  - Allows users to post and view comments about the episode.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Django and Django REST Framework
- **Database**: SQLite (default Django database)

## Models
### Episode
- `title`: CharField (max_length=255) - The episode's title.
- `about`: TextField - A brief overview of the episode.
- `telecast_date`: DateField - The episode's air date.
- `image`: ImageField (optional) - The episode's image.

### Cast
- `name`: CharField (max_length=100) - The cast member's name.
- `profile`: URLField - The URL to the cast member's profile.
- `description`: TextField - A description of the cast member.

### Comment
- `episode`: ForeignKey (Episode) - The episode associated with the comment.
- `comment_name`: CharField (max_length=100) - Name of the commenter.
- `content`: TextField - The content of the comment.
- `comment_date`: DateTimeField - The date the comment was posted.

## Installation Instructions
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/squid-game-website.git
    ```

2. Install dependencies:
    - **Backend (Django)**:
      ```bash
      cd backend
      pip install -r requirements.txt
      python manage.py migrate
      python manage.py runserver
      ```

    - **Frontend (React)**:
      ```bash
      cd frontend
      npm install
      npm start
      ```

3. Run the Django development server at `http://localhost:8000/` and the React development server at `http://localhost:3000/`.

## Hosting
Visit the live site at: `https://squidgames-seven.vercel.app/`
