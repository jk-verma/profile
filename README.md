# Dr. Jitendra Kumar Verma - Profile Website

Static academic profile website for GitHub Pages.

## Structure

All public `.html` pages are kept in the repository root:

- `index.html` - Main profile homepage
- `publications.html` - Publications and intellectual property page
- `projects.html` - Projects page
- `news.html` - Latest news archive page
- `dashboard.html` - Content dashboard for preparing updates

Supporting files are organized by purpose:

- `css/styles.css` - Shared website styling
- `js/script.js` - Homepage behavior, latest news preview, active nav highlighting
- `js/publications.js` - Publications rendering and filters
- `js/projects.js` - Projects rendering
- `js/news.js` - News archive rendering and filters
- `js/dashboard.js` - Dashboard forms, previews, copy, and download behavior
- `js/dashboard-access.js` - Dashboard password prompt
- `data/news.json` - Latest news data
- `data/publications.json` - Publications and intellectual property data
- `data/projects.json` - Website, utility, and funded project data
- `data/project-modes.json` - Project and funding mode reference data
- `assets/profile-photo.jpg` - Optional profile photo

## Publish the website

1. Upload the repository to GitHub.
2. Open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/root`.
5. Save the settings.

GitHub Pages will serve the root HTML files directly.

## Dashboard Access

The dashboard is protected by a lightweight browser-side password prompt.

- Dashboard URL: `dashboard.html`
- Current password: `*******`

Important: because this is a static GitHub Pages site, this is only light access control in the browser, not full secure authentication.

## Add or Replace the Profile Photo

Add a portrait image at:

```text
assets/profile-photo.jpg
```

Use a small web version rather than a high-resolution original. Any image shown in a browser can still be copied by a determined visitor, so the best practical protection is to upload only a low-resolution or watermarked version.

## Update Latest News

Open `dashboard.html`, create a news entry, then copy or download the generated `news.json`.

Replace:

```text
data/news.json
```

Current categories supported in the dashboard:

- Achievement
- Call for Papers
- Call for Chapters
- Conference News
- Announcement
- Academic
- Research

The homepage shows a short latest-news preview from `data/news.json`, while `news.html` shows the full archive with category filtering.

## Update Publications and Intellectual Property

Open `dashboard.html`, create a publication entry, then copy or download the generated `publications.json`.

Replace:

```text
data/publications.json
```

The public `publications.html` page automatically:

- groups entries by publication type
- shows reverse numbering within each type
- formats references in IEEE-style form
- supports year and type filtering
- includes patents as part of intellectual property output

Supported publication types:

- Journal Article
- Conference Paper
- Book Chapter
- Book / Edited Volume
- Patent
- Forthcoming / Accepted

## Update Projects

Open `dashboard.html`, create either:

- a website or utility project entry
- a funded project entry

Then copy or download the generated `projects.json`.

Replace:

```text
data/projects.json
```

The public `projects.html` page groups entries by project type automatically.

## Notes

- The homepage uses brief summary sections for research, projects, and latest news.
- The full lists live on `publications.html`, `projects.html`, and `news.html`.
- The footer year updates automatically through JavaScript.
