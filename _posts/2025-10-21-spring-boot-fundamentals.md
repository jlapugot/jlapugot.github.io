---
layout: post
title: "Spring Boot: Convention Over Configuration"
date: 2025-10-21
tags: [spring]
analogy_domain: "technology"
series: "spring-framework"
series_title: "Spring Framework Fundamentals"
series_order: 2
excerpt: "Understand Spring Boot's opinionated defaults. Learn why it's better than Spring Framework for most projects."
description: "Quick guide to Spring Boot fundamentals for interview preparation."
keywords: spring boot, spring framework, auto-configuration, starters
related_concepts:
  - "Spring Framework basics"
  - "Dependency Injection"
---

## The Problem

Spring Framework requires tons of XML configuration before you can start coding. Spring Boot eliminates that boilerplate with sensible defaults.

---

## The Analogy

**Spring Framework = Building a custom PC (choose every component)**
**Spring Boot = Buying a smartphone (unbox and use)**

- **PC**: Research motherboard, RAM, GPU, storage, PSU, OS, drivers, BIOS, networking
- **Smartphone**: Unbox, turn on, start using

---

## Spring Framework vs Spring Boot

| Aspect | Spring Framework | Spring Boot |
|--------|------------------|------------|
| **Setup time** | Hours/days | Minutes |
| **Configuration** | XML files everywhere | `@SpringBootApplication` |
| **Dependencies** | Manual | Auto-configured |
| **Server** | External Tomcat | Embedded |
| **Database** | Manual setup | Auto-configured |
| **Starting code** | 200+ lines | 10 lines |

---

## Minimal Spring Boot App

```java
@SpringBootApplication
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
    }
}
```

That's it! Spring Boot automatically:
- Starts embedded Tomcat
- Configures DataSource
- Sets up JPA/Hibernate
- Enables component scanning
- Configures logging

---

## Auto-Configuration Magic

Spring Boot detects dependencies on classpath and configures accordingly:

```xml
<!-- Add one dependency -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Spring Boot automatically configures:
     - DataSource
     - EntityManagerFactory
     - TransactionManager
     - JPA repositories
-->
```

---

## Starters (Pre-packaged Dependencies)

Instead of 10 individual dependencies, use one starter:

```xml
<!-- Web app starter -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<!-- Includes: Spring MVC, Tomcat, Jackson, Validation -->

<!-- Database starter -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<!-- Includes: Spring Data JPA, Hibernate, JDBC -->

<!-- Security starter -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<!-- Includes: Spring Security, authentication, CSRF protection -->
```

---

## Configuration (No XML!)

```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=secret

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080
logging.level.root=INFO
```

Environment-specific configs:
```
application.properties      (default)
application-dev.properties  (development)
application-prod.properties (production)
```

Run with profile: `java -jar app.jar --spring.profiles.active=prod`

---

## Complete REST API Example

```java
@Entity
public class User {
    @Id @GeneratedValue
    private Long id;
    private String name;
    private String email;
    // getters/setters
}

@Repository
public interface UserRepository extends JpaRepository<User, Long> {}

@Service
public class UserService {
    @Autowired
    private UserRepository repo;

    public List<User> getAllUsers() {
        return repo.findAll();
    }
}

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService service;

    @GetMapping
    public List<User> getUsers() {
        return service.getAllUsers();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return service.create(user);
    }
}
```

No configuration needed! Spring Boot handles everything.

---

## Spring Boot Actuator (Production Ready)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Automatic endpoints:
```
GET /actuator/health      → App health status
GET /actuator/metrics     → Performance metrics
GET /actuator/env         → Environment variables
GET /actuator/beans       → All beans in context
```

---

## When to Use Spring Boot

- **New projects** - Always
- **REST APIs** - Perfect fit
- **Microservices** - Built for this
- **Rapid development** - Get started in minutes

---

## When to Use Spring Framework

- **Legacy applications** - Already using it
- **Need complete control** - Very rare
- **Custom, non-standard requirements** - Extremely rare

---

## Key Interview Points

1. **Spring Boot = Spring Framework + opinionated defaults**
2. **@SpringBootApplication = @Configuration + @ComponentScan + @EnableAutoConfiguration**
3. **Starters = pre-packaged dependency sets**
4. **Auto-configuration = magic that detects and configures based on classpath**
5. **Embedded server = no external Tomcat needed**
6. **Convention over configuration = less code, sensible defaults**

---

## Test Your Knowledge

{% include spring-boot-quiz.html %}

{% include quiz-script.html %}

---

## TL;DR

Spring Boot is Spring Framework with sensible defaults and zero configuration. Add `@SpringBootApplication`, put dependencies in pom.xml, and Spring Boot auto-configures everything. Use starters instead of individual dependencies. Run as JAR with embedded Tomcat. Perfect for interviews and production. Never choose Spring Framework over Spring Boot unless you have a very specific reason.
