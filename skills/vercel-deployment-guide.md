# Vercel Deployment Checklist & Best Practices

## 🚨 CRITICAL RULE: Always Check Build Logs First!

**Before finishing ANY task on a Vercel-deployed project:**
1. Ask user for build logs OR check deployment status
2. Look for errors and warnings
3. Fix ALL errors before marking work complete
4. User should NEVER have to tell you about build errors

## Common Build Errors & Fixes

### 1. Module Resolution Errors
```
Module not found: Can't resolve '@/lib/...'
```
**Fix:** Ensure file exists and is properly exported. Check tsconfig.json path mappings.

### 2. Missing Prisma Client
**Error:** `Cannot find module '@prisma/client'`
**Fix:** Create `/src/lib/prisma.ts`:
```typescript
import { PrismaClient } from '@prisma/client';
const globalForPrisma = globalThis as { prisma: PrismaClient | undefined };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 3. Next-Auth Import Issues
**Error:** `Cannot resolve 'next-auth'`
**Fix:** Use `'next-auth/next'` for server-side imports:
```typescript
import { getServerSession } from 'next-auth/next';
```

### 4. TypeScript Implicit Any Errors
**Error:** `Parameter 'x' implicitly has an 'any' type`
**Fix:** Add type annotations:
```typescript
.map((item: any) => ...)
.filter((x: any) => ...)
```

### 5. Next.js 15 Route Params
**Error:** Route params type mismatch
**Fix:** Wrap params in Promise:
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
}
```

### 6. Stripe API Version Mismatch
**Error:** `Type '"2024-x" is not assignable to type "2025-y"`
**Fix:** Update to latest version: `apiVersion: '2025-12-15.clover'`

### 7. Build Data Collection Failures
**Error:** `Failed to collect page data for /api/...`
**Fix:** Add to ALL API routes:
```typescript
export const dynamic = 'force-dynamic';
```

## Environment Variables Checklist

Required for Vercel deployment:
- [ ] `DATABASE_URL` - PostgreSQL connection
- [ ] `NEXTAUTH_URL` - Full domain URL
- [ ] `NEXTAUTH_SECRET` - Generate with openssl
- [ ] `TWITTER_CLIENT_ID` - OAuth app
- [ ] `TWITTER_CLIENT_SECRET` - OAuth secret
- [ ] `STRIPE_SECRET_KEY` - Payment processing
- [ ] `STRIPE_PUBLISHABLE_KEY` - Frontend Stripe
- [ ] `RESEND_API_KEY` - Email service
- [ ] `CRON_SECRET` - Secure cron endpoints

## Pre-Deployment Checklist

Before pushing to Vercel:
- [ ] Run `npm run build` locally
- [ ] Check for TypeScript errors: `npx tsc --noEmit`
- [ ] Verify all imports resolve
- [ ] Test API routes locally
- [ ] Ensure all env vars documented in `.env.example`
- [ ] Add `export const dynamic = 'force-dynamic'` to API routes
- [ ] Check prisma client is generated: `prisma generate`

## Vercel-Specific Configuration

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "installCommand": "PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npm install",
  "framework": "nextjs",
  "crons": [
    {
      "path": "/api/cron/process-queue",
      "schedule": "0 * * * *"
    }
  ],
  "functions": {
    "api/cron/**/*.ts": {
      "maxDuration": 300
    }
  }
}
```

### package.json
Ensure postinstall runs:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

## Quick Fix Commands

```bash
# Add prisma client singleton
echo "import { PrismaClient } from '@prisma/client';..." > src/lib/prisma.ts

# Fix next-auth imports
find src -name "*.ts" -exec sed -i "s/from 'next\/auth'/from 'next-auth'/g" {} \;

# Add dynamic export to all API routes
for f in src/app/api/**/route.ts; do
  sed -i "/export async function/i export const dynamic = 'force-dynamic';\n" "$f"
done

# Fix implicit any types (manual review needed)
grep -r "implicitly has an 'any' type" .next/

# Check build locally before pushing
npm run build 2>&1 | tee build.log
```

## Monitoring After Deployment

1. **Check Deployment Logs** - Vercel Dashboard → Deployments → Build Logs
2. **Monitor Function Logs** - Check for runtime errors
3. **Verify Cron Jobs** - Logs tab shows execution
4. **Test API Endpoints** - Use Vercel preview URL

## Remember

- Build errors caught locally = faster iteration
- Vercel build cache can mask issues - clear if needed
- Environment variables need to be set for all environments (Dev/Preview/Prod)
- Cron jobs need `CRON_SECRET` verification for security
- Cold starts can cause timeouts - use proper function duration limits

---

**Created:** 2026-01-19
**Last Updated:** 2026-01-19
**For:** FollowFuel Twitter Growth Platform
