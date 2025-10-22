---
layout: post
title: "Volatile Keyword: Visibility in Multi-threaded Java"
date: 2025-10-23
tags: [java-concurrency, threading]
analogy_domain: "stock-market"
series: "java-concurrency"
series_title: "Java Concurrency Fundamentals"
series_order: 1
excerpt: "Understand the volatile keyword. Learn how it ensures visibility of changes across threads without using locks."
description: "Quick guide to volatile keyword for senior Java interviews."
keywords: volatile, visibility, memory barrier, java concurrency, threads
related_concepts:
  - "Memory visibility"
  - "Synchronization"
  - "Atomic operations"
---

## The Problem

Thread 1 changes a variable. Thread 2 still sees the old value. Why? Because each thread has its own cache. Changes aren't immediately visible to other threads. The `volatile` keyword forces threads to always read from and write to main memory, guaranteeing visibility.

---

## The Analogy

**Imagine a stock ticker with multiple investors watching.**

**Without Volatile = Cached prices (outdated information)**

Stock ABC is trading at $100.

- Investor A has a copy of the price cached in their office. They see $100.
- Stock exchange updates the price to $150.
- Investor B checks the stock exchange directly and sees $150.
- But Investor A is still looking at their cached copy. They see $100.

Why? Investor A didn't go back to the exchange to check. They're relying on stale cached data. They make decisions based on outdated information.

**With Volatile = Always check the ticker (main memory)**

Stock ABC is trading at $100.

- Investor A watches the stock ticker in the main exchange (not a cached copy).
- Stock exchange updates the price to $150.
- The ticker immediately shows $150.
- Investor A sees $150 instantly.
- All investors watching the ticker see the same price at the same time.

Why? The ticker is a **volatile reference** to the true price. Everyone reads from the same source: the exchange's main memory, not their local cache.

**Key Difference:**

- **Without volatile:** Threads read from their own cache (stale data, inconsistent)
- **With volatile:** Threads always read from main memory (fresh data, consistent)

---

## Quick Comparison

| Aspect | Non-Volatile | Volatile | Synchronized |
|--------|--------------|----------|--------------|
| **Visibility** | No, uses cache | Yes, always main memory | Yes, uses locks |
| **Atomicity** | No | No (single operation only) | Yes, full atomicity |
| **Performance** | Fastest | Fast | Slower (lock overhead) |
| **Use Case** | Simple reads | Flags, boolean checks | Complex operations |

---

## The Problem Without Volatile

```java
public class StockPrice {
    private int price = 100;  // NOT volatile

    public void updatePrice(int newPrice) {
        price = newPrice;  // Thread 1 writes
    }

    public int getPrice() {
        return price;      // Thread 2 reads
    }
}

// Thread 1
stock.updatePrice(150);

// Thread 2
int currentPrice = stock.getPrice();  // May still see 100, not 150!
```

Thread 1 updates the price in its cache. Thread 2 reads from its own cache and sees the old value. The visibility guarantee is missing.

---

## The Solution With Volatile

```java
public class StockPrice {
    private volatile int price = 100;  // VOLATILE

    public void updatePrice(int newPrice) {
        price = newPrice;  // Thread 1 writes to main memory
    }

    public int getPrice() {
        return price;      // Thread 2 reads from main memory
    }
}

// Thread 1
stock.updatePrice(150);

// Thread 2
int currentPrice = stock.getPrice();  // Guaranteed to see 150
```

The `volatile` keyword ensures:
1. **Write visibility:** When Thread 1 writes, the value goes straight to main memory
2. **Read visibility:** When Thread 2 reads, it gets the latest value from main memory
3. **Happens-before guarantee:** All changes before the write are visible after the read

---

## When to Use Volatile

**Use volatile for:**
- Simple flags (boolean shutdown flags)
- Status indicators
- Single primitive values that change frequently
- Visibility without atomicity

```java
public class Server {
    private volatile boolean running = true;

    public void shutdown() {
        running = false;  // All threads see this immediately
    }

    public void run() {
        while (running) {  // Worker thread checks frequently
            // Do work
        }
    }
}
```

**Don't use volatile for:**
- Complex operations (use `synchronized` or `AtomicInteger`)
- Multiple related fields
- Operations that require atomicity (increment, compare-and-swap)

```java
// BAD: volatile doesn't guarantee atomicity
private volatile int counter = 0;

public void increment() {
    counter++;  // NOT atomic! Race condition possible
}

// GOOD: Use Atomic
private AtomicInteger counter = new AtomicInteger(0);

public void increment() {
    counter.incrementAndGet();  // Atomic and visible
}
```

---

## Real-World Examples

**JVM Flag Checking**
```java
public class Application {
    private volatile boolean shutdownRequested = false;

    public void requestShutdown() {
        shutdownRequested = true;
    }

    public void run() {
        while (!shutdownRequested) {
            processRequests();
        }
    }
}
```

**Double-Checked Locking Pattern (Singleton)**
```java
public class Singleton {
    private static volatile Singleton instance = null;

    public static Singleton getInstance() {
        if (instance == null) {  // First check (no lock)
            synchronized (Singleton.class) {
                if (instance == null) {  // Second check (with lock)
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

---

## Memory Barriers

Volatile creates **memory barriers** that prevent instruction reordering:

```java
private volatile int x = 0;
private int y = 0;

// Thread 1
x = 5;      // Write barrier inserted here
y = 10;

// Thread 2 reads
int a = y;  // Read barrier inserted here
int b = x;
```

If Thread 2 sees `x = 5`, it's guaranteed to see `y = 10` as well (happens-before ordering).

---

## Volatile vs Synchronized

| Aspect | Volatile | Synchronized |
|--------|----------|--------------|
| **Visibility** | Yes | Yes |
| **Atomicity** | No | Yes |
| **Lock** | No | Yes (mutual exclusion) |
| **Performance** | Better | Worse (lock contention) |
| **Use** | Simple values | Complex operations |

```java
// Volatile: visibility only
private volatile int count = 0;
count++;  // NOT atomic

// Synchronized: visibility + atomicity
private int count = 0;
synchronized void increment() {
    count++;  // Atomic
}

// Atomic: both, no locks
private AtomicInteger count = new AtomicInteger(0);
count.incrementAndGet();  // Atomic and visible
```

---

## Key Interview Points

1. **Volatile ensures visibility** across threads (not atomicity)
2. **Without volatile** threads may read stale cached values
3. **Volatile writes to main memory** directly, bypassing cache
4. **Volatile reads from main memory** always, not from thread cache
5. **Don't use volatile for counters** (use AtomicInteger instead)
6. **Use volatile for flags and status** (boolean shutdown flags)
7. **Volatile + synchronization** = guaranteed correctness
8. **Memory barriers** prevent instruction reordering with volatile

---

## Test Your Knowledge

{% include volatile-quiz.html %}

{% include quiz-script.html %}

---

## TL;DR

Volatile ensures that all threads see the latest value of a variable stored in main memory, not stale cached copies. Use it for simple flags and status indicators. Volatile guarantees visibility but not atomicity. For complex operations or counters, use synchronized blocks or AtomicInteger instead. Without volatile, one thread's changes may not be immediately visible to other threads, causing bugs that are hard to reproduce. Volatile solves this with memory barriers that force main memory reads and writes.
