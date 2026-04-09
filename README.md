# Dr. Jitendra Kumar Verma - GitHub Pages Website

Static academic profile website for GitHub Pages.

## Files

- `index.html` - Main website page
- `css/styles.css` - Website styling
- `js/script.js` - Mobile navigation, protected photo behavior, and news rendering
- `publications.html` - Publications and patents page grouped by publication type
- `js/publications.js` - Publications rendering and IEEE-style reference formatting
- `dashboard.html` - Browser-based dashboard for preparing Latest News and Publications updates
- `js/dashboard.js` - Dashboard forms, previews, copy, and download behavior
- `data/news.json` - Latest news / daily developments data source
- `data/publications.json` - Publications and patents data source
- `assets/profile-photo.jpg` - Optional portrait photo

## Publish on GitHub Pages

1. Upload the files from this folder to a GitHub repository.
2. In GitHub, open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/root`.
5. Save the settings.

## Add or replace the profile photo

Add a portrait image at:

```text
assets/profile-photo.jpg
```

Use a small web version rather than a high-resolution original. A browser must download any image it displays, so the site cannot make the photo impossible to copy. This site discourages casual saving by disabling right-click and dragging on the photo area, but the best protection is to upload only a low-resolution or watermarked copy.

## Update the Latest News section

Open `dashboard.html` in the website, add a new item, then copy or download the generated `news.json`.
Use the GitHub editor to replace the repository's `data/news.json` file and commit the change.

You can use these categories:

- Achievement
- Call for Papers
- Call for Chapters
- Conference News
- Announcement
- Academic
- Research

The JSON format is:

```json
{
  "date": "2026-04-08",
  "category": "News",
  "title": "Your headline here",
  "summary": "Short update text here."
}
```

Commit and push the change. GitHub Pages will update after deployment finishes.

## Update Publications

Open `dashboard.html`, add a publication entry, then copy or download the generated `publications.json`.
Use the GitHub editor to replace the repository's `data/publications.json` file and commit the change.

The public `publications.html` page automatically:

- Groups entries by publication type
- Places new entries at the top of their selected type when prepared through the dashboard
- Shows reverse numbering within each publication type
- Formats entries in an IEEE-style reference format
- Includes patents as a supported publication type

Supported publication types:

- Journal Article
- Conference Paper
- Book Chapter
- Book / Edited Volume
- Patent
- Forthcoming / Accepted
