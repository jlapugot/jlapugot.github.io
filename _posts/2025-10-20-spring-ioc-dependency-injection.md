---
layout: post
title: "Spring IoC and Dependency Injection"
date: 2025-10-20
tags: [java, spring]
analogy_domain: "cooking"
series: "spring-framework"
series_title: "Spring Framework Fundamentals"
series_order: 1
excerpt: "Understand IoC (Inversion of Control) and Dependency Injection in Spring through a simple analogy."
description: "Quick guide to IoC and DI in Spring Framework for interviews."
keywords: spring, dependency injection, inversion of control, ioc
related_concepts:
  - "Spring beans"
  - "Autowiring"
---

## The Problem

What's the difference between IoC and DI? They're related but not the same. IoC is the principle, DI is the implementation.

---

## The Analogy

**Without IoC:** Chef goes to market, buys ingredients, manages inventory - controlling everything.

**With IoC:** Restaurant manager provides ingredients to the chef. Chef focuses on cooking, not shopping.

- **IoC** = The restaurant manager managing everything (framework controls flow)
- **DI** = The kitchen staff delivering ingredients (how dependencies get delivered)

---

## Three Ways to Inject Dependencies

**Constructor Injection (Best):**
```java
@Service
public class OrderService {
    private final PaymentService paymentService;

    public OrderService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
```
- Immutable, required dependencies, easy to test

**Setter Injection:**
```java
@Service
public class OrderService {
    private PaymentService paymentService;

    @Autowired
    public void setPaymentService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
```
- Optional dependencies, can change after creation

**Field Injection (Avoid):**
```java
@Service
public class OrderService {
    @Autowired
    private PaymentService paymentService;  // Hard to test
}
```
- Don't use in production code

---

## How Spring Does It

```java
// 1. Define what Spring can inject
@Configuration
public class AppConfig {
    @Bean
    public PaymentService paymentService() {
        return new StripePayment();
    }
}

// 2. Ask for what you need
@Service
public class OrderService {
    private final PaymentService paymentService;

    public OrderService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}

// 3. Spring automatically wires it together
```

---

## Key Interview Points

1. **IoC** = Framework controls your code flow
2. **DI** = How framework delivers dependencies
3. **Constructor injection is preferred** - Makes dependencies explicit
4. **Spring's IoC container** = ApplicationContext (creates and manages beans)
5. **You declare dependencies** → Spring figures out how to provide them

---

## Test Your Knowledge

{% include spring-ioc-quiz.html %}

{% include quiz-script.html %}

---

## TL;DR

IoC is the principle (framework controls flow). DI is how it works (dependencies are injected). Use constructor injection. Let Spring manage the complexity.
