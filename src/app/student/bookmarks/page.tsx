// Bookmarks Page
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import BookmarksClient from './BookmarksClient';

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  if (role === 'ADMIN') {
    redirect('/admin');
  }

  const bookmarks = await prisma.bookmark.findMany({
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
  });

  // Get progress for bookmarked materials
  const materialIds = bookmarks.map(b => b.materialId);
  const progress = await prisma.learningProgress.findMany({
    where: {
      userId,
      materialId: { in: materialIds },
    },
    select: { materialId: true, completed: true, playbackPosition: true },
  });

  const progressMap = new Map(progress.map(p => [p.materialId, p]));

  const bookmarksWithProgress = bookmarks.map(b => ({
    ...b,
    material: {
      ...b.material,
      progress: progressMap.get(b.materialId) || null,
    },
  }));

  return <BookmarksClient bookmarks={bookmarksWithProgress} />;
}