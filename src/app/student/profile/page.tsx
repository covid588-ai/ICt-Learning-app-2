// Student Profile Page
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import StudentProfileClient from './StudentProfileClient';

export default async function StudentProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  if (role === 'ADMIN') {
    redirect('/admin');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true,
      googleId: true,
    },
  });

  // Get stats
  const [progressStats, bookmarkCount] = await Promise.all([
    prisma.learningProgress.groupBy({
      by: ['completed'],
      where: { userId },
      _count: { id: true },
    }),
    prisma.bookmark.count({ where: { userId } }),
  ]);

  const completedCount = progressStats.find(s => s.completed)?._count.id || 0;
  const totalProgressCount = progressStats.reduce((acc, s) => acc + s._count.id, 0);
  const inProgressCount = totalProgressCount - completedCount;

  // Get recent activity
  const recentProgress = await prisma.learningProgress.findMany({
    where: { userId },
    include: {
      material: {
        include: {
          topic: {
            include: {
              chapter: { include: { subject: true } },
            },
          },
        },
      },
    },
    orderBy: { lastWatched: 'desc' },
    take: 10,
  });

  const recentBookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      material: {
        include: {
          topic: {
            include: {
              chapter: { include: { subject: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <StudentProfileClient
      user={user!}
      stats={{
        completedCount,
        inProgressCount,
        totalProgressCount,
        bookmarkCount,
      }}
      recentProgress={recentProgress}
      recentBookmarks={recentBookmarks}
    />
  );
}