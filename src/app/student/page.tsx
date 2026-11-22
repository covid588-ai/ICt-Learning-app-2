// Student Dashboard Home Page
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { formatRelativeTime } from '@/lib/utils';
import StudentDashboardClient from './StudentDashboardClient';

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  // Redirect admins to admin dashboard
  if (role === 'ADMIN') {
    redirect('/admin');
  }

  // Fetch student data
  const [user, recentProgress, bookmarks, subjects, stats] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    }),
    prisma.learningProgress.findMany({
      where: { userId },
      include: {
        material: {
          include: {
            topic: {
              include: {
                chapter: {
                  include: { subject: true },
                },
              },
            },
          },
        },
      },
      orderBy: { lastWatched: 'desc' },
      take: 5,
    }),
    prisma.bookmark.findMany({
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
    }),
    prisma.subject.findMany({
      where: { published: true },
      include: {
        chapters: {
          where: { published: true },
          include: {
            topics: {
              where: { published: true },
              include: {
                materials: {
                  where: { published: true },
                },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    }),
    prisma.learningProgress.groupBy({
      by: ['completed'],
      where: { userId },
      _count: { id: true },
    }),
  ]);

  // Calculate stats
  const completedCount = stats.find(s => s.completed)?._count.id || 0;
  const totalProgressCount = stats.reduce((acc, s) => acc + s._count.id, 0);
  const inProgressCount = totalProgressCount - completedCount;

  // Get continue watching (in progress, not completed)
  const continueWatching = recentProgress
    .filter(p => !p.completed && p.playbackPosition > 0)
    .slice(0, 4);

  // Get completed recently
  const recentlyCompleted = recentProgress
    .filter(p => p.completed)
    .slice(0, 4);

  // Calculate subject progress
  const subjectProgress = subjects.map(subject => {
    let totalMaterials = 0;
    let completedMaterials = 0;

    subject.chapters.forEach(chapter => {
      chapter.topics.forEach(topic => {
        topic.materials.forEach(material => {
          totalMaterials++;
          const progress = recentProgress.find(p => p.materialId === material.id);
          if (progress?.completed) completedMaterials++;
        });
      });
    });

    return {
      ...subject,
      totalMaterials,
      completedMaterials,
      progressPercentage: totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0,
    };
  });

  // Pass data to client component
  const initialData = {
    user: user!,
    continueWatching,
    recentlyCompleted,
    bookmarks,
    subjectProgress,
    stats: {
      completedCount,
      inProgressCount,
      totalSubjects: subjects.length,
    },
  };

  return <StudentDashboardClient initialData={initialData} />;
}