#!/bin/bash

echo "=== Flaming Heart Productions Deployment ==="
echo ""

echo "Step 1: Creating D1 Database..."
npx wrangler d1 create fhp-db

echo ""
echo "Copy the database_id from above and update wrangler.json"
echo "Press Enter when ready to continue..."
read

echo ""
echo "Step 2: Initializing Database Schema (local)..."
npx wrangler d1 execute fhp-db --local --file=./schema.sql

echo ""
echo "Step 3: Initializing Database Schema (remote)..."
npx wrangler d1 execute fhp-db --remote --file=./schema.sql

echo ""
echo "Step 4: Creating R2 Bucket..."
npx wrangler r2 bucket create fhp-media

echo ""
echo "Step 5: Setting Secrets..."
echo "Enter your admin password:"
read -s ADMIN_PASSWORD
echo $ADMIN_PASSWORD | npx wrangler secret put ADMIN_PASSWORD

echo ""
echo "Generating random session secret..."
SESSION_SECRET=$(openssl rand -hex 32)
echo $SESSION_SECRET | npx wrangler secret put SESSION_SECRET

echo ""
echo "Step 6: Building project..."
npm run build

echo ""
echo "Step 7: Deploying to Cloudflare Workers..."
npm run deploy

echo ""
echo "=== Deployment Complete! ==="
echo "Your site is now live at: https://fhp.YOUR-SUBDOMAIN.workers.dev"
echo ""
echo "IMPORTANT: Save these credentials:"
echo "Admin Password: [the password you entered]"
echo "Session Secret: $SESSION_SECRET"
