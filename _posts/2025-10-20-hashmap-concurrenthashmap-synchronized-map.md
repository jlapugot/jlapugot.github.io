---
layout: post
title: "HashMap, ConcurrentHashMap, and Synchronized Maps: Movie Theater Seating Systems"
date: 2025-10-20
tags: [java, concurrency, collections, data-structures, performance]
analogy_domain: "entertainment"
series: "java-concurrency"
series_title: "Java Concurrency Fundamentals"
series_order: 1
excerpt: "Understand the critical differences between HashMap, ConcurrentHashMap, and Synchronized Map through a movie theater seating analogy. Learn which to use for thread-safe, high-performance Java applications."
description: "Master Java concurrency with this comprehensive guide comparing HashMap, ConcurrentHashMap, and synchronized Maps. Includes performance benchmarks, code examples, and best practices for multi-threaded applications."
keywords: java hashmap, concurrenthashmap, synchronized map, java concurrency, thread safety, java collections, lock striping, concurrent programming
related_concepts:
  - "Thread safety and synchronization"
  - "Java Collections Framework"
  - "Lock contention and performance"
---

## The Problem

HashMap is fast but not thread-safe. When multiple threads access it simultaneously, you can get corrupted data or infinite loops. Your options? Use Collections.synchronizedMap() for a quick fix, or ConcurrentHashMap for better performance. But what's the real difference? And when should you use each? The answer lies in understanding how they handle concurrent access.

---

## The Analogy

**Think of these Map implementations as different movie theater seating systems handling multiple customers trying to reserve seats.**

### HashMap - Open Seating, No Tickets

Imagine a movie theater with no ticket system:
- First come, first served - just walk in and sit anywhere
- No coordination, no checks
- Super fast when the theater is empty
- Complete chaos when multiple groups arrive

Two families might try to sit in the same seats. Someone takes your spot while you're getting popcorn. Seats get double-booked. The system breaks down completely with multiple people.

<div class="mermaid">
graph LR
    Customer[Customer] -->|sits anywhere| Theater[Open Seating Theater]
    style Customer fill:#e1f5ff
    style Theater fill:#c8e6c9
</div>

```java
// HashMap - Not thread-safe
Map<String, Seat> seats = new HashMap<>();
seats.put("A12", new Seat("John"));  // Fast, but unsafe with multiple threads
```

### Synchronized Map - One Entrance, One Usher

Now imagine a theater with strict control:
- Only one entrance is open
- One usher manages everything
- Want to check if seat A12 is available? Get in line
- Want to book seat G5? Get in line behind everyone else
- Even just looking at the seating chart requires waiting

This is safe - no double bookings. But it's painfully slow. A hundred people want to book different seats, but they all wait in a single line, processed one at a time.

<div class="mermaid">
graph TB
    Customer1[Customer 1] -.waiting.-> Usher[Single Usher<br/>Entrance]
    Customer2[Customer 2] -.waiting.-> Usher
    Customer3[Customer 3] -->|being served| Usher
    Usher -->|controls all access| Theater[Theater with<br/>Synchronized Seating]

    style Customer3 fill:#c8e6c9
    style Customer1 fill:#ffccbc
    style Customer2 fill:#ffccbc
    style Usher fill:#fff3e0
    style Theater fill:#e1f5ff
</div>

```java
// Synchronized Map - Safe but slow
Map<String, Seat> seats = Collections.synchronizedMap(new HashMap<>());
seats.put("A12", new Seat("John"));  // Thread-safe, but one operation at a time
```

### ConcurrentHashMap - Multiple Aisles, Section Ushers

Instead of one entrance, imagine a modern theater:
- Multiple entrances, each serving different sections
- One usher per aisle (A-C, D-F, G-I, etc.)
- Customer booking seat A12 doesn't block someone booking seat H5
- Different sections operate independently
- Only conflicts when two people want the exact same seat in the same section

This is both safe and fast. Customers are served in parallel unless they happen to need seats in the same section at the same time.

<div class="mermaid">
graph TB
    subgraph "ConcurrentHashMap Theater - Multiple Sections"
        Theater[Theater]

        subgraph SectionA["Aisle A-C (available)"]
            Customer1[Customer 1<br/>Booking A12]
        end

        subgraph SectionB["Aisle D-F (occupied)"]
            Customer2[Customer 2<br/>Booking D5]
        end

        subgraph SectionC["Aisle G-I (available)"]
            Customer3[Customer 3<br/>Booking H8]
        end
    end

    style Customer1 fill:#c8e6c9
    style Customer2 fill:#fff9c4
    style Customer3 fill:#c8e6c9
    style Theater fill:#e1f5ff
    style SectionB fill:#ffccbc
</div>

```java
// ConcurrentHashMap - Safe and fast
Map<String, Seat> seats = new ConcurrentHashMap<>();
seats.put("A12", new Seat("John"));  // Thread-safe with fine-grained locking
```

### How It Maps

| Movie Theater Analogy | Java Map Implementation |
|----------------------|------------------------|
| **Open seating, no tickets** | HashMap - Fast, no synchronization |
| **One entrance, one usher** | Synchronized Map - One lock for everything |
| **Multiple aisles with section ushers** | ConcurrentHashMap - Lock per segment |
| **Getting in line** | Thread acquiring synchronization |
| **Waiting for the usher** | Thread blocking/waiting |
| **Theater sections (A-C, D-F, etc.)** | Internal segments (default 16) |
| **Checking seat availability** | get() operation |
| **Booking a seat** | put() operation |
| **Double booking** | Race condition |
| **Seating chart corruption** | HashMap internal structure corruption |

---

## The Technical Deep Dive

### HashMap - Fast but Dangerous

HashMap offers O(1) average-case performance but provides zero thread safety:

```java
Map<String, String> seats = new HashMap<>();

// Thread 1
seats.put("A12", "John");

// Thread 2 (simultaneously)
seats.put("A12", "Sarah");

// Possible outcomes:
// 1. John's booking wins (lucky timing)
// 2. Sarah's booking wins (overwrites John)
// 3. Both entries lost (race condition)
// 4. Internal structure corrupted (infinite loop on resize)
```

**The danger:** During a resize operation, HashMap rehashes all entries. If another thread modifies the map during this process, the internal structure can become circular, causing infinite loops.

```java
// Real disaster scenario
Map<String, Seat> seats = new HashMap<>();

// Thread 1: Adding many seats, triggers resize
for (int i = 0; i < 1000; i++) {
    seats.put("A" + i, new Seat());  // Resize happens here
}

// Thread 2: Simultaneous modification during resize
seats.put("B1", new Seat());  // Can corrupt internal structure

// Thread 3: Later tries to read
seats.get("A50");  // Infinite loop! Program hangs
```

### Synchronized Map - Safe but Slow

Collections.synchronizedMap() wraps a HashMap with a mutex:

```java
Map<String, String> seats = Collections.synchronizedMap(new HashMap<>());

// Thread 1: Booking a seat
synchronized(seats) {
    seats.put("A12", "John");  // Holds lock on entire map
}

// Thread 2: Just checking availability (must wait!)
synchronized(seats) {
    seats.get("G5");  // Blocked even though just reading different seat
}

// Thread 3: Booking different seat (also waits!)
synchronized(seats) {
    seats.put("Z99", "Mike");  // Different seat, still blocked
}
```

**Key characteristics:**
- Every operation locks the entire map
- Readers block writers and vice versa
- Readers block other readers
- All threads wait in line, even for independent operations

**Performance:** O(1) operations, but with heavy lock contention overhead.

### ConcurrentHashMap - Best of Both Worlds

ConcurrentHashMap uses lock striping - dividing the theater into sections:

```java
Map<String, String> seats = new ConcurrentHashMap<>();

// Thread 1: Booking in section A
seats.put("A12", "John");  // Locks only segment containing "A12"

// Thread 2: Checking section G (simultaneously!)
seats.get("G5");  // No lock needed for reads

// Thread 3: Booking in section H (simultaneously!)
seats.put("H8", "Sarah");  // Locks different segment, doesn't wait

// Thread 4: Booking in section A (must wait for Thread 1)
seats.put("A15", "Mike");  // Same segment as Thread 1, waits briefly
```

**Key features:**
- Lock-free reads (in most cases)
- Fine-grained locking for writes
- Segmented internal structure
- Atomic operations without external synchronization

```java
// Atomic operations built-in
seats.putIfAbsent("A12", "John");  // Atomic: only book if empty
seats.computeIfAbsent("B5", k -> reserveSeat(k));  // Atomic lazy booking
seats.merge("VIP1", "upgrade", (old, val) -> old + "+" + val);  // Atomic update
```

**Internals:**

<div class="mermaid">
graph TB
    subgraph "ConcurrentHashMap Internal Structure"
        CHM[ConcurrentHashMap<br/>Theater]

        CHM --> Seg0[Section 0<br/>Rows A-B]
        CHM --> Seg1[Section 1<br/>Rows C-D]
        CHM --> Seg2[Section 2<br/>Rows E-F]
        CHM --> SegN[Section N<br/>Rows ...]

        Seg0 --> Bucket0[Seat Buckets]
        Seg1 --> Bucket1[Seat Buckets]

        Bucket0 --> Entry1[A12: John]
        Bucket0 --> Entry2[A15: Sarah]
    end

    style CHM fill:#fff3e0
    style Seg0 fill:#e1f5ff
    style Seg1 fill:#e1f5ff
    style Seg2 fill:#e1f5ff
    style SegN fill:#e1f5ff
    style Entry1 fill:#c8e6c9
    style Entry2 fill:#c8e6c9
</div>

### Performance Comparison

```java
// Benchmark scenario: 100 customers, 80% checking seats, 20% booking

// HashMap (with external synchronization)
// Throughput: ~500K ops/sec
// All operations serialized
synchronized(seats) {
    seats.get("A12");
}

// Synchronized Map
// Throughput: ~800K ops/sec
// Slightly better, but still serialized
seats.get("A12");

// ConcurrentHashMap
// Throughput: ~3.5M ops/sec
// Parallel reads, fine-grained write locks
seats.get("A12");  // Lock-free read
```

### Key Points

- **HashMap:** Fastest single-threaded, catastrophic with concurrency
- **Synchronized Map:** Simple thread-safety, poor scalability
- **ConcurrentHashMap:** Best concurrent performance, lock-free reads
- **Trade-off:** ConcurrentHashMap uses more memory (segment overhead)
- **Iteration:** ConcurrentHashMap provides weakly consistent iterators (no ConcurrentModificationException)
- **Null keys/values:** HashMap and Synchronized Map allow nulls; ConcurrentHashMap does not

---

## Where the Analogy Breaks Down

1. **Theater sections are physical** - ConcurrentHashMap segments are logical and can be resized
2. **Ushers are humans who get tired** - Lock-free operations have no fatigue overhead
3. **You can see other customers waiting** - Thread contention isn't visible without profiling tools
4. **Theater has fixed capacity** - HashMap can resize dynamically, though this is expensive
5. **Real tickets are paper** - Java memory model guarantees are more complex than physical objects

---

## When to Use Each Pattern

**HashMap - Good for:**
- Single-threaded applications
- Read-only data after initialization
- Local variables (not shared between threads)
- Maximum performance with no concurrency

**Synchronized Map - Good for:**
- Low-concurrency scenarios (2-3 threads)
- Simple requirements with minimal contention
- Temporary solution until proper design
- Legacy code compatibility
- When you need null keys or values with thread safety

**ConcurrentHashMap - Good for:**
- High-concurrency scenarios (many threads)
- Read-heavy workloads (caches)
- Production systems with multiple threads
- Scalable applications
- When performance matters

**Avoid for:**
- HashMap in multi-threaded code (use thread-safe alternatives)
- Synchronized Map in high-performance systems (use ConcurrentHashMap)
- ConcurrentHashMap for single-threaded code (unnecessary overhead)

---

## Real-World Example

```java
// Movie theater seat reservation system
public class TheaterBookingSystem {
    // Bad: HashMap - double bookings, corruption
    // private Map<String, Booking> seats = new HashMap<>();

    // Better: Synchronized Map - safe but slow during peak hours
    // private Map<String, Booking> seats = Collections.synchronizedMap(new HashMap<>());

    // Best: ConcurrentHashMap - safe and handles rush hour
    private Map<String, Booking> seats = new ConcurrentHashMap<>();

    public Booking checkSeat(String seatNumber) {
        // Lock-free read in ConcurrentHashMap
        return seats.get(seatNumber);
    }

    public Booking reserveSeat(String seatNumber, Customer customer) {
        // Atomic operation - prevents double booking
        return seats.computeIfAbsent(seatNumber,
            seat -> new Booking(seat, customer, LocalDateTime.now()));
    }

    public boolean cancelReservation(String seatNumber, Customer customer) {
        // Atomic removal with validation
        return seats.remove(seatNumber, new Booking(seatNumber, customer));
    }

    public List<String> getAvailableSeats() {
        // Weakly consistent iteration - safe even during modifications
        Set<String> allSeats = getAllSeatNumbers();
        allSeats.removeAll(seats.keySet());
        return new ArrayList<>(allSeats);
    }
}
```

### Production Considerations

```java
// Initialize with expected capacity and concurrency level
Map<String, Booking> seats = new ConcurrentHashMap<>(
    500,  // Initial capacity (number of seats)
    0.75f,  // Load factor
    32  // Concurrency level (number of segments)
);

// For very high concurrency (100+ threads)
Map<String, Booking> seats = new ConcurrentHashMap<>(
    1000,
    0.75f,
    64  // More segments = less contention
);
```

---

## TL;DR

HashMap is like a theater with no ticket system - fast but chaotic when multiple customers arrive. Synchronized Map is like a theater with one entrance and one usher - safe but everyone waits in a single line even for different sections. ConcurrentHashMap is like a modern theater with multiple section ushers - customers are served in parallel unless they need the exact same seat, providing both safety and speed. For high-traffic systems, ConcurrentHashMap is the clear winner.
