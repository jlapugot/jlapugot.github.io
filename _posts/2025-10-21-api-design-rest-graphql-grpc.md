---
layout: post
title: "API Design: REST vs GraphQL vs gRPC Through Shopping Methods"
date: 2025-10-21
tags: [system-design]
analogy_domain: "business"
series: "system-design"
series_title: "System Design Fundamentals"
series_order: 3
excerpt: "Understand REST, GraphQL, and gRPC through shopping methods. Learn when to use each API style, just like choosing between a department store, personal shopper, or warehouse system."
description: "A comprehensive guide to API design patterns comparing REST, GraphQL, and gRPC using shopping analogies. Learn trade-offs, performance characteristics, and when to use each approach."
keywords: rest api, graphql, grpc, api design, microservices, backend architecture, api performance
related_concepts:
  - "HTTP protocols and methods"
  - "API versioning strategies"
  - "Service-to-service communication"
---

## The Problem

Your mobile app needs user data. Should you fetch everything in one request? Make multiple small requests? Let the client specify what it needs? Your microservices need to talk to each other—should they use JSON over HTTP or binary protocols? You're building an API but unsure which style fits your use case. REST is familiar, GraphQL promises flexibility, gRPC offers speed. Each has trade-offs, and choosing wrong means performance issues, over-fetching data, or maintenance nightmares.

---

## The Analogy

**Think of API design like different shopping methods.**

### The Challenge: Getting What You Need

You need to buy items for your home:
- A lamp for the bedroom
- Just the lamp's price tag (not the whole lamp)
- Batteries for the remote
- The store hours for tomorrow

How do you shop for these items? Different methods have different trade-offs.

### REST = Department Store Shopping

In a **department store**, you navigate through organized sections:
- Electronics section (aisle 3)
- Home goods section (aisle 7)
- Customer service desk (front counter)
- Each section has standard shelves with fixed layouts
- You walk to each section separately
- Can't customize what's on the shelf

<div class="mermaid">
graph TB
    You[You: Customer] --> Electronics[Electronics Aisle<br/>/api/products/batteries]
    You --> HomeGoods[Home Goods Aisle<br/>/api/products/lamp]
    You --> Service[Customer Service<br/>/api/store/hours]

    Electronics --> Batteries[Get: Entire battery package<br/>+ price + description + reviews + stock]
    HomeGoods --> Lamp[Get: Entire lamp<br/>+ price + dimensions + reviews + stock]
    Service --> Hours[Get: Store info<br/>+ hours + location + phone]

    style You fill:#3498db
    style Electronics fill:#95a5a6
    style HomeGoods fill:#95a5a6
    style Service fill:#95a5a6
    style Batteries fill:#e74c3c
    style Lamp fill:#e74c3c
    style Hours fill:#e74c3c
</div>

**REST API works the same way:**

```javascript
// Need lamp info? Visit the lamp "aisle"
GET /api/products/123

Response: {
  id: 123,
  name: "Desk Lamp",
  price: 29.99,
  description: "Modern LED desk lamp...",
  dimensions: { height: 15, width: 6 },
  weight: 2.5,
  reviews: [...],        // You didn't need this
  stock: 45,             // Or this
  relatedProducts: [...] // Or this
}

// Need batteries? Different aisle
GET /api/products/456

// Need store hours? Different desk
GET /api/store/hours
```

**Characteristics:**
- **Fixed responses**: Like shelf layouts, endpoints return predetermined data
- **Multiple trips**: Need data from multiple resources? Multiple requests
- **Over-fetching**: Get entire product when you only wanted the price
- **Under-fetching**: Product doesn't include manufacturer info? Another request needed
- **Predictable**: Easy to understand, cache, and debug

### GraphQL = Personal Shopper Service

With a **personal shopper**, you hand them a detailed list:
- "Get me the lamp from aisle 7, but I only need to know its price and if it's in stock"
- "Also, grab the batteries from aisle 3, just the brand name and price"
- "And find out tomorrow's store hours"

The personal shopper makes one trip and brings back exactly what you asked for—nothing more, nothing less.

<div class="mermaid">
graph TB
    You[You: Customer] --> Shopper[Personal Shopper<br/>/graphql]

    Shopper --> Request["Custom Request:<br/>lamp.price, lamp.stock<br/>batteries.brand, batteries.price<br/>store.hours"]

    Request --> Backend[Shopper visits all aisles]
    Backend --> Lamp[Lamp Aisle]
    Backend --> Batteries[Battery Aisle]
    Backend --> Service[Customer Service]

    Lamp --> Response
    Batteries --> Response
    Service --> Response

    Response[Exactly what you asked for] --> You

    style You fill:#3498db
    style Shopper fill:#9b59b6
    style Request fill:#9b59b6
    style Response fill:#2ecc71
</div>

**GraphQL works the same way:**

```graphql
# Single request with exact requirements
query {
  product(id: 123) {
    price      # Only price
    stock      # Only stock
  }

  batteries: product(id: 456) {
    name       # Only name
    price      # Only price
  }

  store {
    hours      # Only hours
  }
}

# Response: Exactly what you asked for
{
  "product": {
    "price": 29.99,
    "stock": 45
  },
  "batteries": {
    "name": "AA Batteries",
    "price": 8.99
  },
  "store": {
    "hours": "9am - 9pm"
  }
}
```

**Characteristics:**
- **Custom queries**: Clients specify exactly what they need
- **Single request**: Fetch related data from multiple sources in one trip
- **No over-fetching**: Only requested fields returned
- **No under-fetching**: Get nested/related data in one query
- **Flexible**: Perfect for mobile apps with limited bandwidth

### gRPC = Warehouse Direct Ordering

In a **warehouse bulk ordering system** (like Costco's business center):
- You don't browse aisles
- You speak the warehouse's efficient internal language
- Use item codes: "LAMP-DK-001, QTY-1, FIELDS-PRICE-STOCK"
- Data comes back in compact, binary format
- Fast, but requires special knowledge
- Not meant for casual shoppers

<div class="mermaid">
graph TB
    Service[Your Service] -->|Binary Protocol| Warehouse[Warehouse System<br/>gRPC Server]

    Warehouse --> Decode[Decode binary message]
    Decode --> Process[Process request]
    Process --> Encode[Encode binary response]
    Encode --> Service

    style Service fill:#3498db
    style Warehouse fill:#e67e22
    style Decode fill:#95a5a6
    style Process fill:#95a5a6
    style Encode fill:#95a5a6
</div>

**gRPC works the same way:**

```protobuf
// Define contract (warehouse protocol)
service ProductService {
  rpc GetProduct (ProductRequest) returns (ProductResponse);
}

message ProductRequest {
  int32 id = 1;
  repeated string fields = 2;  // What fields to return
}

message ProductResponse {
  double price = 1;
  int32 stock = 2;
}
```

```javascript
// Client code (compact, typed)
const response = await client.GetProduct({
  id: 123,
  fields: ['price', 'stock']
});

// Binary data sent over wire (fast, small)
// Strongly typed, auto-generated code
```

**Characteristics:**
- **Binary protocol**: Compact, fast, efficient
- **Strongly typed**: Contracts defined in .proto files
- **Code generation**: Client/server code auto-generated
- **Bidirectional streaming**: Server can push data to clients
- **Service-to-service**: Best for internal microservices, not public APIs

### How It Maps

| Shopping Method | API Type | Key Point |
|-----------------|----------|-----------|
| **Department store** | REST | Fixed aisles (endpoints), standard layout |
| **Walk to each aisle** | Multiple REST calls | Separate request per resource |
| **Shelf has everything** | Over-fetching | Get entire product object |
| **Personal shopper** | GraphQL | One trip, custom request |
| **Detailed shopping list** | GraphQL query | Specify exact fields needed |
| **Shopper visits all aisles** | GraphQL resolver | Backend fetches from multiple sources |
| **Warehouse ordering** | gRPC | Efficient, technical, binary |
| **Item codes** | Protocol Buffers | Strongly typed contracts |
| **Bulk delivery** | Streaming | Continuous data flow |

---

## The Technical Deep Dive

### REST: Resource-Oriented Architecture

**Core Principles:**

```javascript
// Resources are nouns (things)
GET    /api/users           // Get all users
GET    /api/users/123       // Get specific user
POST   /api/users           // Create user
PUT    /api/users/123       // Update user
DELETE /api/users/123       // Delete user

// Nested resources
GET    /api/users/123/posts        // User's posts
GET    /api/posts/456/comments     // Post's comments
```

**Real Example: User Profile API**

```javascript
// Client needs: user name, email, and their latest 3 posts

// Request 1: Get user
GET /api/users/123
Response: {
  id: 123,
  name: "Alice",
  email: "alice@example.com",
  avatar: "...",           // Don't need
  bio: "...",              // Don't need
  createdAt: "...",        // Don't need
  followers: 1523,         // Don't need
  following: 342           // Don't need
}

// Request 2: Get user's posts
GET /api/users/123/posts?limit=3
Response: {
  posts: [
    {
      id: 1,
      title: "Post 1",
      content: "...",      // 10KB of content you don't need
      author: {...},       // Already have user info
      comments: [...],     // Don't need
      likes: 42
    },
    // ... 2 more posts with same over-fetching
  ]
}

// Total: 2 requests, ~50KB of data
// Needed: ~2KB of data
// Over-fetching: 96%
```

**REST Strengths:**

- **Simple and intuitive**: URLs are self-documenting
- **Cacheable**: HTTP caching works out of the box
- **Stateless**: Each request is independent
- **Tooling**: Every language has HTTP clients
- **Browser-friendly**: Can test in browser address bar

**REST Weaknesses:**

- **Over-fetching**: Get data you don't need
- **Under-fetching**: Need multiple requests for related data
- **Versioning**: Breaking changes require /v2/ endpoints
- **No type safety**: JSON is untyped

**When to Use REST:**

- Public APIs (easy for third parties to understand)
- CRUD operations on resources
- Simple, predictable data needs
- When HTTP caching is critical
- Browser-based applications

### GraphQL: Query Language for APIs

**Core Principles:**

```graphql
# Schema defines what's available (the "menu")
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
}

type Query {
  user(id: ID!): User
  posts: [Post!]!
}
```

**Real Example: Same User Profile**

```graphql
# Single request with exact requirements
query {
  user(id: 123) {
    name
    email
    posts(limit: 3) {
      title
      # No content, no author, no comments
    }
  }
}

# Response: Exactly what you asked for
{
  "user": {
    "name": "Alice",
    "email": "alice@example.com",
    "posts": [
      { "title": "Post 1" },
      { "title": "Post 2" },
      { "title": "Post 3" }
    ]
  }
}

# Total: 1 request, ~0.5KB of data
# Needed: ~0.5KB of data
# Over-fetching: 0%
```

**GraphQL Features:**

```graphql
# 1. Nested queries (fetch related data)
query {
  user(id: 123) {
    name
    posts {
      title
      comments {
        text
        author {
          name
        }
      }
    }
  }
}

# 2. Aliases (fetch multiple of same type)
query {
  alice: user(id: 123) { name }
  bob: user(id: 456) { name }
}

# 3. Fragments (reusable field sets)
fragment UserInfo on User {
  name
  email
  avatar
}

query {
  user(id: 123) {
    ...UserInfo
  }
}

# 4. Mutations (modify data)
mutation {
  createPost(title: "New Post", content: "...") {
    id
    title
  }
}

# 5. Subscriptions (real-time updates)
subscription {
  newComment(postId: 123) {
    text
    author { name }
  }
}
```

**GraphQL Implementation (Node.js):**

```javascript
// Schema
const typeDefs = `
  type Query {
    user(id: ID!): User
  }

  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
  }
`;

// Resolvers (how to fetch data)
const resolvers = {
  Query: {
    user: (parent, { id }) => {
      return db.users.findById(id);
    }
  },
  User: {
    posts: (user) => {
      // Only called if client requests posts
      return db.posts.findByUserId(user.id);
    }
  }
};

// Server
const server = new ApolloServer({ typeDefs, resolvers });
```

**GraphQL Strengths:**

- **No over-fetching**: Client gets exactly what it asks for
- **No under-fetching**: Fetch nested/related data in one request
- **Strongly typed**: Schema defines all possibilities
- **Introspection**: Clients can query the schema itself
- **Versionless**: Add new fields without breaking old clients
- **Developer experience**: GraphiQL/Playground for testing

**GraphQL Weaknesses:**

- **Complexity**: More complex than REST
- **Caching**: HTTP caching doesn't work well
- **Query depth**: Need safeguards against deeply nested queries
- **Learning curve**: New concepts for REST-familiar developers
- **Over-querying**: Clients can request too much data
- **Backend complexity**: N+1 query problems, DataLoader needed

**When to Use GraphQL:**

- Mobile apps (minimize data transfer)
- Complex, interconnected data
- Multiple client types (web, mobile, desktop)
- Rapid frontend iteration
- When clients need flexibility

### gRPC: High-Performance RPC Framework

**Core Principles:**

```protobuf
// Define service contract in .proto file
syntax = "proto3";

service UserService {
  // Unary: single request, single response
  rpc GetUser (GetUserRequest) returns (User);

  // Server streaming: single request, stream responses
  rpc ListPosts (ListPostsRequest) returns (stream Post);

  // Client streaming: stream requests, single response
  rpc CreatePosts (stream Post) returns (CreatePostsResponse);

  // Bidirectional streaming
  rpc Chat (stream Message) returns (stream Message);
}

message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
}

message Post {
  int32 id = 1;
  string title = 2;
  string content = 3;
}
```

**Code Generation:**

```bash
# Generate client and server code
protoc --go_out=. --go-grpc_out=. user.proto

# Generates:
# - user.pb.go (data structures)
# - user_grpc.pb.go (client/server interfaces)
```

**Server Implementation (Go):**

```go
type server struct {
    pb.UnimplementedUserServiceServer
}

func (s *server) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.User, error) {
    user, err := db.GetUser(req.Id)
    if err != nil {
        return nil, status.Errorf(codes.NotFound, "user not found")
    }

    return &pb.User{
        Id:    user.ID,
        Name:  user.Name,
        Email: user.Email,
    }, nil
}

// Start server
s := grpc.NewServer()
pb.RegisterUserServiceServer(s, &server{})
s.Serve(lis)
```

**Client Implementation (Go):**

```go
// Connect to server
conn, _ := grpc.Dial("localhost:50051", grpc.WithInsecure())
defer conn.Close()

client := pb.NewUserServiceClient(conn)

// Make request
user, err := client.GetUser(context.Background(), &pb.GetUserRequest{
    Id: 123,
})

fmt.Println(user.Name, user.Email)
```

**Streaming Example:**

```go
// Server streaming: send multiple posts
func (s *server) ListPosts(req *pb.ListPostsRequest, stream pb.UserService_ListPostsServer) error {
    posts, _ := db.GetPosts(req.UserId)

    for _, post := range posts {
        stream.Send(&pb.Post{
            Id:      post.ID,
            Title:   post.Title,
            Content: post.Content,
        })
    }

    return nil
}

// Client receives stream
stream, _ := client.ListPosts(ctx, &pb.ListPostsRequest{UserId: 123})

for {
    post, err := stream.Recv()
    if err == io.EOF {
        break
    }
    fmt.Println(post.Title)
}
```

**gRPC Strengths:**

- **Performance**: Binary protocol, ~7x smaller than JSON
- **Strongly typed**: Compile-time type checking
- **Code generation**: Client/server code auto-generated
- **Streaming**: Bidirectional, real-time data flow
- **Language agnostic**: Works with Go, Java, Python, Node, etc.
- **HTTP/2**: Multiplexing, header compression

**gRPC Weaknesses:**

- **Browser support**: Limited (requires gRPC-Web proxy)
- **Human readability**: Binary format, can't debug with curl
- **Learning curve**: Protocol Buffers, streaming concepts
- **Tooling**: Fewer tools than REST
- **Not RESTful**: Can't leverage HTTP caching

**When to Use gRPC:**

- Microservices communication (internal APIs)
- High-performance requirements
- Polyglot environments (multiple languages)
- Real-time streaming (chat, live updates)
- Mobile clients (efficient binary protocol)

---

## Direct Comparison

### Performance Benchmark

**Scenario:** Fetch user with 10 posts

| API Type | Requests | Payload Size | Time |
|----------|----------|--------------|------|
| **REST** | 2 requests | ~50 KB | 250ms |
| **GraphQL** | 1 request | ~5 KB | 150ms |
| **gRPC** | 1 request | ~2 KB | 80ms |

### Code Comparison: Get User with Posts

**REST:**

```javascript
// Request 1
const user = await fetch('/api/users/123').then(r => r.json());

// Request 2
const posts = await fetch('/api/users/123/posts?limit=10').then(r => r.json());

// Manual combination
const result = {
  name: user.name,
  email: user.email,
  posts: posts.map(p => ({ title: p.title }))
};
```

**GraphQL:**

```javascript
const result = await client.query({
  query: gql`
    query {
      user(id: 123) {
        name
        email
        posts(limit: 10) {
          title
        }
      }
    }
  `
});
```

**gRPC:**

```javascript
const result = await client.getUser({
  id: 123,
  include: ['name', 'email', 'posts'],
  postsLimit: 10
});
```

### API Evolution

**REST:**

```javascript
// Version 1
GET /api/v1/users/123

// Breaking change: email → emailAddress
GET /api/v2/users/123  // New version needed!
```

**GraphQL:**

```graphql
# Version 1
type User {
  email: String!
}

# Add new field (non-breaking)
type User {
  email: String! @deprecated(reason: "Use emailAddress")
  emailAddress: String!
}

# Old clients still work, new clients use emailAddress
```

**gRPC:**

```protobuf
// Version 1
message User {
  string email = 1;
}

// Add new field (non-breaking)
message User {
  string email = 1;        // Old field
  string email_address = 2; // New field
}

// Field numbers never reused = backward compatible
```

---

## Choosing the Right API Style

### Use REST When:

- Public API for third-party developers
- Simple CRUD operations
- HTTP caching is important
- Resources map cleanly to URLs
- Team is familiar with REST

**Example:** GitHub API, Stripe API, Twilio API

### Use GraphQL When:

- Mobile app with limited bandwidth
- Complex, nested data requirements
- Multiple client types (web, iOS, Android)
- Rapid frontend development
- Clients need different data shapes

**Example:** Facebook, GitHub (v4), Shopify, Netflix (internal)

### Use gRPC When:

- Microservices communication (internal)
- Performance is critical
- Real-time streaming needed
- Polyglot environment
- Not browser-facing

**Example:** Google Cloud APIs, Uber microservices, Netflix microservices

### Can You Combine Them?

**Yes! Many companies use hybrid approaches:**

```
┌─────────────────────────────────────┐
│         Public API (REST)           │  External developers
└─────────────────────────────────────┘
                 │
┌─────────────────────────────────────┐
│      Mobile/Web API (GraphQL)       │  Your own clients
└─────────────────────────────────────┘
                 │
┌─────────────────────────────────────┐
│   Internal Services (gRPC)          │  Microservices
└─────────────────────────────────────┘
```

**Example Architecture:**

- **REST** for public developer API (simple, well-documented)
- **GraphQL** for mobile/web apps (flexible, efficient)
- **gRPC** for service-to-service calls (fast, typed)

---

## Best Practices

### REST Best Practices

```javascript
// GOOD: Resource-oriented URLs
GET  /api/users
POST /api/users
GET  /api/users/123

// BAD: Action-oriented URLs
GET  /api/getUsers
POST /api/createUser

// GOOD: Use HTTP status codes
200 OK
201 Created
400 Bad Request
404 Not Found
500 Internal Server Error

// GOOD: Pagination
GET /api/users?page=2&limit=20

// GOOD: Filtering
GET /api/users?status=active&role=admin

// GOOD: Sorting
GET /api/users?sort=createdAt:desc
```

### GraphQL Best Practices

```graphql
# GOOD: Pagination with connections
query {
  users(first: 10, after: "cursor") {
    edges {
      node { id name }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}

# GOOD: Use DataLoader to prevent N+1
const userLoader = new DataLoader(async (ids) => {
  return await db.users.findByIds(ids);
});

# GOOD: Limit query depth
const depthLimit = require('graphql-depth-limit');
const server = new ApolloServer({
  validationRules: [depthLimit(5)]
});

# GOOD: Add costs to prevent expensive queries
directive @cost(complexity: Int!) on FIELD_DEFINITION
```

### gRPC Best Practices

```protobuf
// GOOD: Use semantic versioning
package myapp.v1;

// GOOD: Never reuse field numbers
message User {
  // string old_field = 1; // DELETED - never reuse 1
  reserved 1;
  string new_field = 2;
}

// GOOD: Use streaming for large datasets
rpc ListUsers (ListUsersRequest) returns (stream User);

// GOOD: Include metadata for tracing
md := metadata.Pairs("request-id", "12345")
ctx := metadata.NewOutgoingContext(context.Background(), md)
```

---

## Where the Analogy Breaks Down

1. **Shopping is synchronous** - APIs can be async with callbacks/webhooks
2. **Stores have physical limits** - APIs can scale to millions of requests
3. **Shoppers use one method** - Services can expose multiple API types
4. **Products don't change while shopping** - API data can be stale/cached
5. **No store streams products** - gRPC supports bidirectional streaming

---

## TL;DR

API design is like choosing a shopping method. **REST** is like a department store: you walk to different aisles (endpoints) for different items (resources), getting fixed shelf layouts (predetermined responses), sometimes fetching entire products when you only need the price (over-fetching), and making multiple trips for related items (multiple requests). **GraphQL** is like a personal shopper: you provide a detailed list of exactly what you need (query), make one trip (single request), and get precisely what you asked for (no over/under-fetching), though the shopper's job is complex (resolver complexity). **gRPC** is like warehouse bulk ordering: you use efficient item codes (binary protocol), communicate in the warehouse's language (Protocol Buffers), get compact shipments (small payload), and enjoy fast service (high performance), but it's technical and not meant for casual browsers (internal services only). Choose REST for public APIs and simple CRUD, GraphQL for mobile apps and complex data needs, and gRPC for high-performance microservices communication. Many companies use all three: REST for external developers, GraphQL for their own clients, and gRPC for internal services.
