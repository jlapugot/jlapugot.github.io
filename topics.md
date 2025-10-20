---
layout: default
title: Topics
permalink: /topics/
---

# Browse by Topic

## All Tags

<div class="tag-cloud">
{% assign tags = site.tags | sort %}
{% for tag in tags %}
  <div class="tag-group">
    <h3 id="{{ tag[0] | slugify }}">{{ tag[0] }}</h3>
    <ul>
    {% for post in tag[1] %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span>
      </li>
    {% endfor %}
    </ul>
  </div>
{% endfor %}
</div>

---

## By Analogy Domain

### Cooking
{% assign cooking_posts = site.posts | where: "analogy_domain", "cooking" %}
{% if cooking_posts.size > 0 %}
{% for post in cooking_posts %}
- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}
{% else %}
*No posts yet in this domain.*
{% endif %}

### Entertainment
{% assign entertainment_posts = site.posts | where: "analogy_domain", "entertainment" %}
{% if entertainment_posts.size > 0 %}
{% for post in entertainment_posts %}
- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}
{% else %}
*No posts yet in this domain.*
{% endif %}

### Library
{% assign library_posts = site.posts | where: "analogy_domain", "library" %}
{% if library_posts.size > 0 %}
{% for post in library_posts %}
- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}
{% else %}
*No posts yet in this domain.*
{% endif %}

### Sports
{% assign sports_posts = site.posts | where: "analogy_domain", "sports" %}
{% if sports_posts.size > 0 %}
{% for post in sports_posts %}
- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}
{% else %}
*No posts yet in this domain.*
{% endif %}

### Music
{% assign music_posts = site.posts | where: "analogy_domain", "music" %}
{% if music_posts.size > 0 %}
{% for post in music_posts %}
- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}
{% else %}
*No posts yet in this domain.*
{% endif %}

### Architecture
{% assign architecture_posts = site.posts | where: "analogy_domain", "architecture" %}
{% if architecture_posts.size > 0 %}
{% for post in architecture_posts %}
- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}
{% else %}
*No posts yet in this domain.*
{% endif %}

### Transportation
{% assign transportation_posts = site.posts | where: "analogy_domain", "transportation" %}
{% if transportation_posts.size > 0 %}
{% for post in transportation_posts %}
- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}
{% else %}
*No posts yet in this domain.*
{% endif %}

---

*More domains coming as the blog grows!*
