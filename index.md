---
layout: home
title: Home
---

# Welcome to Brackets & Blueprints

> *"If you can't explain it simply, you don't understand it well enough."*

This blog explores complex engineering concepts through powerful analogies. Each post breaks down technical topics by connecting them to familiar experiences, making even the most intricate systems understandable.

## Why Analogies?

The ability to simplify complex ideas isn't just about teaching—it's a sign of deep mastery. When you truly understand a system, you can see its parallels everywhere.

---

## Latest Posts

<div class="posts">
  {% for post in site.posts limit:10 %}
    <article class="post-preview">
      <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <p class="post-meta">
        <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span>
        {% if post.series %}
        <span class="post-series-badge">{{ post.series_title | default: post.series }}</span>
        {% endif %}
      </p>
      {% if post.tags %}
      <div class="post-tags-home">
        {% for tag in post.tags %}
          <a href="{{ '/tag/' | append: tag | downcase | replace: ' ', '-' | append: '/' | relative_url }}" class="post-tag">{{ tag }}</a>
        {% endfor %}
      </div>
      {% endif %}
    </article>
  {% endfor %}
</div>
