# Flaming Heart Productions TV (fhp)

A modern web application built with **Vanilla JavaScript** (SPA), **Hono**, and **Cloudflare Workers**.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/vite-react-template)

## 🚀 Tech Stack

- **Frontend:** Vanilla JavaScript (SPA), Vite
- **Backend:** Hono (running on Cloudflare Workers)
- **Database:** Cloudflare D1
- **Storage:** Cloudflare R2
- **Animations:** GSAP
- **Rich Text Editor:** Quill

## 🛠️ Prerequisites

- **Node.js** (Latest LTS recommended)
- **Wrangler** (Cloudflare Workers CLI)

## ⚙️ Setup & Configuration

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Cloudflare Resources

This project relies on Cloudflare D1 for the database and R2 for media storage.

**Create D1 Database:**

```bash
npx wrangler d1 create fhp-db
```

Update `wrangler.json` with the `database_id` output from the command above:

```json
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "fhp-db",
    "database_id": "YOUR-DATABASE-ID-HERE"
  }
]
```

**Initialize Database Schema:**

```bash
# Local development
npx wrangler d1 execute fhp-db --local --file=./schema.sql

# Production
npx wrangler d1 execute fhp-db --remote --file=./schema.sql
```

**Create R2 Bucket:**

```bash
npx wrangler r2 bucket create fhp-media
```

Ensure `wrangler.json` has the correct binding:

```json
"r2_buckets": [
  {
    "binding": "MEDIA_BUCKET",
    "bucket_name": "fhp-media"
  }
]
```

### 3. Set Secrets

You need to set the following secrets for authentication:

```bash
# Local development (if needed, usually handled via .dev.vars)
# npx wrangler dev --test-scheduled

# Production
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
```

Generate a secure `SESSION_SECRET`:
```bash
openssl rand -hex 32
```

## 💻 Development

Start the local development server:

```bash
npm run dev
```

This will start Vite and the Hono backend. The application should be available at `http://localhost:5173`.

## 📦 Deployment

Build the application for production:

```bash
npm run build
```

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

Or use the provided convenience script:

```bash
./deploy.sh
```

## 🔐 Admin Features

Navigate to `/admin` to access the content management system. Features include:

- **Videos:** Upload videos with custom thumbnails.
- **Stills:** Upload and manage image galleries.
- **Announcements:** Create rich text posts with embedded images.
- **About:** Edit the content of the About page.

## 📄 Logs

Monitor your deployed worker logs:

```bash
npx wrangler tail
```
