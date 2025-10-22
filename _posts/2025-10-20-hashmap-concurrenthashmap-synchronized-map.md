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

**Think of these like movie theater seat reservation systems:**

**HashMap** = No reservation system at all
- Anyone can sit anywhere
- Super fast, but chaos when multiple people arrive
- Two customers book the same seat
- The system breaks with concurrent access

**Synchronized Map** = One person controls all bookings
- Only one person handles all reservations
- Safe, but everyone waits in a long line
- Even checking availability requires waiting
- Everyone is blocked, even if booking different sections

**ConcurrentHashMap** = Multiple booking agents for different sections
- Each agent handles their own theater section
- Customers in section A don't wait for section B
- Safe and fast at the same time
- Only blocked if two people want the same exact seat in the same section

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
