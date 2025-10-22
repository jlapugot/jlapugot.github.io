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

**Monolith = A single restaurant that does everything**

It's lunch rush. You're hungry and walk into "Everything Restaurant." One large kitchen. One oven. One refrigerator. All food orders go through one queue.

You order pizza, pasta, and sushi. The kitchen team is coordinated:
- Chef A finishes your pizza
- Chef B cooks your pasta
- Chef C prepares your sushi
- All dishes come out together

**The Problem Appears When:**
- Someone orders 100 pizzas. The entire kitchen backs up. Pasta and sushi orders wait. Even though Chefs B and C have nothing to do, everyone waits because it's one shared pipeline.
- Chef A gets sick. The whole restaurant slows down because they coordinate everything.
- You want to change the menu. The entire team has to be notified and retrained.
- The oven breaks? Nobody can cook anything.

**Microservices = A food court with independent vendors**

Same lunch rush scenario. But now: Pizza Shop, Pasta Place, Sushi Stand. Each with their own kitchen, oven, staff.

You walk in and order from each vendor independently:
- Pizza Shop: "I'm slammed with 100 pizza orders. Going to take 20 minutes."
- Pasta Place: "No line here, you're done in 5 minutes."
- Sushi Stand: "We're fine too, 3 minutes."

**The Advantages:**
- Pizza Shop can hire more staff without affecting pasta or sushi
- Sushi Stand goes down? Pizza Shop and Pasta Place keep serving
- Want to change Sushi's menu? Only affects Sushi customers
- Each vendor scales independently based on demand

**The Trade-off:**
- You have to manage ordering from three separate places instead of one
- If Pizza Shop breaks down, you have to communicate that to customers (monolith would just close entirely)
- Customers coordinate their own meal assembly (instead of one kitchen coordinating everything)
- Monitoring complexity increases: you need to watch three vendors' health, not one kitchen

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
