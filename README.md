# remipaccou.blog

Personal site of Rémi Paccou: research, publications and essays.
Built with [Astro](https://astro.build), deployed to GitHub Pages on every push to `main`.

## Everyday tasks

### Write an essay

1. Create a folder in `src/content/writing/` named `YYYY-MM-DD-title-in-lowercase`.
   The name gives the public address: `2026-03-01-my-essay` is served at `/2026/03/01/my-essay/`.
2. Add an `index.md` inside it:

   ```markdown
   ---
   title: "My essay"
   date: 2026-03-01
   description: "One or two sentences shown in lists, in search engines and when the link is shared."
   topic: Energy              # optional
   cover: ./cover.jpg         # optional, a file in the same folder
   coverAlt: "What the cover shows"
   draft: true                # optional, hides the essay from the site
   ---

   Text in Markdown.
   ```

3. Put images in the same folder and reference them with a relative path.
   A title in quotes becomes the caption:

   ```markdown
   ![Description for screen readers](./figure-1.png "Caption shown under the figure")
   ```

Equations use LaTeX, inline `$E = mc^2$` or on their own lines:

```markdown
$$
E_{\min} = k_B\,T \ln(2)
$$
```

Superscripts and subscripts typed as Unicode (10²⁵, E₀) are converted to proper markup.

### Add a publication

Add a BibTeX entry to `src/data/publications.bib`. The page groups entries by
type and sorts them by year. `keywords = {selected}` also lists the entry on the
home page; `note = {...}` is printed after the venue.

### Edit the other pages

| Page          | File                                      |
| ------------- | ----------------------------------------- |
| Home          | `src/pages/index.astro`                   |
| Research      | `src/pages/research.astro`                |
| About         | `src/pages/about.astro`                   |
| Menu, contact links | `src/site.ts`                       |
| Colours, fonts | `src/styles/global.css` (variables at the top) |

## Run it locally

Requires Node.js 22 or later.

```sh
npm install
npm run dev      # http://localhost:4321, reloads on save
npm run build    # writes the site to dist/
```

## Deployment

`.github/workflows/deploy.yml` builds and publishes the site on every push to
`main`. One-time setup in the repository: **Settings > Pages > Source: GitHub Actions**.

Until the custom domain is set, the site is served at
`https://remipaccou.github.io/website/`.

### Custom domain (remipaccou.blog)

1. In the repository: **Settings > Pages > Custom domain**, enter `remipaccou.blog`.
2. At the registrar, replace the existing records for the domain with:

   | Type  | Name | Value                  |
   | ----- | ---- | ---------------------- |
   | A     | @    | 185.199.108.153        |
   | A     | @    | 185.199.109.153        |
   | A     | @    | 185.199.110.153        |
   | A     | @    | 185.199.111.153        |
   | CNAME | www  | remipaccou.github.io   |

3. Once GitHub has verified the domain, tick **Enforce HTTPS**.

Essay addresses are the same as on the former WordPress site, so existing links keep working.
