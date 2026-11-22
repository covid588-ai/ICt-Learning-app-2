import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma';
import { UserRole, UserStatus } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  // JWT sessions avoid a mismatched Prisma adapter (this schema has no Account model).
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: ['openid', 'email', 'profile', process.env.GOOGLE_DRIVE_SCOPE || 'https://www.googleapis.com/auth/drive.readonly'].join(' '),
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google' || !user.email) return false;
      const found = await prisma.user.findUnique({ where: { email: user.email } });
      // Do not silently reactivate disabled students.
      if (found && found.status !== UserStatus.ACTIVE) return false;
      const tokenFields = {
        googleId: account.providerAccountId,
        ...(account.access_token ? { accessToken: account.access_token } : {}),
        ...(account.refresh_token ? { refreshToken: account.refresh_token } : {}),
        ...(account.expires_at ? { tokenExpiry: new Date(account.expires_at * 1000) } : {}),
      };
      if (found) {
        await prisma.user.update({
          where: { id: found.id },
          data: { ...tokenFields, avatar: user.image, name: user.name },
        });
      } else {
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            avatar: user.image,
            ...tokenFields,
            // A new Google user only becomes admin when its verified email matches
            // the administrator address configured on the server.
            role: user.email.toLowerCase() === (process.env.INITIAL_ADMIN_EMAIL || '').toLowerCase()
              ? UserRole.ADMIN : UserRole.STUDENT,
            status: UserStatus.ACTIVE,
          },
        });
      }
      return true;
    },
    async jwt({ token, user, account }) {
      const email = user?.email || token.email;
      if (email) {
        const stored = await prisma.user.findUnique({
          where: { email }, select: { id: true, role: true, status: true },
        });
        if (stored && stored.status === UserStatus.ACTIVE) {
          token.id = stored.id;
          token.role = stored.role;
        } else {
          token.id = undefined;
          token.role = undefined;
        }
      }
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : 0;
      }
      if (token.refreshToken && token.accessTokenExpires &&
          Date.now() > Number(token.accessTokenExpires) - 60_000) {
        return refreshAccessToken(token);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session as any).accessToken = token.accessToken;
        (session as any).refreshToken = token.refreshToken;
        (session as any).accessTokenExpires = token.accessTokenExpires;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: { signIn: '/auth/signin', error: '/auth/error' },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function refreshAccessToken(token: any) {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + data.expires_in * 1000,
      refreshToken: data.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error('Token refresh failed:', error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

export function isAdmin(role: UserRole): boolean { return role === UserRole.ADMIN; }
export function isStudent(role: UserRole): boolean { return role === UserRole.STUDENT; }
export async function getUserRole(userId: string): Promise<UserRole | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId }, select: { role: true, status: true },
  });
  if (!user || user.status !== UserStatus.ACTIVE) return null;
  return user.role;
}
export async function requireAuth(session: any, requiredRole?: UserRole) {
  if (!session?.user?.id) throw new Error('UNAUTHENTICATED');
  if (requiredRole && session.user.role !== requiredRole) throw new Error('FORBIDDEN');
  return session.user;
}
