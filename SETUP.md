# Setup Instructions

## 1. Create D1 Database
```bash
npx wrangler d1 create fhp-db
```
Copy the database_id from output and update wrangler.json

## 2. Initialize Database Schema
```bash
npx wrangler d1 execute fhp-db --local --file=./schema.sql
npx wrangler d1 execute fhp-db --remote --file=./schema.sql
```

## 3. Create R2 Bucket
```bash
npx wrangler r2 bucket create fhp-media
```

## 4. Access Admin
Navigate to `/admin` in your browser (add a button or direct URL access)

## Admin Features
- Videos: Upload videos with thumbnails
- Stills: Upload images
- Announcements: Rich text posts with embedded images
- About: Edit about page content
