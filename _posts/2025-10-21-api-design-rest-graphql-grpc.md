---
layout: post
title: "API Design: REST vs GraphQL vs gRPC"
date: 2025-10-21
tags: [system-design, trade-offs]
analogy_domain: "business"
series: "system-design"
series_title: "System Design Fundamentals"
series_order: 3
excerpt: "Understand REST, GraphQL, and gRPC. Learn when to use each API style."
description: "Quick guide to API design patterns for interviews."
keywords: rest api, graphql, grpc, api design, system design
related_concepts:
  - "HTTP protocols"
  - "Microservices communication"
---

## The Problem

Which API style should you use? REST is familiar. GraphQL promises flexibility. gRPC offers performance. Each has trade-offs.

---

## The Analogy

**Imagine you need: lamp specs, batteries, and store hours.**

### REST = Department Store

You walk into a giant department store. Everything's organized by department.

Electronics aisle: You ask for "lamp info" and they hand you the entire product page (specs, price, reviews, manufacturer details, 50 photos, warranty info, shipping policies, competitor comparisons). You only needed specs and price. You got everything.

Home Goods aisle: You ask for "batteries" and they hand you the entire battery catalog with packaging, historical price trends, supplier info... You only needed to know they exist and the cost.

Customer Service: You ask for store hours and they hand you holiday hours, manager details, return policies, phone numbers for 5 departments.

**Result:** You got what you needed plus 90% extra data. Wasted bandwidth. Three separate trips. Simple system, inefficient for your needs.

### GraphQL = Personal Shopper

You call a personal shopper and say: "Get me lamp price and availability, battery brand and cost, and store hours. Just those five things."

She makes one trip through the store and comes back with exactly those five data points. Nothing more, nothing less.

**Result:** One request, perfect response. Efficient. But the shopper needs to understand your specific needs.

### gRPC = Warehouse-to-Store Ordering (Internal Only)

You're a store manager talking directly to the warehouse manager. You don't chat with a personal shopper or fill out order forms.

You speak warehouse shorthand: "Need 1000 units of item 42, priority shipping." The warehouse responds instantly in the same shorthand: "Confirming 1000 units, ETA 2 hours, cost $X."

This is ultra-efficient binary communication. No pretty language, no flexibility, no explanations. Just structured data compressed into bytes. 90% smaller than REST/GraphQL, blazing fast.

But this only works between warehouses and stores (businesses that speak the same language). You can't use this with a regular customer walking in asking "Do you have this in blue?"

**The Interview Insight:** REST is for public-facing APIs (anyone can use it). GraphQL for clients that need flexibility (web, mobile, smart UIs). gRPC for internal microservices where everyone speaks the same language.

---

## Quick Comparison

| Aspect | REST | GraphQL | gRPC |
|--------|------|---------|------|
| **Learning** | Easy | Medium | Hard |
| **Performance** | Good | Good | Excellent |
| **Payload size** | Medium | Small | Tiny |
| **Over-fetching** | Yes | No | N/A |
| **Caching** | Easy (HTTP) | Hard | Hard |
| **Browser support** | Excellent | Good | Limited |
| **Best for** | Public APIs | Mobile/web | Microservices |

---

## REST (Familiar)

```java
// REST: Multiple endpoints, fixed response shapes
GET  /api/users/123           // Get user with everything
POST /api/users               // Create user
GET  /api/users/123/posts     // Get user's posts
GET  /api/posts/456/comments  // Get post's comments

// Response always includes everything
{
  id: 123,
  name: "Alice",
  email: "alice@example.com",
  avatar: "...",
  followers: 1000,
  following: 500
  // ... lots of data you might not need
}
```

**Strengths:**
- Simple, intuitive
- HTTP caching works
- Easy to debug
- Works in browsers

**Weaknesses:**
- Over-fetching (get data you don't need)
- Under-fetching (multiple requests for related data)
- Fixed response shapes

---

## GraphQL (Flexible)

```graphql
# Single request, ask for exactly what you need
query {
  user(id: 123) {
    name
    email
    posts(limit: 10) {
      title
      # No content, no author, no comments
    }
  }
}

# Response: exactly what you asked for
{
  "user": {
    "name": "Alice",
    "email": "alice@example.com",
    "posts": [
      { "title": "Post 1" },
      { "title": "Post 2" }
    ]
  }
}
```

**Strengths:**
- No over/under-fetching
- Mobile-friendly (less data)
- Nested queries
- Single endpoint

**Weaknesses:**
- More complex (learning curve)
- HTTP caching doesn't work
- Can have expensive queries
- Overkill for simple APIs

---

## gRPC (Fast)

```protobuf
// Define contract
service UserService {
  rpc GetUser (UserId) returns (User);
}

message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
}
```

```java
// Binary protocol, strongly typed
User user = client.getUser(123);
System.out.println(user.getName());
```

**Strengths:**
- ~7x smaller payload than JSON
- Super fast (binary)
- Strongly typed (compile-time safety)
- Bidirectional streaming
- Auto-generated code

**Weaknesses:**
- Limited browser support
- Not human-readable
- Overkill for public APIs
- Steeper learning curve

---

## Real-World Payload Sizes

| API Style | Payload | Total |
|-----------|---------|-------|
| REST (full) | 50KB | 50KB |
| GraphQL | 5KB | 5KB |
| gRPC | 2KB | 2KB |

---

## When to Use Each

**REST:**
- Public APIs (third-party developers)
- Simple CRUD operations
- Browser-based apps
- HTTP caching important

**GraphQL:**
- Mobile apps (reduce bandwidth)
- Complex data requirements
- Multiple client types (web/mobile/desktop)
- Rapid frontend iteration

**gRPC:**
- Internal microservices
- Performance critical
- Real-time streaming
- Polyglot systems

---

## Hybrid Approach (Common)

```
Public API (REST)
    ↓
Mobile/Web App (GraphQL gateway)
    ↓
Microservices (gRPC)
```

---

## Code Examples

**REST:**
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
}
```

**GraphQL:**
```java
@Component
public class UserResolver implements GraphQLResolver<User> {
    public List<Post> posts(User user) {
        return postService.findByUserId(user.getId());
    }
}
```

**gRPC:**
```java
public class UserServiceImpl extends UserServiceGrpc.UserServiceImplBase {
    @Override
    public void getUser(UserId request, StreamObserver<User> responseObserver) {
        User user = userService.findById(request.getId());
        responseObserver.onNext(user);
        responseObserver.onCompleted();
    }
}
```

---

## Key Interview Points

1. **REST = fixed responses** (simple but inefficient)
2. **GraphQL = query what you need** (efficient but complex)
3. **gRPC = binary + fast** (best for internal services)
4. **REST over-fetches** (get extra data you don't need)
5. **GraphQL no over-fetching** (get exactly what you ask)
6. **gRPC is 7x smaller** than JSON payloads

---

## Test Your Knowledge

{% include api-design-quiz.html %}

{% include quiz-script.html %}

---

## TL;DR

REST is like a department store - walk to aisles (endpoints) and get everything on the shelf (full responses). GraphQL is like a personal shopper - tell them exactly what you need, one trip, no wasted data. gRPC is like warehouse ordering - super fast binary protocol but only for internal use. Use REST for public APIs, GraphQL for mobile/complex data, gRPC for microservices. Most systems use all three.
