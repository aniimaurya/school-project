# School Project

A Next.js app to add and display schools with MySQL backend.

## Features

- Add school with image upload and validation
- View schools in a responsive searchable list
- Next.js API routes with MySQL integration
- Tailwind CSS styling and responsive design
- Navigation between Add and Show Schools pages

## Tech Stack

Next.js, React, MySQL, Tailwind CSS, react-hook-form

## Project Structure

/app
/addSchool/page.jsx
/showSchools/page.jsx
/components/Navbar.jsx
/components/SchoolCard.jsx
/lib/db.js
/pages/api/schools/index.js
/public/schoolImages
.env.local.example
.gitignore
README.md


## Setup

1. Clone repo:  
   `git clone https://github.com/aniimaurya/school-project.git`  
   `cd school-project`

2. Install dependencies:  
   `npm install`

3. Copy `.env.local.example` to `.env.local` and update MySQL credentials

4. Set up MySQL database and `schools` table (see SQL schema in `.env.local.example`)

5. Run app:  
   `npm run dev`

6. Access:  
   - Add School: `http://localhost:3000/addSchool`  
   - Show Schools: `http://localhost:3000/showSchools`



For questions or feedback, feel free to contact me.
