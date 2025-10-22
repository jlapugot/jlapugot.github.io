---
layout: post
title: "Big O Notation: Time Complexity Explained"
date: 2025-10-20
tags: [algorithms]
analogy_domain: "library"
series: "algorithms-data-structures"
series_title: "Algorithms & Data Structures"
series_order: 1
excerpt: "Understand Big O notation through simple library analogies. Master O(1), O(log n), O(n), O(n log n), and O(n²)."
description: "Quick guide to Big O time complexity for technical interviews."
keywords: big o notation, time complexity, algorithm analysis
related_concepts:
  - "Space complexity"
  - "Algorithm optimization"
---

## The Problem

What does O(n²) mean? Why is O(log n) better than O(n)? How do you identify Big O in code?

---

## The Analogy

**Imagine searching for a specific book in libraries of different sizes. "n" = number of books.**

**O(1) = Knowing the exact location**

Your friend says "Harry Potter is in the top-left corner of shelf 5."
- 100 books? Go directly there. Done in 1 step.
- 1 million books? Go directly there. Still 1 step.
- 1 billion books? Go directly there. Still 1 step.

Time doesn't change based on library size.

**O(log n) = Binary search with a card catalog**

Library has 1 million books organized alphabetically. You're searching for "Potter, Harry."
- Check middle of catalog: "M" = too low
- Check middle-right: "S" = too high
- Check middle-left: "P" = found it!
- Only ~20 steps for 1 million books (each step eliminates half the remaining books)

**O(n) = Walking through every aisle**

You want to find all books by Stephen King. No organization, just walk past every single book:
- 1,000 books = 1,000 checks
- 1,000,000 books = 1,000,000 checks
- Time scales linearly with library size

**O(n²) = Compare every book to every other book**

You want to find duplicate copies (compare each book to all others):
- 1,000 books = 1,000 × 1,000 = 1 million comparisons
- 1,000,000 books = 1,000,000 × 1,000,000 = 1 trillion comparisons
- Terrible. Avoid this in interviews.

**O(n log n) = Sorting efficiently**

You want to alphabetize 1 million books in the library. A naive approach would compare every book to every other (n²) which is 1 trillion comparisons.

But smart sorting algorithms (like merge sort) do it differently:
- Divide the books into smaller piles
- Sort each pile individually
- Merge the sorted piles back together

Result:
- 1,000 books = ~10,000 steps (1,000 × 10)
- 1,000,000 books = ~20,000,000 steps (1,000,000 × 20)

Much better than n² but slower than n. This is the sweet spot for sorting large datasets.

---

## Code Examples

**O(1) - Constant Time:**
```java
map.get("key");           // HashMap lookup
array[5];                 // Array access by index
```

**O(log n) - Logarithmic:**
```java
// Binary search on sorted array
int left = 0, right = arr.length - 1;
while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
}
```

**O(n) - Linear:**
```java
for (int i = 0; i < arr.length; i++) {
    if (arr[i] == target) return i;
}
```

**O(n log n) - Linearithmic:**
```java
Arrays.sort(arr);  // Merge sort, quick sort, heap sort
Collections.sort(list);
```

**O(n²) - Quadratic:**
```java
for (int i = 0; i < arr.length; i++) {
    for (int j = i + 1; j < arr.length; j++) {
        compare(arr[i], arr[j]);  // Nested loops = slow!
    }
}
```

---

## How to Identify Big O

**Drop constants:**
```java
// This is O(n), not O(2n)
for (int i = 0; i < n; i++) { }  // n
for (int i = 0; i < n; i++) { }  // n
// Total: 2n → simplifies to O(n)
```

**Drop lower-order terms:**
```java
// This is O(n²), not O(n² + n)
for (int i = 0; i < n; i++) { }      // n
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++) { }  // n²
// n + n² → simplifies to O(n²)
```

**Different inputs = different variables:**
```java
// This is O(a * b), not O(n²)
for (int i = 0; i < arr1.length; i++)
    for (int j = 0; j < arr2.length; j++)
        compare(arr1[i], arr2[j]);
```

---

## Practical Comparison (n = 1,000,000)

| Big O | Operations | Time |
|-------|-----------|------|
| O(1) | 1 | Instant |
| O(log n) | 20 | Instant |
| O(n) | 1M | 1 sec |
| O(n log n) | 20M | 20 sec |
| O(n²) | 1 trillion | 11 days |

---

## Common Patterns

**O(1):** HashMap get/put, array access, stack operations

**O(log n):** Binary search, balanced tree operations

**O(n):** Loop through array, ArrayList.contains()

**O(n log n):** Sorting (merge sort, quick sort, heap sort)

**O(n²):** Nested loops, bubble sort, brute force

---

## Key Interview Points

1. **O(1) is best** - Same time regardless of input size
2. **O(log n) is excellent** - Doubles in efficiency for each doubling of input
3. **O(n) is acceptable** - Must examine all data at least once
4. **O(n²) is slow** - Avoid for large datasets
5. **Know your data structures** - HashMap=O(1), ArrayList=O(n), etc.

---

## Test Your Knowledge

{% include big-o-quiz.html %}

{% include quiz-script.html %}

---

## Real Interview Example

```java
// Problem: Find two numbers that sum to target
// Bad: O(n²)
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        if (arr[i] + arr[j] == target) return ...

// Good: O(n) with HashMap
Map<Integer, Integer> seen = new HashMap<>();
for (int i = 0; i < n; i++) {
    int complement = target - arr[i];
    if (seen.containsKey(complement)) return ...  // O(1) lookup
    seen.put(arr[i], i);
}
```

---

## TL;DR

Big O measures how algorithm time grows with input size. O(1)=instant, O(log n)=fast, O(n)=acceptable, O(n²)=slow. Learn to identify them in code, and always prefer lower complexity when possible. This is critical for interviews!
