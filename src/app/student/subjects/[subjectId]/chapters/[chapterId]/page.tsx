// Chapter Detail Page - Topics List
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import ChapterDetailClient from './ChapterDetailClient';

export default async function ChapterDetailPage({
  params,
}: {
  params: Promise<{ subjectId: string; chapterId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  if (role === 'ADMIN') {
    redirect('/admin');
  }

  const { subjectId, chapterId } = await params;

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId, subjectId },
    include: {
      subject: true,
      topics: {
        where: { published: true },
        include: {
          materials: {
            where: { published: true },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!chapter || !chapter.published || !chapter.subject.published) {
    notFound();
  }

  // Get user progress
  const progress = await prisma.learningProgress.findMany({
    where: { userId },
    select: { materialId: true, completed: true, playbackPosition: true },
  });

  const progressMap = new Map(progress.map(p => [p.materialId, p]));

  // Calculate progress for each topic
  const topicsWithProgress = chapter.topics.map(topic => {
    let totalMaterials = 0;
    let completedMaterials = 0;
    let totalDuration = 0;
    let watchedDuration = 0;

    topic.materials.forEach(material => {
      totalMaterials++;
      const p = progressMap.get(material.id);
      if (p?.completed) completedMaterials++;
      if (material.duration) {
        totalDuration += material.duration;
        watchedDuration += Math.min(p?.playbackPosition || 0, material.duration);
      }
    });

    return {
      ...topic,
      totalMaterials,
      completedMaterials,
      progressPercentage: totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0,
      totalDuration,
      watchedDuration,
    };
  });

  // Overall chapter progress
  const totalMaterials = topicsWithProgress.reduce((acc, t) => acc + t.totalMaterials, 0);
  const completedMaterials = topicsWithProgress.reduce((acc, t) => acc + t.completedMaterials, 0);
  const chapterProgress = totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0;

  return (
    <ChapterDetailClient
      chapter={chapter}
      topics={topicsWithProgress}
      chapterProgress={chapterProgress}
      totalMaterials={totalMaterials}
      completedMaterials={completedMaterials}
    />
  );
}