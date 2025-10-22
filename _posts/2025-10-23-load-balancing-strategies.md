---
layout: post
title: "Load Balancing: Distributing Requests Across Servers"
date: 2025-10-23
tags: [system-design, scaling]
analogy_domain: "restaurant"
series: "system-design"
series_title: "System Design Fundamentals"
series_order: 5
excerpt: "Understand load balancing strategies. Learn how to distribute traffic across multiple servers for better performance and reliability."
description: "Quick guide to load balancing for interview preparation."
keywords: load balancing, round-robin, least connections, weighted load balancing, server health checks
related_concepts:
  - "Horizontal scaling"
  - "Fault tolerance"
---

## The Problem

Your application gets popular. One server can't handle all the traffic. You add more servers, but now you need a way to distribute incoming requests fairly. If you send all requests to one server, you're back to square one. You need load balancing.

---

## The Analogy

**Imagine a restaurant during dinner rush.**

You have one server (person taking orders) handling 200 customers. Each customer waits 30 minutes. The server is exhausted and mistakes happen.

**The Problem:** One bottleneck (one server for all customers).

**Solution: Hire more servers (multiple backend servers).**

Now you have 4 servers working simultaneously. But here's the question: How do you decide which server takes which customer?

**Round-Robin = Fair rotation**

Customers arrive and the manager (load balancer) assigns them:
- Customer 1 goes to Server A
- Customer 2 goes to Server B
- Customer 3 goes to Server C
- Customer 4 goes to Server D
- Customer 5 goes back to Server A (cycle repeats)

Simple and fair, but what if Server A is slow or understaffed?

**Least Connections = Assign to the least busy server**

The manager looks at each server's current load:
- Server A has 5 customers
- Server B has 2 customers
- Server C has 8 customers
- Server D has 1 customer

Customer arrives, manager sends them to Server D (least busy).

Better than round-robin, but requires monitoring each server.

**Weighted = Distribute based on seniority/experience**

Some servers are more experienced (senior, faster, better at handling complicated orders):
- Server A (senior, 10 years) handles 50% of customers
- Server B (experienced, 5 years) handles 30% of customers
- Server C (junior, 1 year) handles 20% of customers

The manager distributes accordingly. More experienced = more customers.

**IP Hash = Customers with preferred waiters**

Some regular customers have a preferred server:
- Mrs. Smith always asks for Server A
- John always asks for Server B
- The manager keeps these customers assigned to their preferred server

Why? These customers are comfortable with their preferred server and expect consistent service. If we move them around, they lose continuity and comfort.

---

## Quick Comparison

| Strategy | Pros | Cons | Best For |
|----------|------|------|----------|
| **Round-Robin** | Simple, fair | Ignores server load | Uniform servers, equal load |
| **Least Connections** | Adaptive, balances load | Monitoring overhead | Variable load patterns |
| **Weighted** | Handles heterogeneous servers | Manual configuration | Mixed server capabilities |
| **IP Hash** | Preserves session state | Uneven distribution | Stateful applications |

---

## Load Balancing Strategies

**Round-Robin**
```java
// Simple counter, cycle through servers
private int currentServer = 0;

public Server getNextServer() {
    Server server = servers[currentServer];
    currentServer = (currentServer + 1) % servers.length;
    return server;
}
```

**Least Connections**
```java
// Find server with fewest active connections
public Server getNextServer() {
    Server leastBusy = servers[0];
    for (Server server : servers) {
        if (server.activeConnections < leastBusy.activeConnections) {
            leastBusy = server;
        }
    }
    return leastBusy;
}
```

**Weighted Round-Robin**
```java
// Distribute based on weight (capacity)
public Server getNextServer() {
    // Server A: weight 50 (gets 50% of requests)
    // Server B: weight 30 (gets 30% of requests)
    // Server C: weight 20 (gets 20% of requests)

    int random = rand(0, 100);
    if (random < 50) return serverA;
    if (random < 80) return serverB;
    return serverC;
}
```

**IP Hash (Sticky Sessions)**
```java
// Hash client IP, always route to same server
public Server getNextServer(String clientIP) {
    int hash = clientIP.hashCode() % servers.length;
    return servers[Math.abs(hash)];
}
```

---

## Health Checks and Failover

**Health Check = Detect dead servers**
```java
// Periodically ping each server
public void healthCheck() {
    for (Server server : servers) {
        if (!server.isHealthy()) {  // Server is down
            removeFromPool(server);  // Stop sending requests
            notifyAlerts("Server down: " + server.id);
        }
    }
}
```

**Failover = Redirect traffic when server dies**

Client sends request to Server A. Server A is down.
- With failover: Load balancer automatically redirects to Server B
- Without failover: Client gets an error

---

## Real-World Examples

**Nginx (Round-Robin by default)**
```
upstream backend {
    server server1.example.com;
    server server2.example.com;
    server server3.example.com;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

**AWS Elastic Load Balancer (Least Connections)**
- ALB (Application Load Balancer) routes based on request volume
- Monitors each target's health
- Automatically removes unhealthy targets

**HAProxy (Weighted, Least Connections, IP Hash)**
```
backend servers
    balance leastconn        # Least connections strategy
    server web1 weight 50
    server web2 weight 30
    server web3 weight 20
```

---

## When to Use Each

**Round-Robin:**
- All servers have equal capacity
- Request processing time is uniform
- Simplicity is more important than perfect load distribution

**Least Connections:**
- Server capacity varies
- Request processing time varies significantly
- You need adaptive load balancing

**Weighted:**
- Servers have different hardware (some are faster)
- You can manually configure capacity ratios
- You need predictable resource allocation

**IP Hash:**
- Application requires session stickiness
- User data is cached on specific servers
- You need deterministic routing for a given client

---

## Key Interview Points

1. **Load balancing solves the bottleneck** of a single server handling all traffic
2. **Round-robin is simple** but naive (ignores server load)
3. **Least connections is adaptive** (best for varying load)
4. **Weighted helps when servers differ** in capacity
5. **IP hash preserves session state** but can cause uneven distribution
6. **Health checks detect dead servers** and automatically failover traffic
7. **Most systems use least connections or weighted** in production

---

## Test Your Knowledge

{% include load-balancing-quiz.html %}

{% include quiz-script.html %}

---

## TL;DR

Load balancing distributes requests across multiple servers to avoid bottlenecks. Round-robin cycles through servers (simple but naive). Least connections sends to the least busy server (adaptive). Weighted gives more traffic to powerful servers (predictable). IP hash keeps same client on same server (preserves session). Health checks detect dead servers and failover traffic automatically. Most production systems use least connections or weighted strategies. Choose based on your servers' capacity and application needs.
