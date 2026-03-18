# GitHub Pages Deployment Guide

This guide explains how to deploy Sudoku Quest to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed locally
- Basic command line knowledge

## Deployment Steps

### Step 1: Create a GitHub Repository

1. Log in to [GitHub](https://github.com)
2. Click **New repository**
3. Enter repository name: `sudoku-quest`
4. Choose **Public** (required for free GitHub Pages)
5. Click **Create repository**

### Step 2: Push Your Code

Open your terminal and run:

```bash
# Navigate to your project folder
cd /path/to/sudoku-quest

# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/sudoku-quest.git

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings**
3. In the left sidebar, click **Pages**
4. Under **Build and deployment**:
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select "main" (or "master")
   - **Folder**: Select "/ (root)"
5. Click **Save**

### Step 4: Access Your Site

After a few minutes, your site will be live at:

```
https://YOUR_USERNAME.github.io/sudoku-quest/
```

## Configuration

### File Path Requirements

Ensure all resources use relative paths:

| File Type | Path Format | Example |
|-----------|-------------|---------|
| CSS | `../css/style.css` | Correct |
| JS | `../js/game.js` | Correct |
| Links | `../index.html` | Correct |

### Build Settings

- **Branch**: main (or master)
- **Folder**: / (root)
- **Build**: None (static files)

## Troubleshooting

### Issue: 404 Error After Deployment

**Solution**: 
- Verify `index.html` is in the root directory
- Check that all file paths are relative (no absolute paths)
- Ensure the repository is set to Public

### Issue: CSS/JS Not Loading

**Solution**:
- Check browser console for 404 errors
- Verify path format: use `../` for pages subdirectory
- Ensure file names are case-sensitive

### Issue: Page Not Found

**Solution**:
- Wait 2-5 minutes for initial deployment
- Check repository Settings > Pages for deployment status
- Verify branch name matches (main vs master)

### Issue: Custom Domain Not Working

**Solution**:
- Add custom domain in Settings > Pages
- Create CNAME file in repository root
- Wait for DNS propagation (up to 24 hours)

## Verification Checklist

- [ ] Repository is Public
- [ ] index.html in root directory
- [ ] All CSS/JS use relative paths
- [ ] GitHub Pages enabled in settings
- [ ] Deployment completed (green checkmark)
- [ ] Site loads without errors

## Custom Domain (Optional)

To use a custom domain:

1. Go to Settings > Pages
2. Enter your custom domain under "Custom domain"
3. Click Save
4. Create CNAME file with your domain name

## Updates

To update your deployed site:

```bash
# Make changes to your files
git add .
git commit -m "Update description"
git push
```

GitHub Pages will automatically rebuild within minutes.

## Support

For GitHub Pages issues, visit:
https://docs.github.com/en/pages
