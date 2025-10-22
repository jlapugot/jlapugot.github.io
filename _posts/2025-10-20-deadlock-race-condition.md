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

**Think of traffic problems:**

**Race Condition** = Two cars racing for one parking spot
- Both see the spot is empty
- Both drive toward it at the same time
- Collision! Data gets corrupted
- Problem: Timing-dependent, unpredictable

**Deadlock** = Four-way stop gridlock
- Car N waits for Car E
- Car E waits for Car S
- Car S waits for Car W
- Car W waits for Car N
- Nobody moves. Ever.
- Problem: Complete standstill, program hangs

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

## TL;DR

Race conditions cause wrong data (two threads corrupt the same value). Deadlocks cause hangs (threads wait for each other in a circle). Fix race conditions with synchronization/atomics. Fix deadlocks with consistent lock ordering. They need different solutions!
