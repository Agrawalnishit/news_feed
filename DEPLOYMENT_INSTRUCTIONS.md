# Netlify Deployment Instructions

## Quick Deploy Steps

### Option 1: Netlify UI (Recommended for first-time deployment)

1. **Go to Netlify:**
   - Visit [https://app.netlify.com](https://app.netlify.com)
   - Sign up or log in with your GitHub account

2. **Import your project:**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub repositories
   - Select your repository: `Agrawalnishit/news_feed`

3. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `build`
   - Click "Deploy site"

4. **Add Environment Variable (Important!):**
   - After initial deployment, go to: Site settings → Environment variables
   - Add a new variable:
     - Key: `REACT_APP_NEWS_API_KEY`
     - Value: `95f304b755ff4246946d1f68453b55c9`
   - Trigger a new deploy by going to: Deploys → Trigger deploy → Clear cache and deploy site

5. **Wait for deployment:**
   - Netlify will build and deploy your site
   - You'll get a URL like: `https://random-name-123.netlify.app`

### Option 2: Netlify CLI (Alternative method)

If you prefer using command line:

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy (from your project directory)
netlify deploy --prod

# Add environment variable via CLI
netlify env:set REACT_APP_NEWS_API_KEY 95f304b755ff4246946d1f68453b55c9

# Redeploy with the environment variable
netlify deploy --prod
```

## Important Notes

1. **Environment Variables:** Your API key is now stored as an environment variable, which is secure for production deployment.

2. **Automatic Deployments:** Netlify will automatically redeploy your site whenever you push changes to the `main` branch on GitHub.

3. **Custom Domain:** You can add a custom domain later in Site settings → Domain management.

4. **Build Directory:** The site will be built in the `build` folder (as specified in netlify.toml).

5. **SPA Routing:** The `netlify.toml` file includes redirect rules for single-page application routing.

## Troubleshooting

- **Build failures:** Check the Netlify build logs for any errors
- **API not working:** Make sure the environment variable `REACT_APP_NEWS_API_KEY` is set correctly
- **Page not found errors:** The netlify.toml file handles SPA routing with redirects

## Your Repository

GitHub: https://github.com/Agrawalnishit/news_feed.git

## Project Configuration Files

- `netlify.toml` - Netlify deployment configuration
- `.gitignore` - Updated to exclude build files and environment variables
- `src/App.jsx` - Updated to use environment variables for API key
