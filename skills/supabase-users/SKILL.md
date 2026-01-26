---
name: supabase-users
description: Comprehensive Supabase development expert covering Edge Functions, database schema management, migrations, PostgreSQL functions, and RLS policies. Use for any Supabase development including TypeScript/Deno Edge Functions, declarative schema management, SQL formatting, migration creation, database function authoring with SECURITY INVOKER, and RLS policy implementation with auth.uid() and auth.jwt().
---

# Supabase Development Expert

## 1. Supabase Edge Functions

### Guidelines

- Prioritize Web APIs and Deno core APIs over external dependencies
- Store reusable utilities in `supabase/functions/_shared` without cross-function dependencies
- Use explicit prefixes (`npm:` or `jsr:`) for external dependencies
- Always specify versions for external packages
- Avoid `deno.land/x`, `esm.sh`, and `unpkg.com`; use `npm:` specifiers instead
- Access Node built-in APIs via `node:` prefix when Deno gaps exist
- Use `Deno.serve` instead of importing HTTP server libraries
- Pre-populated secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`
- Single functions can handle multiple routes; use Express or Hono for routing
- File operations permitted only in `/tmp` directory
- Use `EdgeRuntime.waitUntil()` for background tasks without blocking responses

### Edge Function Examples

**Simple Hello World:**
```typescript
interface reqPayload {
  name: string;
}

Deno.serve(async (req: Request) => {
  const { name }: reqPayload = await req.json();
  return new Response(
    JSON.stringify({ message: `Hello ${name}!` }),
    { headers: { 'Content-Type': 'application/json' }}
  );
});
```

**Using npm Packages:**
```typescript
import express from "npm:express@4.18.2";

const app = express();
app.get(/(.*)/,(req, res) => {
  res.send("Welcome to Supabase");
});
app.listen(8000);
```

**Generate Embeddings:**
```typescript
const model = new Supabase.ai.Session('gte-small');

Deno.serve(async (req: Request) => {
  const params = new URL(req.url).searchParams;
  const input = params.get('text');
  const output = await model.run(input,
    { mean_pool: true, normalize: true });
  return new Response(JSON.stringify(output), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

## 2. Database Schema Management (Declarative)

### Mandatory Instructions

**Exclusive Use of Declarative Schema:**
- All schema modifications must be defined within `.sql` files in `supabase/schemas/`
- Do NOT create or modify files directly in `supabase/migrations/`; migrations generate automatically

**Schema Declaration:**
- Create/update `.sql` files in `supabase/schemas/` for each database entity
- Ensure each file represents the desired final state

**Migration Generation:**
- Stop local Supabase: `supabase stop`
- Generate migrations: `supabase db diff -f <migration_name>`

**Schema File Organization:**
- Files execute in lexicographic order; name accordingly for dependencies
- Append new columns to table ends to minimize diffs

**Rollback Procedures:**
- Update schema files to reflect desired state
- Generate new migration: `supabase db diff -f <rollback_name>`
- Review carefully to prevent data loss

**Known Caveats:**
The migra tool has limitations with:
- DML statements (INSERT, UPDATE, DELETE)
- View ownership and security properties
- RLS policy alterations
- Column privilege changes
- Schema privileges, comments, partitions

## 3. PostgreSQL SQL Style Guide

### General

- Use lowercase for SQL reserved words
- Store dates in ISO 8601 format
- Include block comments (`/* */`) and line comments (`--`)

### Naming Conventions

- Use `snake_case` for tables and columns
- Plural table names, singular column names
- Avoid reserved words; limit to 63 characters
- Foreign key references: `singular_id` (e.g., `user_id` for `users` table)

### Tables

- Always add `id bigint generated always as identity primary key`
- Create in `public` schema unless specified
- Always include schema in queries
- Add descriptive comments (up to 1024 characters)

### Columns

- Singular names, avoid generic names
- Lowercase except for acronyms
- Foreign key format: `table_name_id`

**Example:**
```sql
create table books (
  id bigint generated always as identity primary key,
  title text not null,
  author_id bigint references authors(id)
);
comment on table books is 'A list of all books in the library.';
```

### Queries

**Smaller queries:**
```sql
select *
from employees
where end_date is null;
```

**Larger queries:**
```sql
select
  first_name,
  last_name
from
  employees
where
  start_date between '2021-01-01' and '2021-12-31'
and
  status = 'employed';
```

### Joins and Subqueries

- Format for clarity; align with related clauses
- Use full table names for readability

### Aliases

Include `AS` keyword; use meaningful aliases:
```sql
select count(*) as total_employees
from employees
where end_date is null;
```

### Complex Queries and CTEs

- Prefer CTEs for extremely complex queries
- Keep CTEs linear and readable
- Add comments to each block

## 4. Database Migrations

### Creating a Migration File

Format: `YYYYMMDDHHmmss_short_description.sql`

Example: `20240906123045_create_profiles.sql`

### SQL Guidelines for Migrations

- Include header comments with purpose and affected objects
- Write lowercase SQL
- Add copious comments for destructive operations
- Enable RLS on all new tables
- Create granular RLS policies:
  - Separate policies for SELECT, INSERT, UPDATE, DELETE
  - Separate policies for `anon` and `authenticated` roles
  - Include rationale comments

## 5. Database Functions

### General Guidelines

- Default to `SECURITY INVOKER` (user's permissions, not creator's)
- Set `search_path = ''` (empty string) to prevent unintended schema resolution
- Use fully qualified names (e.g., `schema_name.table_name`)
- Validate all SQL queries

### Best Practices

- Minimize side effects; prefer result-returning functions
- Use explicit typing for parameters and returns
- Mark functions as `IMMUTABLE` or `STABLE` when possible
- Use `VOLATILE` only for data-modifying functions
- Include `CREATE TRIGGER` statements for trigger functions

### Function Examples

**Simple SECURITY INVOKER:**
```sql
create or replace function my_schema.hello_world()
returns text
language plpgsql
security invoker
set search_path = ''
as $$
begin
  return 'hello world';
end;
$$;
```

**With Parameters:**
```sql
create or replace function public.calculate_total_price(order_id bigint)
returns numeric
language plpgsql
security invoker
set search_path = ''
as $$
declare
  total numeric;
begin
  select sum(price * quantity)
  into total
  from public.order_items
  where order_id = calculate_total_price.order_id;
  return total;
end;
$$;
```

**Trigger Function:**
```sql
create or replace function my_schema.update_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger update_updated_at_trigger
before update on my_schema.my_table
for each row
execute function my_schema.update_updated_at();
```

**Immutable Function:**
```sql
create or replace function my_schema.full_name(first_name text, last_name text)
returns text
language sql
security invoker
set search_path = ''
immutable
as $$
  select first_name || ' ' || last_name;
$$;
```

## 6. Row Level Security (RLS) Policies

### Output Requirements

- Valid SQL only
- Use only `CREATE POLICY` or `ALTER POLICY`
- Double apostrophes in strings (e.g., `'Night''s watch'`)
- Use `auth.uid()` instead of `current_user`
- SELECT: `USING` only
- INSERT: `WITH CHECK` only
- UPDATE: `WITH CHECK` and typically `USING`
- DELETE: `USING` only
- Separate policies for each operation type
- Descriptive policy names in double quotes
- Explanations outside SQL, not as inline comments
- Encourage `PERMISSIVE` over `RESTRICTIVE` policies

**Example:**
```sql
CREATE POLICY "My descriptive policy." ON books
FOR INSERT TO authenticated
WITH CHECK ((select auth.uid()) = author_id);
```

### Authenticated and Unauthenticated Roles

- `anon`: unauthenticated requests
- `authenticated`: authenticated requests

**Correct policy order:**
```sql
create policy "Public profiles viewable by authenticated"
on profiles
for select
to authenticated
using (true);
```

### Multiple Operations

Create separate policies per operation:
```sql
create policy "Profiles created by any user"
on profiles
for insert
to authenticated
with check (true);

create policy "Profiles deleted by any user"
on profiles
for delete
to authenticated
using (true);
```

### Helper Functions

**auth.uid():** Returns authenticated user's ID

**auth.jwt():** Returns user's JWT; access metadata via JSON operators
```sql
create policy "User in team"
on my_table
to authenticated
using (team_id in (select auth.jwt() -> 'app_metadata' -> 'teams'));
```

**MFA:** Restrict updates to Assurance Level 2
```sql
create policy "Restrict updates"
on profiles
as restrictive
for update
to authenticated using (
  (select auth.jwt() ->> 'aal') = 'aal2'
);
```

### RLS Performance Recommendations

**Add Indexes:**
```sql
create index userid on test_table using btree (user_id);
```

**Call functions with select:**
```sql
create policy "Users access own records"
on test_table
to authenticated
using ((select auth.uid()) = user_id);
```

Wrapping functions in `select` allows Postgres to cache results per statement.

**Minimize Joins:**
Instead of joining source to target, select filter criteria into a set:
```sql
create policy "Users access team records"
on test_table
to authenticated
using (
  team_id in (
    select team_id
    from team_user
    where user_id = (select auth.uid())
  )
);
```

**Specify Roles:**
Always include `TO role` clause to prevent policies executing for unintended users.

## Summary

This comprehensive skill covers:
1. Edge Functions (TypeScript/Deno)
2. Declarative Schema Management
3. SQL Style Guidelines
4. Database Migrations
5. Database Functions (SECURITY INVOKER)
6. RLS Policies (auth.uid/auth.jwt)

Apply these standards across all Supabase development.
