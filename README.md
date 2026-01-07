# 🦑 Squid Game TV Show Website 🎮

> ⚠️ **WARNING**: This website contains 456% more React components than deadly childhood games ⚠️

## What's This All About?
Welcome to the *only* Squid Game website where nobody dies! (We promise. Probably.)

Built with **React** and **Django REST Framework** because apparently we enjoy living dangerously with our tech stack choices. This bad boy features:
- 🏠 A **Home Page** that lists episodes (without the psychological trauma!)
- 🎭 A **Cast Page** where you can stalk—err, *admire*—your favorite characters
- 📺 Individual **Episode Pages** with overviews, dates, and a comment section (be nice, or the Front Man will know...)

Dressed in a slick dark theme because, let's be honest, anything else would be inappropriate.

## The Good Stuff (Features)
### 🏠 Home Page
  - Episode list that won't make you play Red Light, Green Light
  - Search bar (way easier than finding the marble your best friend hid)
  - Click episodes to dive deeper (unlike diving into that glass bridge)

### 🎭 Cast Page
  - Names, faces, and bios of the people who made you ugly cry

### 📺 Episode Pages
  - Episode breakdowns (emotional breakdowns not included)
  - Air dates for the nostalgic
  - Comment section for your hot takes and conspiracy theories

## Tech Stack (AKA Our Weapons of Choice)
- **Frontend**: React.js (because vanilla JS is too mainstream)
- **Backend**: Django REST Framework (Python but make it API)
- **Database**: SQLite (smol but mighty, like marbles)

## The Secret Sauce (Data Models)
### 🎬 Episode Model
- `title`: CharField - What do we call this emotional rollercoaster?
- `about`: TextField - Spoilers (but not really)
- `telecast_date`: DateField - When this blessed/cursed episode dropped
- `image`: ImageField - Pretty pictures to hide the pain

### 🎭 Cast Model
- `name`: CharField - Who made you feel things?
- `profile`: URLField - Internet stalking made easy
- `description`: TextField - Their life story (the PG version)

### 💬 Comment Model
- `episode`: ForeignKey - Which episode broke you?
- `comment_name`: CharField - Your alias (Front Man not allowed)
- `content`: TextField - Your unfiltered thoughts
- `comment_date`: DateTimeField - Digital timestamp of your feelings

## How To Get This Party Started 🎉

### Step 1: Yoink the Code
```bash
git clone https://github.com/your-username/squid-game-website.git
```
*(Easier than stealing 45.6 billion won, we promise)*

### Step 2: Feed the Dependencies
**Backend (Django)** - The Brain:
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate  # Make database go brrr
python manage.py runserver
```

**Frontend (React)** - The Pretty Face:
```bash
cd frontend
npm install  # Time to grab a coffee ☕
npm start
```

### Step 3: Witness the Magic ✨
- Backend chillin' at `http://localhost:8000/`
- Frontend vibing at `http://localhost:3000/`

*If it doesn't work, try turning it off and on again. If that doesn't work, blame JavaScript.*

## See It In The Wild 🌐
Check out the live deployment (no deadly games required):
👉 `https://squidgames-seven.vercel.app/`

---

*Made with ❤️ and an unhealthy amount of caffeine*

*P.S. - No players were harmed in the making of this website (can't say the same for the show)*
