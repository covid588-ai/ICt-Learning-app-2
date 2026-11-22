// Access Denied Page
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AccessDeniedPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if user has become active
    const timer = setTimeout(() => {
      update();
      setChecking(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [update]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 px-4">
        <div className="w-full max-w-md text-center">
          <div className="card p-8 animate-in">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Checking Access...</h1>
            <p className="text-gray-600 dark:text-gray-400">Please wait while we verify your account status.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-3xl font-bold text-gradient mb-10">
          <span className="text-4xl">📚</span>
          <span>EduLearn</span>
        </Link>

        <div className="card p-8 animate-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Access Restricted</h1>

          {session?.user ? (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Hello <strong>{session.user.name || session.user.email}</strong>, your account has been disabled or is pending approval.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Please contact the administrator to request access to the platform.
              </p>
              <button
                onClick={handleSignOut}
                className="btn-outline w-full sm:w-auto"
              >
                Sign Out & Try Another Account
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You do not have permission to access this application.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Please sign in with an authorized account or contact the administrator for access.
              </p>
              <Link href="/auth/signin" className="btn-primary w-full sm:w-auto">
                Sign In with Different Account
              </Link>
            </>
          }

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If you believe this is an error, please contact:
            </p>
            <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mt-1">
              administrator@edulearn.app
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} EduLearn. All rights reserved.
        </p>
      </div>
    </div>
  );
}