---
layout: post
title: "LinkedList vs ArrayList: When to Use Each"
date: 2025-10-24
tags: [data-structures, java]
analogy_domain: "train-cars"
series: "data-structures"
series_title: "Data Structures Fundamentals"
series_order: 1
excerpt: "Understand LinkedList vs ArrayList. Learn when to use each based on access patterns and performance characteristics."
description: "Quick guide to LinkedList vs ArrayList for Java interviews."
keywords: linkedlist, arraylist, data structures, java collections, performance
related_concepts:
  - "Big O notation"
  - "Memory layout"
---

## The Problem

You need to store a list of items. Should you use ArrayList or LinkedList? Both implement List interface, but they have completely different performance characteristics. Choosing the wrong one can make your application 100x slower.

---

## The Analogy

**Imagine two different train designs for transporting passengers.**

**ArrayList = One long train with numbered seats**

All passengers sit in one continuous train with numbered seats: Seat 1, Seat 2, Seat 3, up to Seat 100.

Finding passenger in Seat 50:
- Go directly to Seat 50
- Instant access (O(1))

Adding a passenger to Seat 50 (middle insertion):
- Passengers in seats 50-100 must all shift to seats 51-101
- Move 51 people (O(n))

**LinkedList = Individual train cars connected by couplings**

Each passenger sits in a separate train car. Cars are connected by couplings (links). To find a passenger, you must walk through each car one by one.

Finding passenger in Car 50:
- Start at Car 1
- Walk through Car 1, Car 2, Car 3, ... to Car 50
- Slow access (O(n))

Adding a passenger to Car 50 (middle insertion):
- Walk to Car 49
- Disconnect coupling between Car 49 and Car 50
- Insert new car between them
- Reconnect couplings
- Fast insertion once you're there (O(1) insertion, but O(n) to find position)

**The Key Difference:**

- **ArrayList:** Fast access by index, slow insertion/deletion in middle
- **LinkedList:** Slow access by index, fast insertion/deletion at known positions

---

## Quick Comparison

| Operation | ArrayList | LinkedList | Winner |
|-----------|-----------|------------|--------|
| **Get by index** | O(1) | O(n) | ArrayList |
| **Add to end** | O(1) amortized | O(1) | Tie |
| **Add to beginning** | O(n) | O(1) | LinkedList |
| **Add to middle** | O(n) | O(n) | Tie (both slow) |
| **Remove from end** | O(1) | O(1) | Tie |
| **Remove from beginning** | O(n) | O(1) | LinkedList |
| **Memory overhead** | Low | High (2 pointers per node) | ArrayList |
| **Cache locality** | Excellent | Poor | ArrayList |

---

## ArrayList Internal Structure

```java
// ArrayList stores elements in a contiguous array
public class ArrayList<E> {
    private Object[] elementData;  // Backing array
    private int size;

    public E get(int index) {
        return (E) elementData[index];  // Direct access: O(1)
    }

    public boolean add(E element) {
        if (size == elementData.length) {
            resize();  // Double array size when full
        }
        elementData[size++] = element;  // O(1) amortized
        return true;
    }

    public void add(int index, E element) {
        // Shift all elements from index to end
        System.arraycopy(elementData, index,
                        elementData, index + 1, size - index);
        elementData[index] = element;  // O(n) due to shifting
        size++;
    }
}
```

**Key Points:**
- Backed by an array
- Direct index access (array[5] is instant)
- Insertion requires shifting elements
- Resizes when full (expensive but amortized)

---

## LinkedList Internal Structure

```java
// LinkedList stores elements as nodes with pointers
public class LinkedList<E> {
    private Node<E> first;  // Head pointer
    private Node<E> last;   // Tail pointer
    private int size;

    private static class Node<E> {
        E item;
        Node<E> next;     // Link to next node
        Node<E> prev;     // Link to previous node (doubly-linked)
    }

    public E get(int index) {
        Node<E> node = first;
        for (int i = 0; i < index; i++) {
            node = node.next;  // Traverse: O(n)
        }
        return node.item;
    }

    public void addFirst(E element) {
        Node<E> newNode = new Node<>(element);
        newNode.next = first;
        if (first != null) {
            first.prev = newNode;
        }
        first = newNode;  // O(1) at beginning
        size++;
    }

    public void add(int index, E element) {
        // First, traverse to position: O(n)
        Node<E> node = getNode(index);
        // Then insert: O(1)
        Node<E> newNode = new Node<>(element);
        newNode.next = node;
        newNode.prev = node.prev;
        node.prev.next = newNode;
        node.prev = newNode;
        size++;
    }
}
```

**Key Points:**
- Backed by nodes with pointers
- No direct access (must traverse)
- Insertion is fast once you reach the position
- No resizing needed (grows node by node)

---

## When to Use ArrayList

**Use ArrayList when:**
- You access elements by index frequently (list.get(50))
- You iterate through the list sequentially
- You mostly add/remove from the end
- Memory efficiency matters
- Cache performance matters (better locality)

**Real-World Examples:**
```java
// Good: Random access, iterate, add to end
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
System.out.println(names.get(1));  // Fast: O(1)
```

---

## When to Use LinkedList

**Use LinkedList when:**
- You frequently add/remove from beginning or middle
- You implement a queue or deque (addFirst/removeFirst)
- You rarely access by index
- You need a true list with fast insertions at known positions

**Real-World Examples:**
```java
// Good: Queue behavior, add/remove from beginning
Deque<String> queue = new LinkedList<>();
queue.addFirst("Task1");
queue.addFirst("Task2");
queue.removeFirst();  // Fast: O(1)
```

**Bad Use Case:**
```java
// BAD: Accessing by index in a loop
LinkedList<String> list = new LinkedList<>();
for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));  // O(n) per access = O(n²) total!
}

// GOOD: Use iterator instead
for (String item : list) {
    System.out.println(item);  // O(n) total
}
```

---

## Performance Benchmarks

```java
// ArrayList: 1 million random access operations
List<Integer> arrayList = new ArrayList<>();
for (int i = 0; i < 1_000_000; i++) {
    arrayList.add(i);
}
long start = System.nanoTime();
for (int i = 0; i < 1_000_000; i++) {
    arrayList.get(i);  // O(1) per access
}
long end = System.nanoTime();
System.out.println("ArrayList: " + (end - start) / 1_000_000 + "ms");
// Result: ~10ms

// LinkedList: 1 million random access operations
List<Integer> linkedList = new LinkedList<>();
for (int i = 0; i < 1_000_000; i++) {
    linkedList.add(i);
}
start = System.nanoTime();
for (int i = 0; i < 1_000_000; i++) {
    linkedList.get(i);  // O(n) per access
}
end = System.nanoTime();
System.out.println("LinkedList: " + (end - start) / 1_000_000 + "ms");
// Result: ~30,000ms (3000x slower!)
```

---

## Memory Overhead

**ArrayList:**
- Stores only the elements
- Extra capacity for growth (typically 50% empty space)
- Example: 100 elements = 100 references + some empty slots

**LinkedList:**
- Each node stores: element + next pointer + prev pointer
- Example: 100 elements = 100 elements + 200 pointers
- 3x memory overhead compared to ArrayList

---

## Key Interview Points

1. **ArrayList is almost always the better choice** for general use
2. **ArrayList has O(1) random access** via index
3. **LinkedList has O(n) random access** (must traverse)
4. **LinkedList is good for queues/deques** (addFirst/removeFirst)
5. **ArrayList resizes** when full (expensive but amortized)
6. **LinkedList has higher memory overhead** (2 pointers per node)
7. **Never use LinkedList with index-based loops** (O(n²) disaster)
8. **Use ArrayList by default** unless you have a specific reason for LinkedList

---

## Test Your Knowledge

{% include linkedlist-arraylist-quiz.html %}

{% include quiz-script.html %}

---

## TL;DR

ArrayList and LinkedList both implement List but have different performance. ArrayList uses a contiguous array (fast random access O(1), slow middle insertion O(n)). LinkedList uses nodes with pointers (slow random access O(n), fast insertion at known position O(1)). Use ArrayList by default for general-purpose lists. Only use LinkedList when you need queue/deque behavior with frequent addFirst or removeFirst operations. ArrayList has better cache locality and lower memory overhead. LinkedList with index-based access is disastrous (O(n²)). In 99% of cases, choose ArrayList.
