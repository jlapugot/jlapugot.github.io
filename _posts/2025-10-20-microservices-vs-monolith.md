---
layout: post
title: "Microservices vs Monolithic Architecture"
date: 2025-10-20
tags: [system-design]
analogy_domain: "cooking"
series: "system-design"
series_title: "System Design Fundamentals"
series_order: 1
excerpt: "Understand monolithic vs microservices architectures. Learn the trade-offs and when to use each."
description: "Quick guide to monolithic vs microservices architecture for interviews."
keywords: microservices, monolith, architecture, system design, scalability
related_concepts:
  - "Deployment and DevOps"
  - "Service communication"
---

## The Problem

Should you build one giant application (monolith) or split into smaller services (microservices)? Monoliths are simple but become complex. Microservices scale better but add operational overhead.

---

## The Analogy

**Monolith = Single large restaurant**
- One kitchen, one staff, one menu
- Chef1 makes appetizers, Chef2 makes entrees, Chef3 makes desserts
- All share same pantry, ovens, equipment
- Changes to menu affect entire kitchen coordination

**Microservices = Food court**
- Each vendor (Pizza, Sushi, Tacos) runs independently
- Each has their own kitchen, supplies, staff
- They operate independently
- Customers order from each separately

---

## Comparison

| Aspect | Monolith | Microservices |
|--------|----------|---------------|
| **Complexity** | Simple start, complex later | Complex start, manageable later |
| **Deployment** | Deploy entire app | Deploy each service independently |
| **Scaling** | Scale entire app | Scale individual services |
| **Development** | One team, coordinated | Multiple teams, independent |
| **Communication** | Function calls | HTTP/REST, message queues |
| **Failure** | One bug crashes everything | One service failing = others work |
| **Data** | Shared database | Database per service |
| **Testing** | Easy to test | Hard to test (distributed) |

---

## Monolithic Architecture

**Characteristics:**
- Single codebase
- Single database
- All features in one application
- Deploy as single unit

```java
@SpringBootApplication
public class MonolithApplication {

    @RestController
    class OrderController {
        @Autowired OrderService orderService;
        @Autowired PaymentService paymentService;
        @Autowired InventoryService inventoryService;

        @PostMapping("/orders")
        public Order createOrder(@RequestBody OrderRequest req) {
            Order order = orderService.create(req);
            paymentService.charge(order.getTotal());
            inventoryService.reserve(order.getItems());
            return order;
        }
    }

    @Service
    class OrderService { /* ... */ }

    @Service
    class PaymentService { /* ... */ }

    @Service
    class InventoryService { /* ... */ }
}
```

**Strengths:**
- Simple to develop initially
- Easy to test (all in one app)
- Single database (strong consistency)
- Deploy once

**Weaknesses:**
- Hard to scale individual components
- One bug can crash entire app
- Technology lock-in (all one language/framework)
- Big deployment = higher risk

---

## Microservices Architecture

**Characteristics:**
- Multiple independent services
- Each service has own database
- Services communicate via APIs
- Deploy independently

```
┌─────────────────────────────────────┐
│      API Gateway / Load Balancer    │
└──────────────┬──────────────────────┘
               │
   ┌───────────┼───────────┬──────────────┐
   │           │           │              │
   ▼           ▼           ▼              ▼
┌────────┐ ┌────────┐ ┌──────────┐ ┌────────┐
│ Order  │ │Payment │ │Inventory │ │ User   │
│Service │ │Service │ │ Service  │ │Service │
└────────┘ └────────┘ └──────────┘ └────────┘
   │          │          │            │
   ▼          ▼          ▼            ▼
 OrderDB  PaymentDB  InventoryDB   UserDB
```

**Code example:**

Order Service calls Payment Service via HTTP:
```java
@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired private OrderService orderService;
    @Autowired private RestTemplate restTemplate;

    @PostMapping
    public Order createOrder(@RequestBody OrderRequest req) {
        Order order = orderService.create(req);

        // Call Payment Service (separate app)
        restTemplate.postForObject(
            "http://payment-service/api/charge",
            new ChargeRequest(order.getTotal()),
            Void.class
        );

        // Call Inventory Service (separate app)
        restTemplate.postForObject(
            "http://inventory-service/api/reserve",
            new ReserveRequest(order.getItems()),
            Void.class
        );

        return order;
    }
}
```

**Strengths:**
- Scale services independently
- Fault isolation (one service fails, others work)
- Technology flexibility (different languages)
- Continuous deployment of individual services
- Teams own entire service lifecycle

**Weaknesses:**
- Distributed system complexity
- Network calls slower than function calls
- Testing harder (multiple services)
- Data consistency challenges
- Operational overhead (monitoring, logging, tracing)

---

## When to Use Monolith

- **Starting out** - New projects, MVP
- **Small team** - 5-10 developers
- **Simple domain** - Clear, well-defined scope
- **Strong consistency needed** - Financial transactions
- **Performance critical** - Need function call speed

---

## When to Use Microservices

- **Large application** - Complex domain
- **Independent scaling** - Some services need more resources
- **Large teams** - Multiple teams per service
- **Multiple languages** - Need different tech stacks
- **High availability** - Service failures shouldn't crash everything
- **Rapid deployment** - Deploy individual services

---

## The Middle Ground: Modular Monolith

Start monolithic with clear module boundaries. Easier transition to microservices later.

```
Monolith
├── order-module/
├── payment-module/
├── inventory-module/
└── user-module/
```

Each module is independent. Later, extract to microservices if needed.

---

## Key Interview Points

1. **Monolith is simpler to start** but harder to scale
2. **Microservices are complex** but scale individual components
3. **Don't prematurely optimize** - start monolith, migrate if needed
4. **Microservices trade consistency for availability**
5. **Data management is harder** with microservices (database per service)
6. **Operational complexity increases** with microservices

---

## Test Your Knowledge

{% include microservices-quiz.html %}

{% include quiz-script.html %}

---

## TL;DR

Monolith: One app, one database, simple start, complex at scale. Microservices: Multiple independent services, complex start, easy to scale. Start monolithic. When you have scaling problems with specific components or multiple independent teams, migrate to microservices. Most systems don't need microservices until they're much larger.
