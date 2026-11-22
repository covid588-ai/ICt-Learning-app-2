# EduLearn - Educational Learning Platform

A complete, production-ready educational learning application with private Google Drive video integration, PDF viewer, hierarchical content management, student authentication, and admin dashboard.

## ✨ Features

### 🎓 For Students
- **Hierarchical Learning**: Subject → Chapter → Topic → Videos/PDFs
- **Private Video Playback**: Secure Google Drive streaming with permission checks
- **Built-in PDF Viewer**: Read PDF notes with zoom, navigation, fullscreen
- **Progress Tracking**: Resume playback, mark complete, chapter/subject progress
- **Bookmarks**: Save lectures for quick access
- **Global Search**: ⌘K / Ctrl+K to search everything instantly
- **Bengali Support**: Full Unicode rendering for Bangla content
- **Dark Mode**: System-aware with manual toggle
- **PWA Ready**: Install on mobile, works offline

### 👨‍🏫 For Administrators
- **Content Management**: Full CRUD for Subjects, Chapters, Topics, Videos, PDFs
- **Google Drive Integration**: Paste Drive links, auto-extract File IDs
- **Student Management**: View, enable/disable, track progress
- **Dashboard Analytics**: Real-time stats on content and users
- **Audit Logs**: Track all admin actions

### 🔒 Security & Privacy
- **Google OAuth 2.0**: Secure authentication with minimal scopes
- **Per-User Drive Access**: Students only access files they have permission for
- **Server-Side Streaming**: No public URLs, no token exposure
- **Role-Based Access**: Admin/Student with protected routes
- **No Content Lock-in**: Videos stay on your Google Drive

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3 |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | NextAuth.js (Google OAuth) |
| **Video** | Secure server-side streaming |
| **PDF** | PDF.js via iframe embedding |
| **State** | React hooks + SWR |
| **PWA** | Service Worker + Manifest |

---

## 📁 Project Structure

```
edulearn-app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Seed script with 13 real videos
├── public/
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                 # Service worker
│   └── icons/                # PWA icons
├── src/
│   ├── app/
│   │   ├── (student)/        # Student pages (layout + pages)
│   │   │   ├── page.tsx      # Dashboard
│   │   │   ├── subjects/     # Subject/Chapter/Topic pages
│   │   │   ├── play/         # Video/PDF player
│   │   │   ├── bookmarks/    # Bookmarks page
│   │   │   └── profile/      # Profile page
│   │   ├── (admin)/          # Admin pages
│   │   │   ├── page.tsx      # Admin dashboard
│   │   │   ├── subjects/     # Subject management
│   │   │   ├── videos/       # Video management
│   │   │   ├── pdfs/         # PDF management
│   │   │   └── students/     # Student management
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # NextAuth endpoints
│   │   │   ├── videos/       # Video streaming
│   │   │   ├── pdfs/         # PDF streaming
│   │   │   ├── progress/     # Progress tracking
│   │   │   ├── bookmarks/    # Bookmarks CRUD
│   │   │   ├── search/       # Global search
│   │   │   ├── subjects/     # Subject CRUD
│   │   │   ├── chapters/     # Chapter CRUD
│   │   │   ├── topics/       # Topic CRUD
│   │   │   ├── materials/    # Video/PDF CRUD
│   │   │   └── users/        # User management
│   │   ├── auth/             # Auth pages
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Landing page
│   │   └── providers.tsx     # Context providers
│   ├── components/
│   │   ├── search/           # Search modal
│   │   ├── ui/               # Reusable UI components
│   │   ├── video/            # Video player components
│   │   └── pdf/              # PDF viewer components
│   ├── hooks/
│   │   └── useSearch.ts      # Global search hook
│   ├── lib/
│   │   ├── auth.ts           # NextAuth config
│   │   ├── prisma.ts         # Prisma client
│   │   ├── drive.ts          # Google Drive service
│   │   └── utils.ts          # Utility functions
│   └── types/
│       └── index.ts          # TypeScript types
├── .env.example              # Environment template
├── next.config.js            # Next.js config
├── tailwind.config.ts        # Tailwind config
├── tsconfig.json             # TypeScript config
├── DEPLOYMENT.md             # Deployment guide
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Google Cloud Project

### Installation

```bash
# 1. Clone repository
cd edulearn-app

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 4. Set up database
npx prisma generate
npx prisma db push
npx prisma db seed

# 5. Start development server
npm run dev
```

Open http://localhost:3000

---

## 📚 Included Content: ICT Python Programming

The seed script automatically creates:

**Subject**: ICT
**Chapter**: Python Programming (12 topics, 13 videos)

| Topic | Title (Bangla) | Videos |
|-------|---------------|--------|
| 1 | প্রোগ্রামিং, কম্পাইলার, ইন্টারপ্রেটার | 1 |
| 2 | চলকের ধারণা | 1 |
| 3 | পাইথন সফটওয়্যার ইন্সটলেশন | 1 |
| 4 | চলকের নামকরণ | 1 |
| 5 | চলকে মান এসাইন | 1 |
| 6 | ডাটা টাইপ | 1 |
| 7 | টাইপকাস্টিং | 1 |
| 8 | ইনপুট | 2 (ইনপুট-১, ইনপুট-২) |
| 9 | অপারেটর | 1 |
| 10 | তুলনা | 1 |
| 11 | if statement | 1 |
| 12 | if-else statement | 1 |

All 13 Google Drive links are pre-configured in the seed script.

---

## 🔐 Google Drive Integration

### How It Works

1. **Admin adds video** → Pastes Google Drive link
2. **System extracts** → File ID from URL automatically
3. **Student plays** → Server checks user's Drive permission
4. **Stream delivered** → If authorized, video streams via backend
5. **Access denied** → If no permission, shows clear error message

### Required Google OAuth Scopes

```
https://www.googleapis.com/auth/drive.readonly
```

**Why `drive.readonly`?**
- Reads all files user has access to
- Required for private/restricted files
- Needs Google verification for production (sensitive scope)

**Alternative: `drive.file`**
- Only accesses files created/opened by app
- Requires Google Picker UI
- No verification needed

### Supported Drive URL Formats

```
https://drive.google.com/file/d/FILE_ID/view
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
https://drive.google.com/file/d/FILE_ID/view?usp=drivesdk
https://docs.google.com/.../id=FILE_ID
```

---

## 🎬 Video Player Features

- Play/Pause/Seek
- Volume/Mute
- Fullscreen
- Playback speed (0.25x - 2x)
- Keyboard shortcuts (Space, Arrows, M, F, >, <)
- Progress tracking (auto-save every 5s)
- Resume from last position
- Auto-play next lecture
- Loading states & error handling

---

## 📕 PDF Viewer Features

- Page navigation (Next/Previous)
- Zoom in/out/reset
- Page counter (current/total)
- Fullscreen mode
- Rotation
- Secure streaming (same auth as video)
- Works with private Drive PDFs

---

## 🌐 Internationalization

- **Primary**: Bengali (Bangla) - বাংলা
- **Secondary**: English
- **Font**: Noto Sans Bengali + Inter
- **RTL**: Not required (Bengali is LTR)

---

## 📱 PWA Features

- **Installable**: Add to home screen on Android/iOS
- **Offline**: Service worker caches static assets
- **Shortcuts**: Continue Learning, Subjects, Bookmarks
- **Manifest**: Complete with icons, screenshots, categories

---

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to DB
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database

# Build
npm run build            # Production build
npm run start            # Start production server
```

---

## 📦 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions including:

- Google Cloud Console setup
- Environment variables
- Database hosting options
- Vercel/Docker/Railway deployment
- Android APK conversion with Capacitor
- Security checklist
- CI/CD pipeline

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Prisma** for type-safe database access
- **Tailwind CSS** for utility-first styling
- **Google Drive API** for content hosting
- **PDF.js** for PDF rendering
- All open-source contributors

---

## 📞 Support

For issues and questions:
- Open a GitHub issue
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for common problems
- Review Google Drive API quotas and OAuth configuration

---

**Built with ❤️ for learners everywhere**