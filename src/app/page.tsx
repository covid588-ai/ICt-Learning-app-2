// Landing Page - Public Homepage
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  // Redirect authenticated users to their dashboard
  if (session?.user) {
    const role = (session.user as any).role;
    redirect(role === 'ADMIN' ? '/admin' : '/student');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <nav className="container-main flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gradient">
            <span className="text-2xl">📚</span>
            <span>EduLearn</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
              Features
            </Link>
            <Link href="#subjects" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
              Subjects
            </Link>
            <Link href="#about" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
              About
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="btn-ghost hidden sm:block">
              Sign In
            </Link>
            <Link href="/auth/signin" className="btn-primary">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20">
        <section className="container-main py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-sm font-medium mb-8 animate-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              New: ICT Python Programming Course - 13 Video Lectures
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 animate-in stagger-1">
              শিখুন, <span className="text-gradient">অগ্রসর হন</span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto animate-in stagger-2">
              Complete educational learning platform with private Google Drive video lectures,
              PDF notes, progress tracking, and personalized learning paths.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in stagger-3">
              <Link href="/auth/signin" className="btn-primary btn-lg w-full sm:w-auto">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Start Learning Free
              </Link>
              <Link href="#subjects" className="btn-outline btn-lg w-full sm:w-auto">
                Explore Subjects
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-500 dark:text-gray-400 text-sm animate-in stagger-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Private & Secure
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Bengali Support
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Progress Tracking
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Mobile & PWA Ready
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container-main py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to <span className="text-gradient">Learn Effectively</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built for modern learners with powerful features for both students and educators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </section>

        {/* Subjects Preview */}
        <section id="subjects" className="container-main py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Available <span className="text-gradient">Subjects</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our growing library of courses across multiple disciplines
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {subjectsPreview.map((subject, index) => (
              <SubjectPreviewCard key={subject.title} subject={subject} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/auth/signin" className="btn-primary btn-lg">
              View All Subjects
            </Link>
          </div>
        </section>

        {/* ICT Python Programming Highlight */}
        <section className="container-main py-20">
          <div className="card-hover bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-700 p-8 md:p-12 rounded-3xl text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" />
            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                New Course Available
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                ICT: Python Programming
              </h3>
              <p className="text-lg text-white/90 mb-8 max-w-xl">
                12 topics, 13 video lectures covering programming fundamentals,
                variables, data types, operators, conditionals, and more - all in Bengali!
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-white/80 mb-8">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  13 Video Lectures
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  12 Topics
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Bengali Language
                </div>
              </div>
              <Link href="/auth/signin" className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Start Learning Now
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="container-main py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose <span className="text-gradient">EduLearn?</span>
              </h2>
              <div className="space-y-6">
                {aboutPoints.map((point, index) => (
                  <AboutPoint key={point.title} point={point} index={index} />
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-3xl flex items-center justify-center">
                <div className="text-center p-8">
                  <svg className="w-32 h-32 mx-auto text-primary-300 dark:text-primary-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
                    Platform Preview
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Sign in to experience the full platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container-main py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Start Your <span className="text-gradient">Learning Journey?</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of learners. Free to start, no credit card required.
            </p>
            <Link href="/auth/signin" className="btn-primary btn-lg px-10">
              Get Started Free
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container-main py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gradient mb-4">
                <span className="text-2xl">📚</span>
                <span>EduLearn</span>
              </Link>
              <p className="text-gray-600 dark:text-gray-300 max-w-sm mb-6">
                Complete educational learning platform with private Google Drive video lectures,
                PDF notes, progress tracking, and personalized learning paths.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.095 4.067 6.13 1.64 3.162c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.06c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.687 1.319-3.809 2.105-6.102 2.105-.39 0-.776-.023-1.157-.067 2.18 1.394 4.762 2.212 7.555 2.212 9.054 0 13.998-7.495 13.998-13.986 0-.213-.005-.425-.014-.635.961-.689 1.797-1.552 2.457-2.546z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a></li>
                <li><a href="#subjects" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Subjects</a></li>
                <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Changelog</a></li>
                <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li><a href="#about" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Press</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} EduLearn. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Made with ❤️ for learners everywhere</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature data
const features = [
  {
    icon: '🎬',
    title: 'Private Video Lectures',
    description: 'Watch Google Drive videos securely inside the app. No public links exposed. Permission-based access control.',
  },
  {
    icon: '📕',
    title: 'Built-in PDF Viewer',
    description: 'Read PDF notes directly in the browser with zoom, navigation, and fullscreen support. Works with private Drive files.',
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    description: 'Track learning progress per lecture, chapter, and subject. Resume from where you left off automatically.',
  },
  {
    icon: '🔖',
    title: 'Bookmarks & Notes',
    description: 'Bookmark important lectures and add personal notes. Access them instantly from your dashboard.',
  },
  {
    icon: '🌙',
    title: 'Dark Mode & Bengali',
    description: 'Full dark mode support with Bengali (Bangla) language interface and proper Unicode rendering.',
  },
  {
    icon: '📱',
    title: 'PWA & Mobile First',
    description: 'Install as an app on Android/iOS. Works offline with service worker caching. Responsive on all devices.',
  },
];

const subjectsPreview = [
  { title: 'ICT', icon: '💻', color: 'bg-primary-500', topics: '12 Topics', videos: '13 Videos', published: true },
  { title: 'Physics', icon: '⚛️', color: 'bg-red-500', topics: 'Coming Soon', videos: '—', published: false },
  { title: 'Chemistry', icon: '🧪', color: 'bg-orange-500', topics: 'Coming Soon', videos: '—', published: false },
  { title: 'Biology', icon: '🧬', color: 'bg-green-500', topics: 'Coming Soon', videos: '—', published: false },
  { title: 'Mathematics', icon: '📐', color: 'bg-blue-500', topics: 'Coming Soon', videos: '—', published: false },
];

const aboutPoints = [
  {
    title: 'Private & Secure',
    description: 'Your Google Drive files stay private. We use OAuth 2.0 with minimal scopes. Students only access files they have permission for.',
  },
  {
    title: 'No Content Lock-in',
    description: 'Videos and PDFs remain on your Google Drive. You control the content, permissions, and storage. No vendor lock-in.',
  },
  {
    title: 'Mobile-First Design',
    description: 'Built from the ground up for mobile devices. Touch-friendly controls, bottom navigation, and PWA installation support.',
  },
  {
    title: 'Extensible Architecture',
    description: 'Admin dashboard lets you add unlimited subjects, chapters, topics, videos, and PDFs without touching code.',
  },
];

// Feature Card Component
function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  return (
    <div className="card-hover p-6 text-center animate-in" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="text-4xl mb-4">{feature.icon}</div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
    </div>
  );
}

// Subject Preview Card
function SubjectPreviewCard({ subject, index }: { subject: typeof subjectsPreview[0]; index: number }) {
  return (
    <Link href="/auth/signin" className="card-hover p-6 text-center group animate-in" style={{ animationDelay: `${index * 100}ms` }}>
      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl ${subject.color} group-hover:scale-110 transition-transform duration-300`}>
        {subject.icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{subject.title}</h3>
      <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
        <span>{subject.topics}</span>
        <span>•</span>
        <span>{subject.videos}</span>
      </div>
      {subject.published ? (
        <span className="badge-success">Available Now</span>
      ) : (
        <span className="badge-outline">Coming Soon</span>
      )}
    </Link>
  );
}

// About Point Component
function AboutPoint({ point, index }: { point: typeof aboutPoints[0]; index: number }) {
  return (
    <div className="flex gap-4 animate-in" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 text-primary-600 dark:text-primary-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{point.title}</h4>
        <p className="text-gray-600 dark:text-gray-300">{point.description}</p>
      </div>
    </div>
  );
}