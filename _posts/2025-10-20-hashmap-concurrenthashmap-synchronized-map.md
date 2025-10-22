---
layout: post
title: "HashMap vs ConcurrentHashMap vs Synchronized Map"
date: 2025-10-20
tags: [java, concurrency]
analogy_domain: "entertainment"
series: "java-concurrency"
series_title: "Java Concurrency Fundamentals"
series_order: 1
excerpt: "Understand when to use HashMap, ConcurrentHashMap, and Synchronized Map. Learn the key differences for multi-threaded Java applications."
description: "Quick guide to choosing the right Map for thread safety and performance in Java."
keywords: hashmap, concurrenthashmap, synchronized map, java concurrency, thread safety
related_concepts:
  - "Thread safety"
  - "Lock contention"
---

## The Problem

You need a map in a multi-threaded application. Should you use HashMap, Synchronized Map, or ConcurrentHashMap? Each has different safety and performance characteristics.

---

## The Analogy

**Imagine a movie theater with 100 seats and a busy Friday night.**

**HashMap = No system at all**

100 people walk in simultaneously. Everyone rushes to grab seats. No coordination. No locking. Chaos.
- Person A sits in seat 42
- Person B also sits in seat 42 (same seat!)
- Person C sits in seat 50
- Person D sits in seat 50 (same seat!)

Result: Disaster. Multiple people claiming the same seats. The system is broken when multiple people access it at the same time. Super fast, but completely unusable.

**Synchronized Map = One usher for the entire theater**

All 100 people line up at a single booth. One usher controls ALL seat assignments:
- "Person 1, checking seat 42?"
- "Person 2, finding a seat?"
- Everyone waits in line, even if they want different sections

The usher is safe. No double bookings. But there's a massive bottleneck:
- 99 people waiting while usher helps one person
- Even just asking "Is seat 42 free?" requires everyone to wait
- Person wanting section A blocks person wanting section Z

**ConcurrentHashMap = Multiple ushers, one per section**

Theater divided into 5 sections with separate ushers:
- Usher for Section A handles seats 1-20
- Usher for Section B handles seats 21-40
- Usher for Section C handles seats 41-60
- etc.

Now 100 people can check availability simultaneously:
- 20 people in section A ask their usher (no waiting on other sections)
- 20 people in section B ask their usher (independent)
- Only blocked if two people want the SAME seat in the SAME section (their section's usher handles that collision)

Result: **Safe AND fast. The best of both worlds.**

---

## Quick Comparison

| Feature | HashMap | Synchronized Map | ConcurrentHashMap |
|---------|---------|------------------|-------------------|
| Thread-safe | No | Yes | Yes |
| Performance | Very fast | Slow | Fast |
| Good for | Single thread | Low concurrency | High concurrency |
| Allows nulls | Yes | Yes | No |

---

## Code Examples

**HashMap (NOT thread-safe):**
```java
Map<String, String> map = new HashMap<>();
map.put("A12", "John");  // Fine in single thread, dangerous with multiple threads
```

**Synchronized Map (Thread-safe but slow):**
```java
Map<String, String> map = Collections.synchronizedMap(new HashMap<>());
map.put("A12", "John");  // Safe, but locks entire map on every operation
map.get("G5");           // Blocked even though it's a different seat
```

**ConcurrentHashMap (Thread-safe AND fast):**
```java
Map<String, String> map = new ConcurrentHashMap<>();
map.put("A12", "John");  // Locks only the segment containing "A12"
map.get("G5");           // Doesn't need to wait - lock-free reads
```

---

## When to Use Each

**HashMap:**
- Single-threaded code
- Read-only after initialization
- Maximum performance with no concurrency

**Synchronized Map:**
- Very low concurrency (2-3 threads)
- Simple code, don't care about performance
- Legacy code requirements

**ConcurrentHashMap:**
- Multi-threaded applications
- Production code with multiple threads
- High-traffic systems
- Caches or concurrent collections

---

## Key Interview Points

1. **HashMap is not thread-safe** - Multiple threads can corrupt it
2. **Synchronized Map locks everything** - All threads wait, even for independent operations
3. **ConcurrentHashMap uses lock striping** - Divides the map into segments, each with its own lock
4. **ConcurrentHashMap has lock-free reads** - Most read operations don't need synchronization
5. **ConcurrentHashMap doesn't allow nulls** - HashMap and Synchronized Map do

---

## Test Your Knowledge

{% include hashmap-quiz.html %}

{% include quiz-script.html %}

---

## TL;DR

Use **ConcurrentHashMap** for multi-threaded code. It's both safe and fast. Use **Synchronized Map** only if you must have null support or are adding thread-safety to existing HashMap code. Never use **HashMap** in concurrent code - it can deadlock or corrupt data.
