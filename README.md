# Brackets & Basics

> Ace technical interviews with clear explanations and powerful analogies

An interview-focused technical blog for understanding complex software engineering concepts. Concise guides (5-10 minutes each) with analogies, comparison tables, code examples, and key talking points. Perfect for interview prep.

## Local Development

```bash
# Install dependencies
bundle install

# Run locally
bundle exec jekyll serve

# View at http://localhost:4000
```

## Writing a New Post

1. Copy the template:
   ```bash
   cp _posts/_TEMPLATE.md _posts/YYYY-MM-DD-your-post-title.md
   ```

2. Fill in the frontmatter:
   - `title`: Clear, descriptive title
   - `date`: Publication date
   - `tags`: Relevant technical tags
   - `analogy_domain`: The source of your analogy (cooking, sports, etc.)
   - `related_concepts`: Links to related topics

3. Follow the interview-focused structure:
   - The Problem
   - The Analogy
   - Quick Comparison (table)
   - Code Examples
   - When to Use
   - Key Interview Points
   - TL;DR

## Project Structure

```
.
├── _config.yml           # Site configuration
├── _layouts/             # Page templates
│   ├── default.html
│   ├── home.html
│   └── post.html
├── _posts/               # Blog posts
│   ├── _TEMPLATE.md
│   └── YYYY-MM-DD-title.md
├── assets/
│   └── css/
│       └── main.css
├── index.md              # Homepage
├── about.md              # About page
└── topics.md             # Browse by topic/tag
```

## Design Philosophy

- Clean, readable typography
- Mobile-first responsive design
- Minimal distractions
- Code snippets + plain language side-by-side
- Fast load times

## Content Guidelines

- Start with the problem, not the solution
- Use concrete, relatable analogies
- Compare and contrast clearly (use tables)
- Include minimal but practical code examples
- Focus on interview-relevant talking points
- Keep it concise: 5-10 minutes read time
- No fluff, just essential knowledge

## Deployment

This site is automatically deployed via GitHub Pages. Push to `main` and changes go live.

## License

Content is © Julius Lapugot. Feel free to link and reference, but please don't republish without permission.
