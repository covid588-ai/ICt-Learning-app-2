# EduLearn Deployment Guide

Complete deployment instructions for the EduLearn educational platform.

## 🚀 Quick Start (Development)

```bash
# 1. Clone and install
cd edulearn-app
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your credentials

# 3. Set up database
npx prisma generate
npx prisma db push
npx prisma db seed

# 4. Run development server
npm run dev
```

Open http://localhost:3000

---

## 🔐 Google Cloud Console Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable APIs:
   - **Google Drive API**
   - **Google Picker API** (optional, for file picker)

### 2. Configure OAuth Consent Screen

1. Navigate to **APIs & Services → OAuth consent screen**
2. Choose **External** user type
3. Fill required fields:
   - App name: `EduLearn`
   - User support email: your email
   - Developer contact: your email
4. **Scopes** (add these):
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `https://www.googleapis.com/auth/drive.readonly`
5. **Test users**: Add your email and test student emails
6. Save and publish (or keep in testing mode)

### 3. Create OAuth 2.0 Credentials

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Name: `EduLearn Web Client`
5. **Authorized JavaScript origins**:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
6. **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Save → Copy **Client ID** and **Client Secret**

### 4. Create API Key (for Drive API)

1. **Create Credentials → API key**
2. Restrict key:
   - Application restrictions: HTTP referrers
   - Add your domains
   - API restrictions: Google Drive API, Google Picker API
2. Copy the **API Key**

---

## 🗄️ Database Setup

### PostgreSQL Options

#### Local Development
```bash
# Using Docker
docker run --name postgres-edulearn \
  -e POSTGRES_USER=edulearn \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=edulearn \
  -p 5432:5432 \
  -d postgres:15
```

#### Production Options
- **Vercel Postgres** (recommended for Vercel)
- **Neon** (serverless Postgres)
- **Supabase** (Postgres + auth)
- **Railway** / **Render** / **PlanetScale**
- **AWS RDS** / **Google Cloud SQL**

---

## ⚙️ Environment Variables

Create `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/edulearn?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Google Drive
GOOGLE_DRIVE_SCOPE="https://www.googleapis.com/auth/drive.readonly"
GOOGLE_DRIVE_API_KEY="your-drive-api-key"
GOOGLE_PICKER_API_KEY="your-picker-api-key"
GOOGLE_PICKER_APP_ID="your-project-number"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="EduLearn"
NEXT_PUBLIC_DEFAULT_LANGUAGE="bn"

# First Admin
INITIAL_ADMIN_EMAIL="admin@yourdomain.com"
```

### Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

---

## 🎬 Testing Private Google Drive Videos

### Setup Test Accounts

1. **Admin Account** (uploads content):
   - Upload videos to Google Drive
   - Share with specific student emails (Restricted access)
   - Get File IDs from share links

2. **Student Account A** (has access):
   - Added to Drive file permissions
   - Should see and play videos

3. **Student Account B** (no access):
   - NOT added to Drive permissions
   - Should see "Access denied" message

### Test Procedure

1. Sign in as Admin → Add video via Admin Dashboard
2. Sign in as Student A → Navigate to video → Should play
3. Sign in as Student B → Navigate to video → Should show error

### Common Issues

| Issue | Solution |
|-------|----------|
| 403 Forbidden | Student not added to Drive file permissions |
| 401 Unauthorized | OAuth token expired, re-sign in |
| Video won't play | File format not supported by browser (use MP4/WebM) |
| CORS errors | Check API route headers, ensure credentials: 'include' |

---

## 📦 Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Connect PostgreSQL (Vercel Postgres or external)
```

**Vercel Settings:**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Option 2: Docker

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t edulearn .
docker run -p 3000:3000 --env-file .env edulearn
```

### Option 3: Railway / Render

1. Connect GitHub repo
2. Add environment variables
3. Add PostgreSQL database
4. Deploy

---

## 📱 PWA & Mobile Installation

### Install as Android App

1. Build: `npm run build && npm run start`
2. Open in Chrome Android
3. Menu → **Install app** / **Add to Home screen**
4. App installs as standalone PWA

### Convert to APK (Capacitor)

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init edulearn com.edulearn.app

# Add Android
npm install @capacitor/android
npx cap add android

# Build and sync
npm run build
npx cap sync android
npx cap open android
```

In Android Studio:
1. Build → **Build Bundle(s) / APK(s) → Build APK(s)**
2. Find APK at `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🔒 Security Checklist

- [ ] Use strong `NEXTAUTH_SECRET` (32+ chars)
- [ ] Restrict Google OAuth to your domains
- [ ] Use `drive.readonly` scope (not `drive` or `drive.file`)
- [ ] Enable HTTPS in production
- [ ] Set secure cookies: `NEXTAUTH_URL` uses https://
- [ ] Restrict API keys to your domains
- [ ] Regular database backups
- [ ] Monitor audit logs for suspicious activity
- [ ] Rate limiting on auth endpoints
- [ ] Content Security Policy headers

---

## 📊 Monitoring & Maintenance

### Database Migrations
```bash
# Development
npx prisma migrate dev --name migration_name

# Production
npx prisma migrate deploy
```

### Health Checks
- `/api/health` - Basic health check
- Monitor: Database connections, API response times, Error rates

### Backup Strategy
- Daily automated PostgreSQL backups
- Test restore monthly
- Export audit logs weekly

---

## 🔄 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx prisma generate
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        if: github.ref == 'refs/heads/main'
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📞 Support

For deployment issues:
1. Check logs: `vercel logs` or Docker logs
2. Verify environment variables
3. Test database connectivity
4. Verify Google OAuth configuration
5. Check Google Drive API quotas

---

## 📝 License

MIT License - See LICENSE file for details.