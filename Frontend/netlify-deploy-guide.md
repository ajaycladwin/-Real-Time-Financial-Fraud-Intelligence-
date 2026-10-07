# Netlify Deployment Guide

This guide outlines the steps to deploy the Movie App frontend to Netlify.

## Prerequisites
- A [Netlify](https://www.netlify.com/) account.
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket) OR you can use Netlify Drop to drag and drop the `dist` folder.

## Deployment via Git (Recommended)

1. **Log in to Netlify:**
   Go to your Netlify dashboard and click on **Add new site** -> **Import an existing project**.

2. **Connect your Git provider:**
   Choose GitHub, GitLab, or Bitbucket depending on where your code is hosted, and authorize Netlify.

3. **Select your repository:**
   Search for and select the repository containing your Movie App.

4. **Configure Build Settings:**
   Netlify should automatically detect most settings, but verify they are correct:
   - **Base directory:** Leave empty or `/`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

5. **Deploy Site:**
   Click the **Deploy site** button. Netlify will begin building your app.

6. **Environment Variables:**
   If your frontend needs any API keys, go to **Site configuration** -> **Environment variables** and add them.

## Important Note on Routing
Since this is a Single Page Application (SPA) using React Router, all requests must route back to `index.html`. 
A `netlify.toml` file has already been added to the root of the project with the necessary redirect configuration:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
This ensures users can directly load URLs like `/movies` or `/login` without encountering 404 errors.
