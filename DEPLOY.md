# Deployment Guide

## Quick Deploy
```bash
./deploy.sh
```

## Manual Steps

### 1. Create D1 Database
```bash
npx wrangler d1 create fhp-db
```
Copy the `database_id` and update `wrangler.json`:
```json 
"database_id": "YOUR-DATABASE-ID-HERE"  
```

### 2. Initialize Database
```bash
npx wrangler d1 execute fhp-db --local --file=./schema.sql
npx wrangler d1 execute fhp-db --remote --file=./schema.sql
```

### 3. Create R2 Bucket
```bash
npx wrangler r2 bucket create fhp-media
```

### 4. Set Secrets
```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
```
Generate SESSION_SECRET with:
```bash
openssl rand -hex 32
```

### 5. Build and Deploy
```bash
npm run build
npm run deploy
```

## Update Secrets Later
```bash
echo "new-password" | npx wrangler secret put ADMIN_PASSWORD
```

## View Logs
```bash
npx wrangler tail
```

## Local Development
```bash
npm run dev
```
