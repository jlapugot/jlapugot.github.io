---
layout: post
title: "Deadlock vs Race Condition"
date: 2025-10-20
tags: [java, concurrency]
analogy_domain: "transportation"
series: "java-concurrency"
series_title: "Java Concurrency Fundamentals"
series_order: 2
excerpt: "Learn the difference between deadlocks and race conditions. Both are concurrency bugs, but they require different fixes."
description: "Quick guide to understanding deadlocks vs race conditions in Java."
keywords: deadlock, race condition, java concurrency, thread safety
related_concepts:
  - "Thread synchronization"
  - "Lock ordering"
---

## The Problem

Your multi-threaded app either hangs (deadlock) or has corrupted data (race condition). They're both concurrency bugs, but completely different problems needing different solutions.

---

## The Analogy

**Imagine threads as cars accessing resources (parking spots, intersections).**

**Race Condition = Two cars competing for one parking spot**

Friday night downtown. Only one parking spot available.

- Car A (thread 1) checks: "Is spot 42 free?" YES
- Car B (thread 2) checks: "Is spot 42 free?" YES
- Both get the green light. Both drive toward spot 42. CRASH!

The problem: The check happened at the same time. Both threads saw "free" before either one actually occupied it.

**Result:** Disaster. The system shows spot 42 is booked by both cars simultaneously. Both drivers paid for the same spot. Chaos. And it happens randomly (timing-dependent) so it's hard to debug.

**Deadlock = Circular waiting at a four-way intersection**

Picture a 2x2 grid of roads. Four cars at each side trying to cross:

- Car N (at north) needs to cross going south, but waits for Car E to go first
- Car E (at east) needs to cross going west, but waits for Car S to go first
- Car S (at south) needs to cross going north, but waits for Car W to go first
- Car W (at west) needs to cross going east, but waits for Car N to go first

Nobody moves. Ever. They're all waiting for each other in a circle.

**Result:** Complete standstill. The program hangs forever. No data corruption, but the application is dead.

**The Key Difference:**

- **Race Condition** = Program keeps running but produces wrong results (CRASH, silent corruption)
- **Deadlock** = Program stops and waits forever (HANG, application freezes)

---

## Quick Comparison

| Aspect | Race Condition | Deadlock |
|--------|----------------|----------|
| **Symptom** | Wrong data, corruption | Program hangs forever |
| **Cause** | Threads competing for access | Circular lock dependency |
| **Detection** | Hard (timing-dependent) | Easy (program freezes) |
| **Reproducible** | Intermittent, hard to repeat | Deterministic, easy to repeat |

---

## Race Condition Example

```java
// NOT THREAD-SAFE
public class Counter {
    private int count = 0;

    public void increment() {
        count++;  // Read, add 1, write (not atomic!)
    }
}

// Thread 1: Read count (0) → Add 1 → [pause]
// Thread 2: Read count (0) → Add 1 → Write (1)
// Thread 1: Write (1)
// Expected: 2, Actual: 1 (lost update!)
```

**Fix: Use synchronization or atomic operations**
```java
public class Counter {
    private AtomicInteger count = new AtomicInteger(0);

    public void increment() {
        count.incrementAndGet();  // Atomic
    }
}
```

---

## Deadlock Example

```java
// DEADLOCK RISK
public class BankAccount {
    public void transfer(BankAccount to, int amount) {
        synchronized (this) {           // Thread 1: locks A
            synchronized (to) {         // Thread 1: waits for B
                // ...
            }
        }
    }
}

// Thread 1: A.transfer(B, 100)  → locks A, waits for B
// Thread 2: B.transfer(A, 50)   → locks B, waits for A
// DEADLOCK! Both wait forever
```

**Fix: Always acquire locks in the same order**
```java
public void transfer(BankAccount to, int amount) {
    // Lock accounts by ID order (consistent!)
    BankAccount first = this.id < to.id ? this : to;
    BankAccount second = this.id < to.id ? to : this;

    synchronized (first) {
        synchronized (second) {
            // Transfer happens here
        }
    }
}
```

---

## Prevention Strategies

**Race Conditions:**
- Use `AtomicInteger`, `AtomicReference`, etc.
- Use `synchronized` for compound operations
- Use `ConcurrentHashMap`, `CopyOnWriteArrayList`
- Make data immutable

**Deadlocks:**
- Always acquire locks in the same order
- Use lock timeouts: `lock.tryLock(timeout)`
- Avoid nested locks
- Use higher-level utilities (ExecutorService, CompletableFuture)

---

## Key Interview Points

1. **Race condition**: Multiple threads read stale data → wrong result
2. **Deadlock**: Circular lock dependency → program hangs
3. **Race conditions are silent** - no exception thrown
4. **Deadlocks are obvious** - program freezes
5. **Lock ordering prevents deadlocks** - always acquire in same order

---

## Test Your Knowledge

{% include deadlock-race-quiz.html %}

{% include quiz-script.html %}

---

## TL;DR

Race conditions cause wrong data (two threads corrupt the same value). Deadlocks cause hangs (threads wait for each other in a circle). Fix race conditions with synchronization/atomics. Fix deadlocks with consistent lock ordering. They need different solutions!
