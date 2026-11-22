'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/student';
  const error = searchParams.get('error');
  const [loading, setLoading] = useState(false);
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 px-4">
      <section className="w-full max-w-md text-center rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg p-8">
        <Link href="/" className="inline-block text-3xl font-bold text-gradient mb-6">📚 EduLearn</Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Welcome Back</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Continue learning with your Google account</p>
        {error && <p role="alert" className="text-red-600 bg-red-50 rounded-lg p-3 mb-5">{error === 'AccessDenied' ? 'Access denied. Please contact an administrator.' : 'Sign-in failed. Please retry.'}</p>}
        <button
          className="btn-primary w-full justify-center py-3"
          onClick={() => { setLoading(true); signIn('google', { callbackUrl }); }}
          disabled={loading}
        >{loading ? 'Connecting...' : 'Continue with Google'}</button>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">Videos require access to their Google Drive files.</p>
      </section>
    </main>
  );
}


export default function SignInPage() {
  return <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading...</div>}><SignInContent /></Suspense>;
}
