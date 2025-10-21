---
layout: default
title: Topics
permalink: /topics/
---

# Browse by Topic

## Series

<div class="series-list">
  <div class="series-card">
    <h3><a href="{{ '/series/spring-framework/' | relative_url }}">Spring Framework Deep Dive</a></h3>
    <p>Master Spring Boot, dependency injection, AOP, and enterprise Java development.</p>
    <div class="series-stats">
      {% assign spring_posts = site.posts | where: "series", "spring-framework" %}
      {{ spring_posts.size }} posts
    </div>
  </div>

  <div class="series-card">
    <h3><a href="{{ '/series/java-concurrency/' | relative_url }}">Java Concurrency Fundamentals</a></h3>
    <p>Master multi-threading, synchronization, and concurrent programming through powerful analogies.</p>
    <div class="series-stats">
      {% assign concurrency_posts = site.posts | where: "series", "java-concurrency" %}
      {{ concurrency_posts.size }} posts
    </div>
  </div>

  <div class="series-card">
    <h3><a href="{{ '/series/algorithms-data-structures/' | relative_url }}">Algorithms & Data Structures</a></h3>
    <p>Master Big O, sorting, searching, trees, graphs, and algorithmic thinking for interviews.</p>
    <div class="series-stats">
      {% assign algo_posts = site.posts | where: "series", "algorithms-data-structures" %}
      {{ algo_posts.size }} posts
    </div>
  </div>

  <div class="series-card">
    <h3><a href="{{ '/series/system-design/' | relative_url }}">System Design Fundamentals</a></h3>
    <p>Master scalability, distributed systems, microservices, and architecture patterns for senior roles.</p>
    <div class="series-stats">
      {% assign design_posts = site.posts | where: "series", "system-design" %}
      {{ design_posts.size }} posts
    </div>
  </div>
</div>

---

## All Tags

<div class="tag-cloud-compact">
{% assign tags = site.tags | sort %}
{% for tag in tags %}
  <a href="{{ '/tag/' | append: tag[0] | downcase | replace: ' ', '-' | append: '/' | relative_url }}" class="tag-badge">
    {{ tag[0] }} <span class="tag-count">{{ tag[1].size }}</span>
  </a>
{% endfor %}
</div>

---

## By Analogy Domain

<div class="domain-grid">
  {% assign cooking_posts = site.posts | where: "analogy_domain", "cooking" %}
  {% if cooking_posts.size > 0 %}
  <a href="{{ '/domain/cooking/' | relative_url }}" class="domain-card">
    <div class="domain-header">
      <h3>Cooking</h3>
      <span class="domain-count">{{ cooking_posts.size }}</span>
    </div>
    <ul class="domain-posts">
      {% for post in cooking_posts limit:3 %}
      <li>{{ post.title }}</li>
      {% endfor %}
    </ul>
    {% if cooking_posts.size > 3 %}
    <span class="domain-view-all">View all {{ cooking_posts.size }} posts →</span>
    {% endif %}
  </a>
  {% endif %}

  {% assign business_posts = site.posts | where: "analogy_domain", "business" %}
  {% if business_posts.size > 0 %}
  <a href="{{ '/domain/business/' | relative_url }}" class="domain-card">
    <div class="domain-header">
      <h3>Business</h3>
      <span class="domain-count">{{ business_posts.size }}</span>
    </div>
    <ul class="domain-posts">
      {% for post in business_posts limit:3 %}
      <li>{{ post.title }}</li>
      {% endfor %}
    </ul>
    {% if business_posts.size > 3 %}
    <span class="domain-view-all">View all {{ business_posts.size }} posts →</span>
    {% endif %}
  </a>
  {% endif %}

  {% assign entertainment_posts = site.posts | where: "analogy_domain", "entertainment" %}
  {% if entertainment_posts.size > 0 %}
  <a href="{{ '/domain/entertainment/' | relative_url }}" class="domain-card">
    <div class="domain-header">
      <h3>Entertainment</h3>
      <span class="domain-count">{{ entertainment_posts.size }}</span>
    </div>
    <ul class="domain-posts">
      {% for post in entertainment_posts limit:3 %}
      <li>{{ post.title }}</li>
      {% endfor %}
    </ul>
    {% if entertainment_posts.size > 3 %}
    <span class="domain-view-all">View all {{ entertainment_posts.size }} posts →</span>
    {% endif %}
  </a>
  {% endif %}

  {% assign library_posts = site.posts | where: "analogy_domain", "library" %}
  {% if library_posts.size > 0 %}
  <a href="{{ '/domain/library/' | relative_url }}" class="domain-card">
    <div class="domain-header">
      <h3>Library</h3>
      <span class="domain-count">{{ library_posts.size }}</span>
    </div>
    <ul class="domain-posts">
      {% for post in library_posts limit:3 %}
      <li>{{ post.title }}</li>
      {% endfor %}
    </ul>
    {% if library_posts.size > 3 %}
    <span class="domain-view-all">View all {{ library_posts.size }} posts →</span>
    {% endif %}
  </a>
  {% endif %}

  {% assign transportation_posts = site.posts | where: "analogy_domain", "transportation" %}
  {% if transportation_posts.size > 0 %}
  <a href="{{ '/domain/transportation/' | relative_url }}" class="domain-card">
    <div class="domain-header">
      <h3>Transportation</h3>
      <span class="domain-count">{{ transportation_posts.size }}</span>
    </div>
    <ul class="domain-posts">
      {% for post in transportation_posts limit:3 %}
      <li>{{ post.title }}</li>
      {% endfor %}
    </ul>
    {% if transportation_posts.size > 3 %}
    <span class="domain-view-all">View all {{ transportation_posts.size }} posts →</span>
    {% endif %}
  </a>
  {% endif %}

  {% assign sports_posts = site.posts | where: "analogy_domain", "sports" %}
  {% if sports_posts.size > 0 %}
  <a href="{{ '/domain/sports/' | relative_url }}" class="domain-card">
    <div class="domain-header">
      <h3>Sports</h3>
      <span class="domain-count">{{ sports_posts.size }}</span>
    </div>
    <ul class="domain-posts">
      {% for post in sports_posts limit:3 %}
      <li>{{ post.title }}</li>
      {% endfor %}
    </ul>
    {% if sports_posts.size > 3 %}
    <span class="domain-view-all">View all {{ sports_posts.size }} posts →</span>
    {% endif %}
  </a>
  {% endif %}

  {% assign music_posts = site.posts | where: "analogy_domain", "music" %}
  {% if music_posts.size > 0 %}
  <a href="{{ '/domain/music/' | relative_url }}" class="domain-card">
    <div class="domain-header">
      <h3>Music</h3>
      <span class="domain-count">{{ music_posts.size }}</span>
    </div>
    <ul class="domain-posts">
      {% for post in music_posts limit:3 %}
      <li>{{ post.title }}</li>
      {% endfor %}
    </ul>
    {% if music_posts.size > 3 %}
    <span class="domain-view-all">View all {{ music_posts.size }} posts →</span>
    {% endif %}
  </a>
  {% endif %}

  {% assign architecture_posts = site.posts | where: "analogy_domain", "architecture" %}
  {% if architecture_posts.size > 0 %}
  <a href="{{ '/domain/architecture/' | relative_url }}" class="domain-card">
    <div class="domain-header">
      <h3>Architecture</h3>
      <span class="domain-count">{{ architecture_posts.size }}</span>
    </div>
    <ul class="domain-posts">
      {% for post in architecture_posts limit:3 %}
      <li>{{ post.title }}</li>
      {% endfor %}
    </ul>
    {% if architecture_posts.size > 3 %}
    <span class="domain-view-all">View all {{ architecture_posts.size }} posts →</span>
    {% endif %}
  </a>
  {% endif %}
</div>
