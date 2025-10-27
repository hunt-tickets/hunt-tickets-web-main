# Supabase Query Architecture Guide

## Architecture Overview

This directory implements a layered approach to Supabase database operations optimized for security, performance, and cost efficiency.

```
queries/
├── server/          # Server-side queries (primary approach)
│   ├── users.ts     # User-related queries
│   └── events.ts    # Event-related queries
├── client/          # Client-side operations (minimal)
│   ├── realtime.ts  # Real-time subscriptions
│   └── mutations.ts # Client mutations
└── actions/         # Server actions for writes
    └── tickets.ts   # Secure ticket operations
```

## Key Principles

### 1. **Server-First Approach** 🔒
- **Primary**: All data fetching happens on the server
- **Security**: RLS policies are enforced at database level
- **Cost**: Reduces client bundle size and API calls

### 2. **Request-Level Caching** ⚡
- Uses React's `cache()` to deduplicate queries within a single request
- Prevents multiple identical DB calls in one render
- Automatic cache invalidation between requests

### 3. **Optimized Query Patterns** 📊

#### Single Query with Joins
```typescript
// ❌ Bad: Multiple queries
const user = await getUser(id);
const profile = await getProfile(user.id);
const preferences = await getPreferences(user.id);

// ✅ Good: Single query with joins
const data = await supabase
  .from("users")
  .select(`
    *,
    profile:profiles(*),
    preferences:user_preferences(*)
  `)
  .single();
```

#### Batch Operations
```typescript
// ❌ Bad: N+1 queries
for (const id of userIds) {
  const user = await getUser(id);
}

// ✅ Good: Single batch query
const users = await supabase
  .from("users")
  .select("*")
  .in("id", userIds);
```

### 4. **Client-Side Usage** 🌐
Only use client-side queries for:
- **Real-time subscriptions** (live updates)
- **Presence** (who's online)
- **Optimistic updates** (immediate UI feedback)

### 5. **Security Best Practices** 🛡️

#### Server Actions for Writes
```typescript
// All mutations go through server actions
"use server";

export async function purchaseTicket() {
  // Verify authentication
  const user = await getUser();

  // Validate permissions
  if (!canPurchase(user)) throw Error();

  // Process in transaction
  return await supabase.rpc("purchase_ticket", {...});
}
```

#### RLS Policies
```sql
-- Row Level Security enforced at DB
CREATE POLICY "Users can only see own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);
```

## Performance Optimizations

### 1. **Indexed Columns**
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_city ON events(city);
```

### 2. **Full-Text Search**
```sql
-- Use full-text search for text queries
ALTER TABLE events
ADD COLUMN fts tsvector
GENERATED ALWAYS AS (
  to_tsvector('english', name || ' ' || description)
) STORED;

CREATE INDEX idx_events_fts ON events USING GIN(fts);
```

### 3. **Materialized Views**
```sql
-- Pre-compute expensive queries
CREATE MATERIALIZED VIEW popular_events_view AS
SELECT e.*, COUNT(t.id) as ticket_sales
FROM events e
LEFT JOIN tickets t ON t.event_id = e.id
GROUP BY e.id
ORDER BY ticket_sales DESC;

-- Refresh periodically
REFRESH MATERIALIZED VIEW CONCURRENTLY popular_events_view;
```

### 4. **Connection Pooling**
```typescript
// Server-side clients use connection pooling automatically
const supabase = await createClient(); // Pooled connection
```

## Cost Optimization

### 1. **Minimize API Calls**
- Cache aggressively on server
- Batch operations
- Use server-side rendering

### 2. **Optimize Payload Size**
```typescript
// Select only needed columns
.select("id, name, email") // Not .select("*")
```

### 3. **Use Count Wisely**
```typescript
// Get count only when needed
.select("*", { count: "exact" }) // Adds overhead
```

### 4. **Limit Real-time Subscriptions**
- Only subscribe to essential updates
- Unsubscribe when component unmounts
- Use presence sparingly

## Usage Examples

### Server Component
```tsx
import { getEvents } from "@/lib/supabase/queries/server/events";

export default async function EventsPage() {
  const { events, total } = await getEvents({
    limit: 20,
    category: "concerts"
  });

  return <EventsList events={events} />;
}
```

### Client Component with Real-time
```tsx
"use client";
import { useTicketAvailability } from "@/lib/supabase/queries/client/realtime";

function TicketButton({ tierId }) {
  const { available, loading } = useTicketAvailability(tierId);

  if (loading) return <Spinner />;
  if (!available) return <Button disabled>Sold Out</Button>;

  return <Button>Buy Now ({available} left)</Button>;
}
```

### Server Action
```tsx
import { purchaseTicket } from "@/lib/supabase/actions/tickets";

function PurchaseForm() {
  async function handleSubmit(formData: FormData) {
    "use server";
    await purchaseTicket(
      formData.get("tierId"),
      formData.get("quantity")
    );
    redirect("/success");
  }

  return <form action={handleSubmit}>...</form>;
}
```

## Database Functions (RPC)

For complex operations, use PostgreSQL functions:

```sql
CREATE OR REPLACE FUNCTION purchase_tickets(
  p_user_id UUID,
  p_ticket_tier_id UUID,
  p_quantity INT
)
RETURNS JSON AS $$
DECLARE
  v_available INT;
  v_order_id UUID;
BEGIN
  -- Lock the inventory row
  SELECT available_count INTO v_available
  FROM ticket_inventory
  WHERE ticket_tier_id = p_ticket_tier_id
  FOR UPDATE;

  IF v_available < p_quantity THEN
    RAISE EXCEPTION 'insufficient_tickets';
  END IF;

  -- Create order
  INSERT INTO orders (user_id, status)
  VALUES (p_user_id, 'pending')
  RETURNING id INTO v_order_id;

  -- Update inventory
  UPDATE ticket_inventory
  SET available_count = available_count - p_quantity
  WHERE ticket_tier_id = p_ticket_tier_id;

  -- Return result
  RETURN json_build_object(
    'order_id', v_order_id,
    'success', true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Testing

```typescript
// Mock Supabase for tests
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: mockData,
            error: null
          }))
        }))
      }))
    }))
  }))
}));
```

## Monitoring

1. **Database Metrics**: Monitor in Supabase Dashboard
2. **Query Performance**: Use `EXPLAIN ANALYZE` in SQL Editor
3. **API Usage**: Track in Supabase Usage tab
4. **Error Tracking**: Implement Sentry or similar

## Common Pitfalls to Avoid

1. ❌ **Client-side queries for sensitive data**
2. ❌ **Not using RLS policies**
3. ❌ **Forgetting to unsubscribe from realtime**
4. ❌ **N+1 queries**
5. ❌ **Not indexing foreign keys**
6. ❌ **Using `select("*")` everywhere**
7. ❌ **Not caching on the server**
8. ❌ **Direct database mutations from client**

## Best Practices Summary

1. ✅ **Server-side by default**
2. ✅ **Cache aggressively**
3. ✅ **Batch operations**
4. ✅ **Use joins over multiple queries**
5. ✅ **Index frequently queried columns**
6. ✅ **Server actions for mutations**
7. ✅ **RLS for security**
8. ✅ **Optimize payload size**
9. ✅ **Use TypeScript for type safety**
10. ✅ **Monitor and optimize based on usage**