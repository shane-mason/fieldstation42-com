# fieldstation42.com

Source for [fieldstation42.com](https://fieldstation42.com) — the official home for the FieldStation42 project. Built with [Pelican](https://getpelican.com/) and deployed to GitHub Pages via GitHub Actions.

## Local Development

### Prerequisites

- Python 3.10+
- pip

### Setup

```bash
# Clone the repo
git clone https://github.com/shane-mason/fieldstation42-com.git
cd fieldstation42-com

# Install dependencies
pip install pelican markdown

# Serve locally with live reload
pelican --listen
```

The site will be available at `http://localhost:8000`. Pelican watches for changes and rebuilds automatically.

## Project Structure

```
fieldstation42-com/
├── pelicanconf.py              # Site configuration
├── content/
│   ├── docs/                   # Documentation pages (Markdown)
│   │   ├── index.md            # Getting Started overview
│   │   ├── install.md
│   │   ├── add-content.md
│   │   ├── configure-stations.md
│   │   ├── generate-schedules.md
│   │   ├── watch-tv.md
│   │   ├── guides/
│   │   │   ├── advanced-scheduling.md
│   │   │   ├── channel-recipes.md
│   │   │   └── series-in-sequence.md
│   │   └── reference/
│   │       ├── command-line.md
│   │       ├── osd-setup.md
│   │       ├── web-remote.md
│   │       └── autostart.md
│   └── news/                   # Feature announcements (blog posts)
│       └── welcome.md
└── theme/
    ├── templates/
    │   ├── base.html           # Site-wide header, nav, footer
    │   ├── index.html          # Landing page
    │   ├── page.html           # Docs pages with sidebar
    │   ├── article.html        # News post
    │   └── archives.html       # News index
    └── static/
        ├── css/
        │   └── main.css        # Full stylesheet — mid-century palette
        └── js/
            └── main.js         # Mobile nav toggle, active sidebar links
```

## Content

### Adding a Documentation Page

Create a Markdown file in the appropriate `content/docs/` subfolder:

```markdown
Title: Your Page Title
Slug: your-page-slug
Summary: One sentence description shown in meta tags.

Your content here...
```

The `Slug` determines the URL. A file at `content/docs/install.md` with `Slug: install` will be served at `/docs/install/`.

### Publishing a News Announcement

Create a Markdown file in `content/news/`:

```markdown
Title: Feature Name or Announcement Title
Date: 2026-04-01
Slug: short-url-slug
Summary: One sentence shown on the landing page and news index.

Full announcement content here...
```

Posts are sorted by date, newest first. The three most recent automatically appear on the landing page.

## Editing Content

The quickest way to edit a page without a local setup:

1. Navigate to the file on GitHub
2. Press `.` to open the GitHub web editor (VS Code in browser)
3. Edit the Markdown file
4. Commit directly to `main`

The GitHub Action will build and deploy the site automatically within a minute or two.

## Deployment

The site deploys automatically via GitHub Actions on every push to `main`. See `.github/workflows/deploy.yml`.

### First-Time GitHub Pages Setup

1. Go to **Settings → Pages** in the repo
2. Set Source to **GitHub Actions**
3. Push to `main` — the action handles the rest

### Custom Domain

Add a `CNAME` file to the repo root containing your domain:

```
fieldstation42.com
```

Then point your DNS:
- Add a `CNAME` record: `www` → `shane-mason.github.io`
- Or use Cloudflare with an A record pointing to GitHub Pages IPs

## Design

### Color Palette

| Variable | Hex | Use |
|---|---|---|
| `--teal` | `#3D8FA3` | Primary brand, links |
| `--orange` | `#E07A3A` | CTAs, accents, news cards |
| `--amber` | `#F0B429` | Highlights, logo "42" |
| `--cream` | `#F7EFE0` | Page background |
| `--brown-dark` | `#5C3520` | Header, footer, hero |

### Typography

- **Display / headings**: DM Serif Display (Google Fonts)
- **Body**: DM Sans (Google Fonts)
- **Code / monospace**: DM Mono (Google Fonts)

### Sidebar Navigation

The docs sidebar in `page.html` is hardcoded. When adding new pages, update the sidebar links in `theme/templates/page.html` to include them.

## Contributing

Contributions to the documentation are welcome. Fork the repo, edit the relevant Markdown files, and open a pull request. The maintainer reviews and merges — the site rebuilds on merge.

For questions or issues with FieldStation42 itself, use the [main project repo](https://github.com/shane-mason/FieldStation42).
