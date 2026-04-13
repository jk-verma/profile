# Dashboard Features Roadmap

This branch tracks planned dashboard improvements for managing website JSON data while keeping the site fully compatible with GitHub Pages static hosting.

## Goal

Improve `dashboard.html` so records can be reviewed, edited, deleted, previewed, copied, downloaded, and exported without placing GitHub tokens, passwords, or private data in public JavaScript.

## GitHub Pages-Safe Workflow

1. Open `dashboard.html`.
2. Select a section such as Latest News, Research/Publications, Projects, or Voluntary Projects.
3. Review the generated Preview below the Create Entry and Publish cards.
4. Use the Edit button on any preview item to load that record back into its matching Create Entry card.
5. Use the cross button on any preview item to remove that record from the generated JSON.
6. After editing, click the section's Add button again to update the generated JSON in the Publish card.
7. Copy or download the full updated JSON file.
8. Replace the corresponding file in GitHub:
   - `data/news.json`
   - `data/publications.json`
   - `data/projects.json`
   - `data/voluntary-projects.json`

## Implemented in This Branch

- Add Edit and cross/delete actions directly on preview records.
- Load selected preview records back into the relevant Create Entry card.
- Delete selected preview records from the generated JSON shown in the Publish card.
- Keep full JSON output box visible in Publish card.
- Keep existing single-entry JSON output.
- Keep Preview below the Create Entry and Publish cards.
- Show clear status messages after edit, delete, copy, and download.
- Add validation before export.
- Keep password/token-free public JavaScript.

## Still Optional Later

- Add local JSON upload/import if manual copy/download later becomes too slow for large files.
- Add drag-and-drop ordering for long lists.

## Section-Specific Notes

### Latest News

- Load and edit entries from `data/news.json`.
- Support category, date, deadline, link, title, and summary.
- Preserve newest-first ordering.

### Research / Publications

- Load and edit entries from `data/publications.json`.
- Preserve publication type switching.
- Preserve IEEE-style preview.
- Preserve reverse numbering by type.
- Keep forthcoming and active under-examination patent logic.

### Projects

- Load and edit entries from `data/projects.json`.
- Preserve website/utility and funded project workflows.
- Preserve reverse numbering for funded projects.
- Preserve project filters.

### Voluntary Projects

- Load and edit entries from `data/voluntary-projects.json`.
- Support GitHub Pages websites, code repositories, programs, PDF knowledge resources, and other voluntary outputs.

## Security Boundary

Direct saving from a public GitHub Pages dashboard into GitHub is intentionally avoided because it would require exposing a GitHub token in browser-side JavaScript. The dashboard should prepare JSON safely; publishing should still happen through GitHub's editor or a local Git workflow.
