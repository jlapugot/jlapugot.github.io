---
layout: post
title: "Java Threads: Creation and Lifecycle"
date: 2025-10-20
tags: [java, concurrency]
analogy_domain: "business"
series: "java-concurrency"
series_title: "Java Concurrency Fundamentals"
series_order: 3
excerpt: "Learn how to create threads and manage their lifecycle. Understand thread states and why thread pools are essential."
description: "Quick guide to Java thread creation, lifecycle, and thread pools for interviews."
keywords: java threads, thread lifecycle, executorservice, thread pools
related_concepts:
  - "Thread synchronization"
  - "Concurrency utilities"
---

## The Problem

One thread handles everything sequentially - slow. Create too many threads - resource waste. How many threads should you create? When? How do you manage their lifecycle?

---

## The Analogy

**Imagine a call center with different staffing approaches.**

**Single Thread = One overworked operator**

You have 5 customer calls waiting (each takes 5 seconds).
- Customer 1 calls: Operator answers, handles 5 seconds
- Customer 2 calls: Waits. Still waiting...
- Customer 3 calls: Still waiting...
- Customer 4, 5: Still waiting...

Total time: Customer 5 gets helped at 25 seconds. Customers are angry.

**Multiple Threads = Hiring more operators**

You hire 5 operators (5 threads).
- Customer 1: Operator 1 handles (0-5 seconds)
- Customer 2: Operator 2 handles (0-5 seconds)
- Customer 3: Operator 3 handles (0-5 seconds)
- Customer 4: Operator 4 handles (0-5 seconds)
- Customer 5: Operator 5 handles (0-5 seconds)

Total time: 5 seconds. All customers served simultaneously.

But hiring new operators costs money (creating threads is expensive in real systems).

**Thread Pool = Reusing the same 5 operators for many calls**

You have 5 permanent staff operators.
- Operator 1 finishes customer 1, immediately takes customer 6
- Operator 2 finishes customer 2, immediately takes customer 7
- No hiring overhead, no firing, just reuse

Total time with 100 calls: Still efficient (100 calls ÷ 5 operators = 20 batches, reusing same staff)

**Key Interview Insight:**
- **Threads enable parallelism.** Multiple tasks run at the same time, not sequentially.
- **Thread creation is expensive.** Don't create a new thread per task.
- **Thread pools are the solution.** Create once, reuse forever.

---

## Thread Creation

**Method 1: Extend Thread class**
```java
class MyThread extends Thread {
    public void run() {
        System.out.println("Thread is running");
    }
}

MyThread t = new MyThread();
t.start();  // Calls run() in a separate thread
```

**Method 2: Implement Runnable (preferred)**
```java
Thread t = new Thread(() -> {
    System.out.println("Thread is running");
});
t.start();  // Calls run() in a separate thread
```

**Never call `run()` directly** - it runs in current thread, not a new thread!
```java
t.run();    // WRONG - runs in main thread
t.start();  // RIGHT - runs in new thread
```

---

## Thread Lifecycle States

```
NEW → RUNNABLE → RUNNING → (BLOCKED/WAITING/TIMED_WAITING) → RUNNING → TERMINATED
```

- **NEW**: Thread created but not started
- **RUNNABLE**: Thread started, ready to run
- **RUNNING**: Currently executing
- **BLOCKED/WAITING**: Waiting for lock or I/O
- **TERMINATED**: Finished

```java
Thread t = new Thread(() -> {});

System.out.println(t.getState());  // NEW
t.start();
System.out.println(t.getState());  // RUNNABLE
```

---

## Thread Pools (ExecutorService)

**Don't create threads manually for production code.** Use thread pools:

```java
// Create pool of 5 threads
ExecutorService executor = Executors.newFixedThreadPool(5);

// Submit tasks
executor.submit(() -> System.out.println("Task 1"));
executor.submit(() -> System.out.println("Task 2"));
executor.submit(() -> System.out.println("Task 3"));

// Shutdown
executor.shutdown();  // Stop accepting new tasks
executor.awaitTermination(10, TimeUnit.SECONDS);  // Wait for existing tasks
```

**Why thread pools?**
- Reuse threads (no creation/destruction overhead)
- Control thread count (prevent resource exhaustion)
- Queue tasks automatically
- Handle thread management for you

---

## Thread Methods

| Method | What it does |
|--------|------------|
| `t.start()` | Start thread (calls run()) |
| `t.join()` | Wait for thread to finish |
| `t.sleep(1000)` | Pause current thread for 1 second |
| `t.interrupt()` | Send signal to interrupt thread |
| `t.getName()` | Get thread name |
| `t.getState()` | Get thread state |
| `Thread.currentThread()` | Get current thread |

```java
Thread t = new Thread(() -> {
    System.out.println("Starting: " + Thread.currentThread().getName());
    try {
        Thread.sleep(2000);  // Sleep 2 seconds
    } catch (InterruptedException e) {
        System.out.println("Interrupted!");
    }
});

t.start();
t.join();  // Wait for t to finish
System.out.println("All done");
```

---

## Common Patterns

**Waiting for multiple threads:**
```java
ExecutorService executor = Executors.newFixedThreadPool(5);

for (int i = 0; i < 10; i++) {
    executor.submit(() -> doWork());
}

executor.shutdown();
executor.awaitTermination(1, TimeUnit.MINUTES);
System.out.println("All tasks complete");
```

**Timeout with ExecutorService:**
```java
ExecutorService executor = Executors.newFixedThreadPool(3);
List<Future<Integer>> futures = new ArrayList<>();

for (int i = 0; i < 10; i++) {
    futures.add(executor.submit(() -> expensiveComputation()));
}

for (Future<Integer> future : futures) {
    try {
        Integer result = future.get(5, TimeUnit.SECONDS);  // 5 second timeout
    } catch (TimeoutException e) {
        System.out.println("Task took too long");
    }
}
```

---

## Key Interview Points

1. **Thread pools are essential** for production code
2. **Always call `start()`, never `run()`** directly
3. **`join()` waits** for a thread to finish
4. **`sleep()` pauses** the current thread
5. **ExecutorService handles** thread lifecycle for you
6. **Too many threads = resource waste** (limit with fixed thread pool)

---

## Test Your Knowledge

{% include java-thread-quiz.html %}

{% include quiz-script.html %}

---

## TL;DR

Create threads using `new Thread(() -> {}).start()`. Use thread pools (ExecutorService) for production. Never manually create 1000 threads - use `newFixedThreadPool(50)` instead. Always call `start()`, not `run()`. Use `join()` to wait for threads to finish. Let the framework manage complexity.
