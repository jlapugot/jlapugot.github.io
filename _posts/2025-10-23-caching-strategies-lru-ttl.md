---
layout: post
title: "Caching Strategies: LRU, TTL, and Cache Invalidation"
date: 2025-10-23
tags: [system-design, performance]
analogy_domain: "post-office"
series: "system-design"
series_title: "System Design Fundamentals"
series_order: 6
excerpt: "Understand caching strategies. Learn LRU eviction, TTL expiration, and cache invalidation for optimal performance."
description: "Quick guide to caching strategies for system design interviews."
keywords: caching, LRU, TTL, cache invalidation, performance, system design
related_concepts:
  - "Database optimization"
  - "Performance tuning"
---

## The Problem

Your database is slow. Every request queries the database, which is expensive. You need a cache to store frequently accessed data in memory. But cache is limited. When it fills up, which data do you evict? How long do you keep stale data? Cache strategies answer these questions.

---

## The Analogy

**Imagine a hospital supply room with limited shelf space.**

The hospital has thousands of medications and supplies. The supply room can't store everything (limited cache). They keep frequently used items on shelves for quick access. When shelves fill up, they need to decide what to remove or discard.

**The Problem: Shelf space is limited, which items do we keep?**

**LRU (Least Recently Used) = Remove items nobody has used recently**

Item A (bandages) was used 3 days ago.
Item B (pain medication) was used 2 hours ago.
Item C (antibiotics) was used 10 minutes ago.

New item D arrives and shelves are full. Which one do we remove?

LRU removes Item A (least recently used). The logic: if nobody used bandages in 3 days, they probably won't be needed soon. Keep the items actively being used.

Result: High hit rate because we keep items staff frequently requests.

**TTL (Time To Live) = Items expire after a fixed date**

Item A (vaccine) arrived on Oct 1 and marked "good until Nov 1."
- On Oct 15: Still fresh, use from shelf
- On Nov 1: Expired, discard and order new batch

Why? Medications expire. Vaccines lose potency. Blood tests become outdated. Setting an expiration ensures we don't use stale medical supplies.

**Cache Invalidation = Remove specific items when you know they changed**

Item A (medication) is recalled due to contamination. We can't wait for expiration date. We remove it immediately from shelves.

Example: New dosage instructions issued. Discard old batch immediately so staff gets accurate information.

**The Three Strategies Combined:**

- **LRU:** When shelves are full, remove least recently used items
- **TTL:** Items expire after a fixed time period
- **Invalidation:** Remove specific items immediately when you know they are no longer safe/valid

---

## Quick Comparison

| Strategy | Pros | Cons | Best For |
|----------|------|------|----------|
| **LRU** | Simple, high hit rate | Doesn't handle stale data | Frequently accessed data |
| **TTL** | Ensures freshness | May serve stale data before expiry | Time-based data (cache warming) |
| **Invalidation** | Immediate consistency | Requires code changes | User-triggered updates |
| **LRU + TTL** | Hit rate + freshness | More complex | Production systems |

---

## LRU Cache Implementation

**Least Recently Used eviction strategy:**

```java
import java.util.*;

class LRUCache {
    private int capacity;
    private Map<Integer, Integer> cache;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        // LinkedHashMap maintains insertion order
        this.cache = new LinkedHashMap<Integer, Integer>(capacity, 0.75f, true) {
            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
                return size() > capacity;  // Remove least recently used
            }
        };
    }

    public int get(int key) {
        return cache.getOrDefault(key, -1);  // Access updates LRU order
    }

    public void put(int key, int value) {
        cache.put(key, value);  // Inserts or moves to end (most recent)
    }
}
```

**How it works:**
1. Access (get/put) moves item to end (most recently used)
2. When cache is full, remove from front (least recently used)
3. Result: High hit rate for frequently accessed data

---

## TTL Cache Implementation

**Time To Live expiration strategy:**

```java
class CacheEntry<V> {
    V value;
    long expiryTime;

    CacheEntry(V value, long ttlMillis) {
        this.value = value;
        this.expiryTime = System.currentTimeMillis() + ttlMillis;
    }

    boolean isExpired() {
        return System.currentTimeMillis() > expiryTime;
    }
}

class TTLCache<K, V> {
    private Map<K, CacheEntry<V>> cache = new HashMap<>();

    public void put(K key, V value, long ttlMillis) {
        cache.put(key, new CacheEntry<>(value, ttlMillis));
    }

    public V get(K key) {
        CacheEntry<V> entry = cache.get(key);
        if (entry == null || entry.isExpired()) {
            cache.remove(key);  // Clean up expired
            return null;
        }
        return entry.value;
    }
}
```

**How it works:**
1. Store value with expiration timestamp
2. Check if expired on access
3. Result: Automatic freshness, no manual invalidation needed

---

## Cache Invalidation (Hardest Problem)

**Invalidate on write:**

```java
class UserCache {
    private Map<Integer, User> cache = new HashMap<>();

    public User getUser(int userId) {
        if (cache.containsKey(userId)) {
            return cache.get(userId);  // Cache hit
        }
        User user = database.getUser(userId);
        cache.put(userId, user);  // Cache miss, fetch and store
        return user;
    }

    public void updateUser(int userId, User newData) {
        database.updateUser(userId, newData);
        cache.remove(userId);  // Invalidate immediately
    }
}
```

**The hardest part of caching: "There are only two hard things in Computer Science: cache invalidation and naming things."**

---

## Real-World Caching Strategies

**Redis (In-memory cache)**
```
SET user:123 '{"name": "Alice"}' EX 3600  # TTL: 1 hour
GET user:123  # Returns data or nil if expired
DEL user:123  # Manual invalidation
```

**Web Browser Cache**
- LRU: Limited storage, removes least used pages
- TTL: Expires based on Cache-Control headers
- Invalidation: User force-refresh (Ctrl+Shift+R)

**CDN Cache**
- TTL: Cache-Control max-age (e.g., 24 hours)
- Invalidation: Manual purge when content updates
- LRU: Automatic eviction when storage full

**Database Query Cache**
```java
// Cache with TTL + manual invalidation
cache.put("SELECT * FROM users", results, 300);  // 5 min TTL

// When data changes, invalidate
cache.remove("SELECT * FROM users");
```

---

## When to Use Each

**Use LRU when:**
- Data doesn't change frequently
- You want automatic optimization
- Hit rate matters most (e.g., hot data)

**Use TTL when:**
- Data changes regularly (prices, stock, weather)
- Eventual consistency is acceptable
- You want automatic cleanup without manual invalidation

**Use Invalidation when:**
- Data must be fresh immediately
- Changes are infrequent
- Consistency is critical (user profile, payment info)

**Use LRU + TTL when:**
- Data has both frequency and freshness requirements
- You need both high hit rate and reasonable freshness
- This is the production approach

---

## Key Interview Points

1. **Cache solves the speed problem** but introduces complexity
2. **LRU eviction removes least recently used** items when cache is full
3. **TTL expires data after fixed time** ensuring eventual freshness
4. **Cache invalidation is the hardest problem** in caching
5. **LRU optimizes for hit rate** (performance)
6. **TTL optimizes for freshness** (consistency)
7. **Combine LRU + TTL** in production for both benefits
8. **Cache stampede** occurs when many requests miss at once (use TTL + background refresh)

---

## Test Your Knowledge

{% include caching-quiz.html %}

{% include quiz-script.html %}

---

## TL;DR

Caching stores frequently accessed data in fast memory to avoid expensive database queries. LRU evicts least recently used items when cache is full (high hit rate). TTL expires data after fixed time (automatic freshness). Invalidation removes data immediately when you know it changed (manual but consistent). Most production systems use LRU for eviction strategy with TTL for freshness guarantees. Cache invalidation is notoriously hard. Choose based on your data: frequently accessed and rarely changing? Use LRU. Changes often? Use TTL or invalidation.
