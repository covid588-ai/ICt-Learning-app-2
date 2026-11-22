// Auth Error Page
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, { title: string; description: string }> = {
    Configuration: {
      title: 'Configuration Error',
      description: 'There is a problem with the server configuration. Please contact support.',
    },
    AccessDenied: {
      title: 'Access Denied',
      description: 'You do not have permission to access this application. Please contact the administrator.',
    },
    Verification: {
      title: 'Verification Failed',
      description: 'The verification link may have expired or already been used. Please try signing in again.',
    },
    OAuthSignin: {
      title: 'Sign In Failed',
      description: 'There was an error with the OAuth provider. Please try again or use a different sign-in method.',
    },
    OAuthCallback: {
      title: 'Callback Error',
      description: 'The OAuth callback failed. Please try signing in again.',
    },
    OAuthCreateAccount: {
      title: 'Account Creation Failed',
      description: 'Could not create your account. Please try again or contact support.',
    },
    EmailCreateAccount: {
      title: 'Account Creation Failed',
      description: 'Could not create your account with email. Please try again.',
    },
    Callback: {
      title: 'Callback Error',
      description: 'The authentication callback failed. Please try signing in again.',
    },
    OAuthAccountNotLinked: {
      title: 'Account Not Linked',
      description: 'This email is already associated with another account. Please sign in with that method.',
    },
    EmailSignin: {
      title: 'Email Sign In Failed',
      description: 'There was an error sending the sign-in email. Please try again.',
    },
    CredentialsSignin: {
      title: 'Invalid Credentials',
      description: 'The email or password you entered is incorrect. Please try again.',
    },
    SessionRequired: {
      title: 'Session Required',
      description: 'Please sign in to access this page.',
    },
    Default: {
      title: 'Authentication Error',
      description: 'An unexpected error occurred. Please try again or contact support.',
    },
  };

  const { title, description } = errorMessages[error || 'Default'] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-3xl font-bold text-gradient mb-10">
          <span className="text-4xl">📚</span>
          <span>EduLearn</span>
        </Link>

        <div className="card p-8 animate-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{description}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/signin" className="btn-primary">
              Try Again
            </Link>
            <Link href="/" className="btn-outline">
              Go Home
            </Link>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading...</div>}><AuthErrorContent /></Suspense>;
}
