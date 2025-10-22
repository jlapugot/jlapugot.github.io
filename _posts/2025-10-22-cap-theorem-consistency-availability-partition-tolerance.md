---
layout: post
title: "CAP Theorem: Consistency, Availability, and Partition Tolerance Through ATM Networks"
date: 2025-10-22
tags: [system-design, trade-offs]
analogy_domain: "business"
series: "system-design"
series_title: "System Design Fundamentals"
series_order: 4
excerpt: "Understand the CAP Theorem through ATM networks. Learn why distributed systems can only guarantee two out of three: Consistency, Availability, and Partition Tolerance - just like ATMs can't show real-time balances when disconnected while staying available."
description: "A comprehensive guide to CAP Theorem using ATM network analogies. Covers consistency vs availability trade-offs, partition tolerance, and real-world examples of CP, AP, and CA systems."
keywords: cap theorem, distributed systems, consistency, availability, partition tolerance, database design, system design trade-offs
related_concepts:
  - "Eventual consistency"
  - "Strong consistency"
  - "Database replication"
---

## The Problem

You're building a distributed system with servers across multiple data centers. Users expect to see the same data everywhere (consistency), the system should always respond to requests (availability), and it must work even when networks fail (partition tolerance). But here's the catch: you can't have all three at once. When the network splits your system into isolated groups, you must choose: do you reject requests to maintain consistency, or do you accept requests knowing different parts of the system might have conflicting data? Banking systems, social media platforms, and e-commerce sites all face this fundamental trade-off.

---

## The Analogy

**Think of CAP Theorem like an ATM network across multiple bank branches.**

### The Three Guarantees

**Consistency (C):** All ATMs show the exact same account balance
- You check your balance at ATM A: $1000
- You immediately check at ATM B: $1000 (same!)
- Every ATM has the same up-to-date information
- No ATM shows stale or outdated balances

**Availability (A):** Every ATM always responds to your request
- You can always withdraw money
- You can always check your balance
- No ATM says "Service temporarily unavailable"
- Every request gets a response (success or failure)

**Partition Tolerance (P):** The system works even when network connections fail
- ATM A can't communicate with ATM B (network cable cut)
- Branch 1 can't talk to Branch 2 (network partition)
- ATMs are isolated into groups
- System must still function despite broken connections

### The Challenge: Network Partition

Imagine a bank with ATMs at two branches:

```
Branch A (Downtown)          Branch B (Airport)
├─ ATM 1                    ├─ ATM 3
├─ ATM 2                    ├─ ATM 4
└─ Database A               └─ Database B
        │                           │
        └───────Network Cable───────┘
                    [BROKEN!]
```

**Network partition happens:** The cable connecting branches breaks. Now:
- ATM 1 & 2 can only talk to Database A
- ATM 3 & 4 can only talk to Database B
- The two sides can't communicate

**Your account balance: $1000**

**You try to withdraw $100 at ATM 1 (Branch A)**
**Your friend tries to withdraw $100 at ATM 3 (Branch B) at the same time**

What should happen? CAP Theorem says you must choose...

<div class="mermaid">
graph TB
    subgraph BranchA["Branch A - Downtown"]
        direction TB
        ATM1[ATM 1<br/>Balance: $1000]
        ATM2[ATM 2<br/>Balance: $1000]
        DBA[(Database A<br/>Balance: $1000)]
        ATM1 -.-> DBA
        ATM2 -.-> DBA
    end

    subgraph BranchB["Branch B - Airport"]
        direction TB
        ATM3[ATM 3<br/>Balance: $1000]
        ATM4[ATM 4<br/>Balance: $1000]
        DBB[(Database B<br/>Balance: $1000)]
        ATM3 -.-> DBB
        ATM4 -.-> DBB
    end

    DBA -.->|Network Partition BROKEN| DBB

    You[You withdraw $100<br/>at ATM 1] --> ATM1
    Friend[Friend withdraws $100<br/>at ATM 3] --> ATM3

    style DBA fill:#e74c3c
    style DBB fill:#e74c3c
    style You fill:#3498db
    style Friend fill:#3498db
</div>

### Choice 1: Consistency + Partition Tolerance (CP)

**Choose consistency over availability**

When network partition happens:
- **Reject requests** to maintain consistency
- ATMs show error: "Service temporarily unavailable"
- Don't allow withdrawals unless you can verify balance across all ATMs
- Wait until network is restored

```
Branch A:
You: "I want to withdraw $100"
ATM 1: "Sorry, can't verify your balance. Network error. Try again later."
Result: No money, but balance stays correct

Branch B:
Friend: "I want to withdraw $100"
ATM 3: "Sorry, can't verify your balance. Network error. Try again later."
Result: No money, but balance stays correct

When network restored:
Balance = $1000 (Consistent!)
But users were rejected (Not available)
```

<div class="mermaid">
graph TB
    subgraph CP["CP System: Consistency + Partition Tolerance"]
        direction TB
        User1[You at ATM 1] -->|Withdraw $100| ATM_CP1[ATM 1]
        ATM_CP1 -->|Can't verify balance| Reject1[Request Rejected<br/>Service Unavailable]

        User2[Friend at ATM 3] -->|Withdraw $100| ATM_CP3[ATM 3]
        ATM_CP3 -->|Can't verify balance| Reject2[Request Rejected<br/>Service Unavailable]

        Result1[Final Balance: $1000]
        Reject1 -.-> Result1
        Reject2 -.-> Result1
    end

    style Reject1 fill:#e74c3c
    style Reject2 fill:#e74c3c
    style Result1 fill:#2ecc71
</div>

**Real-world CP systems:**
- Banking transactions (can't risk inconsistent balances)
- Inventory systems (can't oversell products)
- Booking systems (can't double-book seats)

### Choice 2: Availability + Partition Tolerance (AP)

**Choose availability over consistency**

When network partition happens:
- **Accept all requests** even if data might be inconsistent
- Both ATMs allow withdrawals
- Each ATM updates its local database
- Sync later when network is restored (eventual consistency)

```
Branch A:
You: "I want to withdraw $100"
ATM 1: "Here's $100!" (Updates Database A: $1000 → $900)
Result: Got money

Branch B (at the same time):
Friend: "I want to withdraw $100"
ATM 3: "Here's $100!" (Updates Database B: $1000 → $900)
Result: Got money

When network restored:
Database A says: $900
Database B says: $900
Actual balance should be: $800 (Inconsistent!)
You withdrew $200 total but both ATMs thought balance was $1000
```

<div class="mermaid">
graph TB
    subgraph AP["AP System: Availability + Partition Tolerance"]
        direction TB
        User1[You at ATM 1] -->|Withdraw $100| ATM_AP1[ATM 1]
        ATM_AP1 -->|Accept request| Success1[Withdrawal Success<br/>Local balance: $900]

        User2[Friend at ATM 3] -->|Withdraw $100| ATM_AP3[ATM 3]
        ATM_AP3 -->|Accept request| Success2[Withdrawal Success<br/>Local balance: $900]

        Success1 -.->|Network restored| Conflict[Conflict!<br/>Both think balance is $900<br/>Should be $800]
        Success2 -.-> Conflict
    end

    style Success1 fill:#2ecc71
    style Success2 fill:#2ecc71
    style Conflict fill:#f39c12
</div>

**Real-world AP systems:**
- Social media (likes/comments can be eventually consistent)
- DNS (domain name changes propagate slowly)
- Shopping carts (can handle temporary inconsistencies)

### Choice 3: Consistency + Availability (CA)

**Choose consistency and availability, but no partition tolerance**

This only works when there's **no network partition**:
- All ATMs connected to a single central database
- Every request sees consistent data
- Every request gets a response
- But if the network breaks, entire system fails

```
All ATMs connected to one central database:

┌─────────┐
│ ATM 1   │──┐
│ ATM 2   │──┤
│ ATM 3   │──┼──► Central Database (Balance: $1000)
│ ATM 4   │──┘
└─────────┘

When network works:
Consistency: All ATMs see $1000
Availability: All ATMs respond

When network breaks:
ATMs can't reach central database
Entire system down
```

<div class="mermaid">
graph TB
    subgraph CA["CA System: Consistency + Availability (No Partition)"]
        direction LR
        ATM_CA1[ATM 1]
        ATM_CA2[ATM 2]
        ATM_CA3[ATM 3]
        ATM_CA4[ATM 4]
        Central[(Central Database<br/>Single source of truth)]

        ATM_CA1 -.->|Connected| Central
        ATM_CA2 -.->|Connected| Central
        ATM_CA3 -.->|Connected| Central
        ATM_CA4 -.->|Connected| Central

        Result[Consistent<br/>Available<br/>If network breaks,<br/>entire system fails]
        Central -.-> Result
    end

    style Central fill:#3498db
    style Result fill:#f39c12
</div>

**Real-world CA systems:**
- Single-server databases (PostgreSQL, MySQL on one machine)
- Relational databases in one data center
- Traditional monolithic applications

**Problem:** Not realistic for distributed systems. Networks always have partitions (cables break, routers fail, data centers lose connectivity).

### CAP Theorem: Pick Two

```
         Consistency (C)
                ▲
               ╱ ╲
              ╱   ╲
             ╱     ╲
            ╱  CA   ╲
           ╱ (Ideal  ╲
          ╱   but     ╲
         ╱  unrealistic)╲
        ╱_______________╲
       ╱ CP          AP  ╲
      ╱  (Banks)  (Social)╲
     ╱___________________╲
Partition (P) ◄──────► Availability (A)
```

**In distributed systems, partitions will happen**, so you really choose between:
- **CP:** Consistency + Partition Tolerance (sacrifice availability)
- **AP:** Availability + Partition Tolerance (sacrifice consistency)

### How It Maps

| ATM Scenario | CAP Concept | Key Point |
|--------------|-------------|-----------|
| **All ATMs show same balance** | Consistency | Every read gets most recent write |
| **ATM always responds** | Availability | Every request gets a response |
| **Network cable breaks** | Partition | Communication failure between nodes |
| **Reject requests during network failure** | CP system | Maintain consistency, lose availability |
| **Accept requests, sync later** | AP system | Maintain availability, eventual consistency |
| **Single central database** | CA system | Only works without partitions |
| **ATMs at different branches** | Distributed system | Multiple nodes that must coordinate |
| **Account balance** | Shared state | Data that must be synchronized |

---

## The Technical Deep Dive

### CAP Theorem Definition

**CAP Theorem (Brewer's Theorem)** states that a distributed system can only guarantee **two out of three** properties simultaneously:

1. **Consistency (C):** Every read receives the most recent write or an error
2. **Availability (A):** Every request receives a non-error response (without guarantee of most recent write)
3. **Partition Tolerance (P):** System continues to operate despite network partitions

### Consistency Explained

**Strong Consistency:**

```java
// Client 1 writes
database.write("account_balance", 1000);

// Client 2 reads immediately after
int balance = database.read("account_balance");
System.out.println(balance);  // MUST be 1000 (most recent write)

// No client ever sees stale data
```

**How CP systems achieve this:**

```java
// Distributed database with 3 replicas
public class CPDatabase {
    private List<DatabaseReplica> replicas = Arrays.asList(DB1, DB2, DB3);

    public void writeWithConsistency(String key, Object value)
            throws ServiceUnavailableException {
        // Write to all replicas
        for (DatabaseReplica replica : replicas) {
            try {
                replica.write(key, value);
            } catch (NetworkException e) {
                // Can't reach replica - ABORT ENTIRE OPERATION
                rollbackAll();
                throw new ServiceUnavailableException(
                    "Cannot guarantee consistency");
            }
        }

        // Only succeed if ALL replicas updated
        System.out.println("Success");
    }

    // During partition: Some replicas unreachable → writes fail
    // Consistency maintained, but availability sacrificed
}
```

**Real example: Banking system**

```java
@Transactional
public void transferMoney(Account from, Account to, double amount) {
    // Use distributed transaction (2-phase commit)
    Transaction tx = beginDistributedTransaction();

    try {
        // Deduct from account 1
        from.withdraw(amount);  // Locks account across all replicas

        // Add to account 2
        to.deposit(amount);     // Locks account across all replicas

        // Only commit if ALL replicas acknowledge
        tx.commit();  // If any replica is unavailable → ABORT
    } catch (PartitionException e) {
        tx.rollback();
        throw new ServiceUnavailableException("Network partition detected");
    }
}
```

### Availability Explained

**Availability means every request gets a response** (even if data is stale):

```java
// Client 1 writes to replica 1
replica1.write("account_balance", 900);

// Replica 2 is partitioned (hasn't synced yet)
// Client 2 reads from replica 2
int balance = replica2.read("account_balance");
System.out.println(balance);  // Might be 1000 (stale data)

// But request still got a response! (Available)
```

**How AP systems achieve this:**

```java
// Cassandra-style eventually consistent database
public class APDatabase {
    private List<DatabaseReplica> replicas = Arrays.asList(DB1, DB2, DB3);

    public void writeWithAvailability(String key, Object value)
            throws AllReplicasDownException {
        // Write to any available replica
        int successfulWrites = 0;

        for (DatabaseReplica replica : replicas) {
            try {
                replica.write(key, value);
                successfulWrites++;
            } catch (NetworkException e) {
                // Skip unavailable replicas, continue with others
                continue;
            }
        }

        // Succeed if at least ONE replica updated
        if (successfulWrites > 0) {
            System.out.println("Success");  // Available!
        } else {
            throw new AllReplicasDownException("Truly unavailable");
        }

        // During partition: Some replicas still work → writes succeed
        // Availability maintained, but consistency sacrificed (temporarily)
    }
}
```

**Real example: Social media likes**

```java
// Facebook-style like counter (AP system)
public class SocialMediaLikes {

    public Response likePost(String postId, String userId) {
        // Write to nearest data center (low latency)
        DataCenter localDataCenter = getNearestDataCenter();

        // Increment like count locally
        localDataCenter.incrementLikes(postId, userId);

        // Return immediately (don't wait for sync)
        return new Response(true);

        // Background: Eventually sync to other data centers
        // Users in different regions might see different counts temporarily
    }
}

// User in US sees: 1,523 likes
// User in Europe sees: 1,520 likes (3 seconds behind)
// Eventually converges to same count
```

### Partition Tolerance Explained

**Partition:** Network split isolating nodes

```
Normal:                  Partitioned:
A ←→ B ←→ C             A ←→ B    C
   ↓   ↓                   ↓      ↓
   D ←→ E               D ←→ E    (isolated)

All nodes communicate    C isolated from others
```

**Why partitions happen:**

- Network cable cut
- Router failure
- Data center connectivity loss
- Firewall misconfiguration
- DNS issues
- Cloud provider outage

**Partition tolerance means:**

```java
// System must continue operating despite partitions
public void handlePartition() {
    if (canReachMajorityOfReplicas()) {
        // CP: Reject writes to minority partition
        // AP: Accept writes, sync later
        continueOperating();
    } else {
        // Minority partition must decide:
        // CP: Reject all requests (maintain consistency)
        // AP: Accept requests (risk inconsistency)
    }
}
```

### CP System Example: Distributed Locking

```java
// Zookeeper-style distributed lock (CP system)
public class DistributedLock {
    private ZookeeperCluster zk;  // 3 or 5 nodes

    public DistributedLock(ZookeeperCluster zkCluster) {
        this.zk = zkCluster;
    }

    public boolean acquireLock(String resourceName)
            throws LockUnavailableException {
        // Must contact majority of nodes (quorum)
        int quorumSize = zk.getNodes().size() / 2 + 1;

        try {
            // Try to create ephemeral node
            zk.create(
                "/locks/" + resourceName,
                true,  // ephemeral
                quorumSize  // Need majority to agree
            );
            return true;  // Lock acquired
        } catch (QuorumNotReachedException e) {
            // Network partition: can't reach majority
            throw new LockUnavailableException(
                "Cannot acquire lock - partition detected");
        } catch (NodeExistsException e) {
            return false;  // Someone else has the lock
        }
    }

    // During partition:
    // - Majority partition: Can acquire locks
    // - Minority partition: Cannot acquire locks (sacrifices availability)
    // - Consistency maintained: Only one holder of lock across all partitions
}
```

**Real-world CP systems:**

- **HBase:** Strongly consistent, unavailable during partitions
- **MongoDB (default):** Primary refuses writes if partitioned from majority
- **Redis Cluster:** Unavailable for writes if majority of masters down
- **Zookeeper:** Leader election requires quorum

### AP System Example: Shopping Cart

```java
// Amazon-style shopping cart (AP system - DynamoDB)
public class ShoppingCart {
    private DynamoDB db;  // Eventually consistent

    public ShoppingCart(DynamoDB dynamoDb) {
        this.db = dynamoDb;
    }

    public void addItem(String userId, Item item) {
        // Write to any available replica
        db.put(
            "cart:" + userId,
            item,
            Consistency.EVENTUAL  // Don't wait for all replicas
        );
        // Returns immediately - available!

        // Problem: User might see inconsistent cart
        // if they switch regions/servers
    }

    public Cart getCart(String userId) {
        // Read from nearest replica (might be stale)
        Cart cart = db.get(
            "cart:" + userId,
            Consistency.EVENTUAL
        );
        return cart;
        // Might not include recently added items
        // But always returns something (available!)
    }

    // During partition:
    // - User adds item in US data center
    // - User checks cart from Europe data center
    // - Might not see new item yet (inconsistent)
    // - But can still add/view cart (available!)
}
```

**Real-world AP systems:**

- **Cassandra:** Highly available, eventually consistent
- **DynamoDB:** Configurable, but favors availability by default
- **CouchDB:** Available even during network splits
- **Riak:** Designed for availability and partition tolerance

### PACELC Extension

CAP Theorem only describes behavior **during partitions**. PACELC extends it:

**If Partition (P):**
- Choose Availability (A) or Consistency (C)

**Else (E) - normal operation:**
- Choose Latency (L) or Consistency (C)

```java
// MongoDB: PC/EC (Prioritizes Consistency)
// During partition: Choose Consistency (reject writes)
// During normal: Choose Consistency (wait for replication)
//   → Higher latency, but consistent

// Cassandra: PA/EL (Prioritizes Availability/Latency)
// During partition: Choose Availability (accept writes)
// During normal: Choose Latency (return immediately)
//   → Lower latency, eventual consistency
```

### Consistency Models Spectrum

```
Strongest ←──────────────────────────────────────→ Weakest

Linearizable ─ Sequential ─ Causal ─ Eventual ─ Read-your-writes
(CP systems)                                    (AP systems)
```

**Linearizable (Strongest):**
- All operations appear to happen atomically
- Global ordering of all operations
- Example: Bank transfers

**Eventual Consistency (Weakest):**
- All replicas will converge eventually (if writes stop)
- No guarantees on when
- Example: DNS, social media

### Conflict Resolution in AP Systems

When AP system accepts concurrent writes, conflicts happen:

**Strategy 1: Last Write Wins (LWW)**

```java
// Simple but loses data
public Value resolveConflict(Value value1, Value value2) {
    if (value1.getTimestamp() > value2.getTimestamp()) {
        return value1;  // Newer wins
    }
    return value2;
}

// Problem: Concurrent writes → one is discarded
```

**Strategy 2: Vector Clocks**

```java
// Track causality
public class VectorClock {
    private Map<String, Integer> clocks = new HashMap<>();  // {node_id: counter}

    public void increment(String nodeId) {
        clocks.put(nodeId, clocks.getOrDefault(nodeId, 0) + 1);
    }

    public boolean isConcurrent(VectorClock other) {
        // Neither clock is strictly greater
        return !(this.happensBefore(other) || other.happensBefore(this));
    }
}

// If concurrent: Keep both, let application resolve
// cart1 = {items: ["A", "B"], clock: {node1: 1, node2: 0}}
// cart2 = {items: ["A", "C"], clock: {node1: 0, node2: 1}}
// Merge: {items: ["A", "B", "C"]}
```

**Strategy 3: CRDTs (Conflict-free Replicated Data Types)**

```java
// Mathematically proven to converge
public class GCounter {
    // Grow-only counter (can only increment)
    private Map<String, Integer> counts = new HashMap<>();  // {replica_id: count}

    public void increment(String replicaId) {
        counts.put(replicaId, counts.getOrDefault(replicaId, 0) + 1);
    }

    public int value() {
        return counts.values().stream()
            .mapToInt(Integer::intValue)
            .sum();
    }

    public void merge(GCounter other) {
        // Take max count from each replica
        for (Map.Entry<String, Integer> entry : other.counts.entrySet()) {
            String replica = entry.getKey();
            int count = entry.getValue();
            counts.put(replica, Math.max(
                counts.getOrDefault(replica, 0),
                count
            ));
        }
    }

    // No conflicts! Always converges to correct count
}
```

---

## Real-World Examples

### CP System: Google Spanner

```sql
-- Globally distributed database with strong consistency
-- Uses atomic clocks + GPS for global ordering

BEGIN TRANSACTION;

-- Transfer money between accounts in different continents
UPDATE accounts SET balance = balance - 100
WHERE account_id = 'US-12345';

UPDATE accounts SET balance = balance + 100
WHERE account_id = 'EU-67890';

COMMIT;  -- Waits for global consensus
         -- High latency (cross-continent)
         -- But guaranteed consistent

-- During partition: Minority partition becomes unavailable
```

### AP System: Amazon DynamoDB

```java
// Shopping cart that's always available
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.document.*;

AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().build();
DynamoDB dynamoDB = new DynamoDB(client);
Table table = dynamoDB.getTable("ShoppingCarts");

// Write with eventual consistency
Item item = new Item()
    .withPrimaryKey("user_id", "12345")
    .withList("items", Arrays.asList("product_A", "product_B"))
    .withNumber("updated_at", 1234567890);

table.putItem(item);  // Returns immediately, replicates in background

// Read might be stale
GetItemSpec spec = new GetItemSpec()
    .withPrimaryKey("user_id", "12345")
    .withConsistentRead(false);  // Eventual consistency

Item response = table.getItem(spec);

// Might not see just-added items, but always gets response
```

### Hybrid: Cassandra (Tunable Consistency)

```java
import com.datastax.driver.core.*;

Cluster cluster = Cluster.builder()
    .addContactPoints("node1", "node2", "node3")
    .build();
Session session = cluster.connect("shopping");

// Write with tunable consistency
PreparedStatement statement = session.prepare(
    "INSERT INTO carts (user_id, items) VALUES (?, ?)"
);

BoundStatement boundStatement = statement.bind("user123",
    Arrays.asList("item1", "item2"));

// Set consistency level
boundStatement.setConsistencyLevel(ConsistencyLevel.QUORUM);  // Wait for majority
// Options: ONE, QUORUM, ALL

session.execute(boundStatement);

// CP-like: ConsistencyLevel.ALL (wait for all replicas)
// AP-like: ConsistencyLevel.ONE (wait for any replica)
// Balanced: ConsistencyLevel.QUORUM (wait for majority)
```

---

## Trade-offs and Decision Making

### Choose CP When:

- **Correctness is critical**
  - Financial transactions
  - Inventory management
  - Ticket booking
  - Medical records

- **Can tolerate downtime**
  - Better to be unavailable than inconsistent
  - Users understand maintenance windows

- **Examples:**
  - Banking systems
  - Stock trading platforms
  - Reservation systems
  - Distributed locks

### Choose AP When:

- **Availability is critical**
  - Social media (users expect 24/7 access)
  - Shopping carts
  - Content delivery
  - Analytics/logging

- **Can tolerate temporary inconsistencies**
  - Eventually consistent is acceptable
  - Conflicts are rare or resolvable

- **Examples:**
  - Facebook, Twitter
  - DNS
  - Caching layers
  - Shopping carts

### Strategies to Mitigate CAP Constraints

**1. Design for partition recovery**

```java
// Detect partition healing and sync
public void onPartitionHealed() {
    // Sync data between previously partitioned nodes
    List<Conflict> conflicts = findConflicts();

    for (Conflict conflict : conflicts) {
        Object resolved = resolveConflict(conflict);  // LWW, merge, etc.
        syncToAllReplicas(resolved);
    }
}
```

**2. Use different consistency levels for different operations**

```java
// Critical: Strong consistency
public void transferMoney(Account fromAccount, Account toAccount, double amount) {
    try (StrongConsistencyTransaction tx = beginStrongConsistencyTransaction()) {
        fromAccount.withdraw(amount);
        toAccount.deposit(amount);
        tx.commit();
    }
}

// Non-critical: Eventual consistency
public void updateProfilePicture(String userId, String imageUrl) {
    try (EventualConsistencyContext ctx = eventualConsistency()) {
        user.setProfileImage(imageUrl);
    }
}
```

**3. Compensating transactions (Saga pattern)**

```java
// Accept order even during partition (AP)
// Compensate later if inventory is oversold

public void placeOrder(Order order) {
    // Optimistically accept order
    ordersDb.create(order);

    // Async: Check inventory when partition heals
    backgroundTask(() -> verifyInventory(order));
}

public void verifyInventory(Order order) {
    if (!inventoryAvailable(order.getItems())) {
        // Compensate: Cancel order, refund customer
        ordersDb.cancel(order);
        notifyCustomer("Sorry, out of stock. Refunded.");
    }
}
```

---

## Where the Analogy Breaks Down

1. **ATMs typically use CA systems** - Most banks sacrifice partition tolerance (single central database)
2. **Real ATMs have offline mode** - Store transactions locally, sync later (eventually consistent)
3. **Bank balances can't be "eventually consistent"** - Money requires strong consistency (CP)
4. **Network partitions are rare for ATMs** - Banks invest heavily in redundant networks
5. **ATMs have regulatory requirements** - Must maintain audit trails regardless of CAP choice

---

## TL;DR

CAP Theorem is like an ATM network that can't simultaneously guarantee all three properties when networks fail. **Consistency** means all ATMs show the exact same account balance (every read gets the most recent write). **Availability** means every ATM always responds to requests (no "service unavailable" errors). **Partition Tolerance** means the system works even when network connections between ATMs break (branches can't communicate). When a network partition occurs, you must choose between **CP (Consistency + Partition Tolerance)**: reject requests during partitions to maintain consistency (banking systems - better unavailable than wrong), or **AP (Availability + Partition Tolerance)**: accept all requests but risk temporary inconsistencies that sync later (social media - better show stale data than be down). CA systems (Consistency + Availability without partition tolerance) only work with single servers or perfect networks, which are unrealistic for distributed systems. In practice, partitions will happen (cables break, routers fail), so the real choice is CP vs AP: banks choose CP (strong consistency, occasional downtime), social media chooses AP (high availability, eventual consistency). The key insight: in distributed systems, you can't have perfect consistency and perfect availability when networks fail - you must choose which one matters more for your use case.
