# Brackets & Blueprints

> Complex engineering concepts explained through powerful analogies

A technical blog focused on simplifying complex software engineering topics using relatable analogies. Because the ability to explain is as important as the ability to build.

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

3. Follow the structure:
   - The Problem
   - The Analogy
   - How It Maps
   - Technical Deep Dive
   - Where the Analogy Breaks Down
   - When to Use This Pattern
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
- Be explicit about mappings
- Acknowledge where analogies break down
- Include practical examples
- Keep it concise but complete

## Deployment

This site is automatically deployed via GitHub Pages. Push to `main` and changes go live.

## License

Content is © Julius Lapugot. Feel free to link and reference, but please don't republish without permission.
