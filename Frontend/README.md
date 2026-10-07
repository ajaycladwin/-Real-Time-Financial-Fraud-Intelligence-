# Movie App

A modern, responsive movie browsing application built with React, Vite, React Router, and Tailwind CSS. The app fetches movie data dynamically from the OMDB API.

## Features
- **Global Search:** Search for any movie using the OMDB API.
- **Detailed Information:** View movie posters, plot, cast, and genres.
- **Local Filtering:** Filter loaded search results by genre, release year, or average rating.
- **Movie Rating:** Rate movies locally with a 5-star rating system.
- **Responsive UI:** Beautiful, sleek design powered by Tailwind CSS that looks great on desktop and mobile.

## Tech Stack
- React 19
- Vite
- Tailwind CSS v4
- React Router DOM
- Vanilla JS Fetch API


## Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation
1. Navigate to the project root directory in your terminal.
2. Install the dependencies:
   ```bash
   npm install
   ```

### Environment Variables
This project requires an OMDB API key to fetch movie data.
1. Create a `.env` file in the root of the project (if not already there).
2. Add your API key as follows (get a free key at [omdbapi.com](http://www.omdbapi.com/apikey.aspx)):
   ```env
   VITE_OMDB_API_KEY=your_api_key_here
   ```

### Running Locally
To start the development server, run:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Building for Production
To generate a production-ready build:
```bash
npm run build
```
The output will be in the `dist` folder. You can preview it using `npm run preview`.

## Deployment
This app can be deployed to Netlify. See the [netlify-deploy-guide.md](./netlify-deploy-guide.md) for detailed deployment steps.

---

### Troubleshooting: npm PowerShell Execution Policy Error
If you see an error like `npm.ps1 cannot be loaded because running scripts is disabled on this system` in Windows PowerShell, you need to change your execution policy.

Run this command as Administrator in PowerShell (or just run it in your current PowerShell to fix it for your user):
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
Type `Y` to confirm. After doing this, `npm` commands should work correctly.
