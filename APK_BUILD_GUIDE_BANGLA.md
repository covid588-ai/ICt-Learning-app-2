# My Learning App — APK বানানোর নিয়ম (Android Studio ছাড়া)

এই ZIP-এ দুটি জিনিস আছে: (১) আপনার মূল Next.js / PostgreSQL / Google Drive EduLearn Web App-এর সোর্স, (২) Google login-সমর্থিত Android launcher-এর সোর্স এবং GitHub Actions APK builder।

## গুরুত্বপূর্ণ
- এই ZIP **APK নয়**। এতে Android সোর্স কোড আছে, যা GitHub Actions দিয়ে APK বানানো যাবে।
- মূল Next.js অ্যাপ **server-side**। APK-এর ভেতরে চালানো যায় না। প্রথমে অ্যাপটি HTTPS ডোমেইনে হোস্ট করতে হবে।
- Google OAuth Google WebView-এর ভেতরে বাধা দেয়; তাই Android launcher Chrome Custom Tab / browser ব্যবহার করে। Login browser session-এ থাকবে।
- Original source-এ Admin/Student routes, Google login/Prisma adapter mismatch, next-themes dependency, PWA JS syntax ও icons সংশোধন করা হয়েছে। Full Next.js runtime build এখানে পরীক্ষা করা সম্ভব হয়নি।

## ধাপ ১ — GitHub-এ কোড আপলোড
1. GitHub-এ একটি নতুন private repository তৈরি করুন (উদাহরণ: `my-learning-app`)।
2. এই ZIP Extract/Unzip করুন।
3. Extract করা **সব ফাইল ও ফোল্ডার**, বিশেষ করে `.github` এবং `android` সহ, repository-তে upload/commit করুন। শুধু ZIP ফাইল আপলোড করলেই workflow কাজ করবে না।
   - কম্পিউটারে Git থাকলে: `git init` → `git add .` → `git commit -m "My Learning"` → GitHub-এ push।
   - Android থেকে GitHub-এর web Upload Files অথবা Git client দিয়ে folder-সহ upload করুন।
4. GitHub repository → **Actions** → **Build My Learning APK** → **Run workflow**।
5. শেষ হলে সফল run → **Artifacts** → `My-Learning-Android-APK` ডাউনলোড করুন। Artifacts ZIP-এর ভিতরে `app-debug.apk` থাকবে। সেটি Android ফোনে install করুন।

## ধাপ ২ — ওয়েব অ্যাপ Deploy
1. PostgreSQL database তৈরি করুন (যেমন Neon)।
2. Google Cloud Console-এ OAuth Web Client তৈরি করুন এবং Google Drive API চালু করুন।
3. Vercel/Railway/Render-এ Next.js repo deploy করুন; প্রয়োজনীয় `.env.example` অনুযায়ী secret variables সেট করুন।
4. `DATABASE_URL`, `NEXTAUTH_URL` (আপনার HTTPS ডোমেইন), `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `INITIAL_ADMIN_EMAIL` সেট করতে হবে।
5. Server-side database setup `npx prisma db push` এবং `npx prisma db seed` চালাতে হবে।
6. Google OAuth redirect URL: `https://YOUR-DOMAIN/api/auth/callback/google`।
7. সফল deploy হলে Android অ্যাপ খুলে HTTPS URL দিন।

### সীমাবদ্ধতা
- এখানে বাহ্যিক npm packages, Android SDK, Gradle ও database না থাকায় APK ফাইল সরাসরি compile করা যায়নি।
- Build workflow লেখা আছে, কিন্তু GitHub Actions-এ আসল build পরীক্ষা করা হয়নি।
- Google Drive ভিডিও দেখার জন্য Google OAuth অনুমতি এবং Drive file access অবশ্যই প্রয়োজন।
- Production release করার আগে security review, testing এবং Play Store-এর জন্য release signing লাগবে। এই workflow কেবল installable **debug APK** তৈরি করবে।
- এই app launcher native offline video app নয়; video streaming-এর জন্য internet ও server প্রয়োজন।
