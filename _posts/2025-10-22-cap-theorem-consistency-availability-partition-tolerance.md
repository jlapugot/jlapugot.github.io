---
layout: post
title: "CAP Theorem: Consistency, Availability, and Partition Tolerance"
date: 2025-10-22
tags: [system-design, trade-offs]
analogy_domain: "business"
series: "system-design"
series_title: "System Design Fundamentals"
series_order: 4
excerpt: "Understand CAP Theorem. Learn why distributed systems can only have 2 of 3: Consistency, Availability, Partition Tolerance."
description: "Quick guide to CAP Theorem for interviews."
keywords: cap theorem, consistency, availability, partition tolerance, distributed systems
related_concepts:
  - "Distributed databases"
  - "Eventual consistency"
---

## The Problem

Your distributed system has multiple servers. Network fails and splits them. You must choose: reject requests (consistency) or accept them (availability). You can't have both when networks fail.

---

## The Analogy

**Imagine a bank with two branches connected by a network.**

You have $1000 in your account. The account balance is replicated across both branches' systems. Everything works fine until... the network cable connecting the branches gets cut. Now they can't talk to each other.

**The Scenario:**
- You're at Branch A and withdraw $500
- Your friend is at Branch B (in a different city) and simultaneously withdraws $500
- Both ATMs are asking: "Can we process this?"

**Here's the problem:** Without network communication, Branch A and Branch B can't verify the true account balance. They can only see their local copy showing $1000.

**The Three Properties:**
- **Consistency (C):** Both branches always show the same balance
- **Availability (A):** Both ATMs always respond to requests
- **Partition Tolerance (P):** System works even when network is broken

**You must choose two:**

**CP (Banks Choose This):**
- Branch A rejects your withdrawal: "Network is down, can't verify with other branch"
- Branch B rejects your friend's withdrawal for the same reason
- **Result:** No money is withdrawn from either branch. Consistent ($1000 everywhere), but unavailable. Safe, but annoying for customers.

**AP (Social Media Chooses This):**
- Branch A accepts your withdrawal: "OK, you got $500" (updates to $500 remaining)
- Branch B accepts your friend's withdrawal: "OK, you got $500" (updates to $500 remaining)
- **Result:** Both withdrawals succeed. You both got $500 in cash. But the system is inconsistent: Branch A shows $500, Branch B shows $500, when the true balance should be $0 (both withdrawals already happened).
- **Available** (always works), but **inconsistent** (data is wrong). Eventually they sync up and fix it.

**CA (Impossible):**
- Would require zero network latency and guaranteed perfect connectivity
- Doesn't exist in the real world. Networks always fail eventually

---

## The Three Options

**CP: Consistency + Partition Tolerance**
```
You withdraw $100 at Branch A
Network is down between branches
Branch A rejects: "Can't verify balance with other branches"
Result: No double-withdrawal, but service unavailable
Example: Banks, stock trading (strong consistency matters)
```

**AP: Availability + Partition Tolerance**
```
You withdraw $100 at Branch A
Network is down between branches
Branch A accepts: "OK, withdrawing from local account"
Friend withdraws $100 at Branch B simultaneously
Branch B accepts: "OK, withdrawing from local account"
Result: Available but balance goes from $1000 → $800 (inconsistent!)
Example: Social media, shopping carts (eventual consistency)
```

**CA: Consistency + Availability (unrealistic)**
```
Single central database with no network failures
All ATMs always see correct balance
But: One network failure = entire system down
Example: Single-server systems (not distributed)
```

---

## CAP Theorem Key Point

**Distributed systems must choose CP or AP when networks fail.** You can't have all three because:
1. If network partitions (guaranteed to happen), you must choose between:
   - **C**: Reject requests → unavailable
   - **A**: Accept requests → inconsistent

---

## Real-World Examples

**CP Systems (Sacrifice Availability):**
- Banking (can't risk wrong balances)
- Stock trading
- Google Spanner
- MongoDB (default)

```java
// Reject writes if can't reach majority
if (!canReachMajority()) {
    throw new ServiceUnavailableException("Cannot guarantee consistency");
}
```

**AP Systems (Sacrifice Consistency):**
- Facebook (can show stale likes)
- Twitter (followers count eventually updates)
- DynamoDB
- Cassandra

```java
// Accept writes anyway, sync later
writeToAnyAvailableReplica();
// Eventually consistent
```

---

## Trade-offs

**CP = Banks**
- Pro: Consistency (no double-spending)
- Con: Downtime during network failures

**AP = Social Media**
- Pro: Always available
- Con: Temporary inconsistencies (not a big deal for likes/comments)

---

## How to Decide

**Choose CP When:**
- Correctness is critical (financial transactions)
- Downtime is acceptable
- Your domain is "read-heavy" anyway

**Choose AP When:**
- Availability is critical (users expect 24/7)
- Temporary inconsistencies are tolerable
- Downtime is unacceptable

---

## Key Interview Points

1. **CAP Theorem** = You pick 2 of 3 (Consistency, Availability, Partition Tolerance)
2. **Networks always fail** so you really choose between CP and AP
3. **Partitions are inevitable** in distributed systems
4. **CP = strong consistency, occasional downtime** (banks)
5. **AP = eventual consistency, always available** (social media)
6. **Most systems use AP** then add mechanisms to fix inconsistencies

---

## Test Your Knowledge

{% include cap-theorem-quiz.html %}

{% include quiz-script.html %}

---

## PACELC Extension

**If Partition → choose AP or CP**
**Else (no partition) → choose between Latency and Consistency**

- **MongoDB**: PC/EC (sacrifice latency for consistency even without partitions)
- **Cassandra**: PA/EL (sacrifice consistency for latency)

---

## TL;DR

CAP Theorem: distributed systems can have Consistency OR Availability when networks partition, not both. Banks choose Consistency (CP) - rare downtime is OK. Social media chooses Availability (AP) - eventual consistency is OK. Networks fail eventually, so you're really choosing CP vs AP. Most systems are AP with mechanisms to fix inconsistencies later. Remember: C = strong consistency, A = always available, P = works despite network failures.
