---
layout: post
title: "Producer-Consumer Pattern: Thread Communication with Blocking Queues"
date: 2025-10-24
tags: [java-concurrency, threading, design-patterns]
analogy_domain: "coffee-shop"
series: "java-concurrency"
series_title: "Java Concurrency Fundamentals"
series_order: 2
excerpt: "Understand the Producer-Consumer pattern. Learn how to coordinate multiple threads using blocking queues for efficient task processing."
description: "Quick guide to Producer-Consumer pattern for Java interviews."
keywords: producer-consumer, blocking queue, thread communication, java concurrency, design patterns
related_concepts:
  - "Thread synchronization"
  - "Blocking queues"
  - "Thread pools"
---

## The Problem

You have multiple threads producing tasks and multiple threads consuming tasks. Without coordination, producers might overwhelm consumers or consumers might starve waiting for work. You need a thread-safe buffer that blocks producers when full and blocks consumers when empty. This is the Producer-Consumer pattern.

---

## The Analogy

**Imagine a coffee shop with baristas and customers.**

**Without Producer-Consumer (Chaos):**

3 baristas making coffee. 20 customers waiting.

- Barista 1 finishes a latte. Yells "Latte ready!" Customers rush forward. Collision.
- Barista 2 finishes a cappuccino. No place to put it. Counter is full. Barista waits.
- Customer Alice wants her order. No system to track what's ready. Checks every drink.

Result: Chaos. Lost orders. Angry customers. Inefficient baristas.

**With Producer-Consumer (Organized):**

Same coffee shop, but now there's a **pickup counter** (blocking queue) with 5 slots.

**Producers (Baristas):**
- Barista 1 finishes a latte. Puts it on the counter (queue).
- Counter has space? Place it. Counter full (5 drinks waiting)? Wait until a customer picks one up.

**Consumers (Customers):**
- Customer Alice checks the counter. Drink ready? Take it. Counter empty? Wait until a barista places one.

**The Counter (Blocking Queue):**
- Fixed capacity: 5 drinks maximum
- Blocks producers: If counter full, baristas wait
- Blocks consumers: If counter empty, customers wait
- Thread-safe: Multiple baristas and customers can access safely

**Key Benefits:**
- **Decoupling:** Baristas and customers don't directly interact
- **Buffering:** Counter absorbs bursts (3 orders at once? Counter queues them)
- **Blocking:** Automatic waiting when full or empty (no busy-waiting)
- **Thread-safe:** Java's BlockingQueue handles synchronization

---

## Quick Comparison

| Aspect | Without Pattern | With Pattern |
|--------|----------------|--------------|
| **Coordination** | Manual, error-prone | Automatic via BlockingQueue |
| **Thread safety** | Must implement yourself | Built-in |
| **Blocking** | Busy-waiting (wasteful) | Efficient blocking |
| **Decoupling** | Tight coupling | Loose coupling |
| **Buffer** | None, overflow issues | Fixed-size buffer |

---

## Producer-Consumer Implementation

**Using BlockingQueue:**

```java
import java.util.concurrent.*;

class CoffeeShop {
    // Blocking queue with capacity 5 (the counter)
    private BlockingQueue<String> counter = new ArrayBlockingQueue<>(5);

    // Producer: Barista making coffee
    class Barista implements Runnable {
        public void run() {
            try {
                while (true) {
                    String coffee = makeCoffee();  // Produce
                    counter.put(coffee);  // Blocks if counter is full
                    System.out.println("Barista placed: " + coffee);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        private String makeCoffee() throws InterruptedException {
            Thread.sleep(1000);  // Simulate brewing time
            return "Coffee-" + System.currentTimeMillis();
        }
    }

    // Consumer: Customer picking up coffee
    class Customer implements Runnable {
        public void run() {
            try {
                while (true) {
                    String coffee = counter.take();  // Blocks if counter is empty
                    System.out.println("Customer picked up: " + coffee);
                    Thread.sleep(2000);  // Simulate drinking time
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    public void start() {
        // Start 2 baristas (producers)
        new Thread(new Barista()).start();
        new Thread(new Barista()).start();

        // Start 3 customers (consumers)
        new Thread(new Customer()).start();
        new Thread(new Customer()).start();
        new Thread(new Customer()).start();
    }
}
```

**How it works:**
1. `put(item)` - Add to queue, blocks if full
2. `take()` - Remove from queue, blocks if empty
3. Thread-safe internally (no manual synchronization needed)

---

## BlockingQueue Variants

**ArrayBlockingQueue (Fixed capacity):**
```java
BlockingQueue<String> queue = new ArrayBlockingQueue<>(10);
// Fixed size: 10 elements max
// Backed by array
// Fair mode available
```

**LinkedBlockingQueue (Optional capacity):**
```java
BlockingQueue<String> queue = new LinkedBlockingQueue<>();  // Unbounded
BlockingQueue<String> queue = new LinkedBlockingQueue<>(10);  // Bounded
// Backed by linked nodes
// Better throughput than ArrayBlockingQueue
```

**PriorityBlockingQueue (Ordered):**
```java
BlockingQueue<Task> queue = new PriorityBlockingQueue<>();
// Elements sorted by priority
// Unbounded
// take() returns highest priority element
```

**SynchronousQueue (No capacity):**
```java
BlockingQueue<String> queue = new SynchronousQueue<>();
// Zero capacity
// Handoff: producer waits until consumer ready
// Used in Executors.newCachedThreadPool()
```

---

## Real-World Example: Thread Pool

```java
class TaskProcessor {
    private BlockingQueue<Runnable> taskQueue = new LinkedBlockingQueue<>(100);
    private List<Thread> workers = new ArrayList<>();

    public TaskProcessor(int numThreads) {
        // Start worker threads (consumers)
        for (int i = 0; i < numThreads; i++) {
            Thread worker = new Thread(() -> {
                while (true) {
                    try {
                        Runnable task = taskQueue.take();  // Block until task available
                        task.run();  // Execute task
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            });
            worker.start();
            workers.add(worker);
        }
    }

    // Producer: Submit tasks
    public void submitTask(Runnable task) throws InterruptedException {
        taskQueue.put(task);  // Block if queue is full
    }
}
```

---

## Common Interview Questions

**Q: Why use BlockingQueue instead of synchronized ArrayList?**
- BlockingQueue has built-in blocking (put/take)
- No busy-waiting (efficient CPU usage)
- Thread-safe by design
- Prevents race conditions

**Q: What happens if producer is faster than consumer?**
- Queue fills up
- Producer blocks on `put()`
- Backpressure applied automatically
- System self-regulates

**Q: What's the difference between put() and offer()?**
```java
queue.put(item);       // Blocks if full, waits forever
queue.offer(item);     // Returns false immediately if full
queue.offer(item, 1, TimeUnit.SECONDS);  // Waits 1 second, then returns false
```

**Q: What's the difference between take() and poll()?**
```java
queue.take();          // Blocks if empty, waits forever
queue.poll();          // Returns null immediately if empty
queue.poll(1, TimeUnit.SECONDS);  // Waits 1 second, then returns null
```

---

## When to Use Producer-Consumer

**Use Producer-Consumer when:**
- Multiple threads produce data, multiple threads consume
- Producers and consumers run at different speeds
- You need buffering to handle bursts
- You want decoupling between producers and consumers

**Real-World Examples:**
- Web server: Request threads (producers) add tasks, worker threads (consumers) process
- Log processing: Multiple services (producers) log events, log writer (consumer) writes to disk
- Message queues: Publishers (producers) send messages, subscribers (consumers) process
- Video streaming: Decoder (producer) outputs frames, renderer (consumer) displays

---

## Key Interview Points

1. **Producer-Consumer decouples producers from consumers** using a buffer (queue)
2. **BlockingQueue provides thread-safe coordination** automatically
3. **put() blocks when full, take() blocks when empty** (no busy-waiting)
4. **ArrayBlockingQueue is bounded** (fixed capacity)
5. **LinkedBlockingQueue is optionally bounded** (unbounded by default)
6. **Prevents overwhelm:** Queue fills up, producers wait (backpressure)
7. **Prevents starvation:** Queue empties, consumers wait
8. **Thread pools use Producer-Consumer internally** (ExecutorService)

---

## Test Your Knowledge

{% include producer-consumer-quiz.html %}

{% include quiz-script.html %}

---

## TL;DR

Producer-Consumer pattern coordinates multiple producer threads and consumer threads using a shared buffer (BlockingQueue). Producers add items to the queue, consumers remove items. BlockingQueue handles thread safety automatically. put() blocks when queue is full, take() blocks when queue is empty. This prevents overwhelming consumers (backpressure) and prevents starving consumers (blocking). Use ArrayBlockingQueue for fixed capacity or LinkedBlockingQueue for flexible capacity. Real-world examples include thread pools, web servers, and message queues. Decouples producers from consumers, making systems more flexible and maintainable.
