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
{% for post in cooking_posts %}
- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}

### Sports
{% assign sports_posts = site.posts | where: "analogy_domain", "sports" %}
{% for post in sports_posts %}
- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}

### Music
{% assign music_posts = site.posts | where: "analogy_domain", "music" %}
{% for post in music_posts %}
- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}

### Architecture
{% assign architecture_posts = site.posts | where: "analogy_domain", "architecture" %}
{% for post in architecture_posts %}
- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}

### Transportation
{% assign transportation_posts = site.posts | where: "analogy_domain", "transportation" %}
{% for post in transportation_posts %}
- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}

---

*More domains coming as the blog grows!*
