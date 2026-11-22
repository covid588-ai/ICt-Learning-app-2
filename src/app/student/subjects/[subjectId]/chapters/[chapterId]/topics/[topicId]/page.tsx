// Topic Detail Page - Materials List (Videos & PDFs)
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import TopicDetailClient from './TopicDetailClient';

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ subjectId: string; chapterId: string; topicId: string }>;
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

  const { subjectId, chapterId, topicId } = await params;

  const topic = await prisma.topic.findUnique({
    where: { id: topicId, chapterId },
    include: {
      chapter: {
        include: { subject: true },
      },
      materials: {
        where: { published: true },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!topic || !topic.published || !topic.chapter.published || !topic.chapter.subject.published) {
    notFound();
  }

  // Get user progress for materials in this topic
  const materialIds = topic.materials.map(m => m.id);
  const progress = await prisma.learningProgress.findMany({
    where: {
      userId,
      materialId: { in: materialIds },
    },
    select: { materialId: true, completed: true, playbackPosition: true, lastWatched: true },
  });

  const progressMap = new Map(progress.map(p => [p.materialId, p]));

  // Get bookmarks
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId,
      materialId: { in: materialIds },
    },
    select: { materialId: true },
  });

  const bookmarkSet = new Set(bookmarks.map(b => b.materialId));

  const materialsWithProgress = topic.materials.map(material => {
    const p = progressMap.get(material.id);
    return {
      ...material,
      progress: p ? {
        completed: p.completed,
        playbackPosition: p.playbackPosition,
        lastWatched: p.lastWatched,
      } : null,
      isBookmarked: bookmarkSet.has(material.id),
    };
  });

  // Find previous and next materials in the chapter
  const chapterTopics = await prisma.topic.findMany({
    where: { chapterId, published: true },
    include: {
      materials: {
        where: { published: true },
        orderBy: { order: 'asc' },
        select: { id: true, topicId: true, order: true, type: true, title: true },
      },
    },
    orderBy: { order: 'asc' },
  });

  // Flatten all materials in chapter order
  const allMaterials = chapterTopics.flatMap(t =>
    t.materials.map(m => ({ ...m, topicTitle: t.title, topicId: t.id }))
  );

  const currentIndex = allMaterials.findIndex(m => m.id === materialsWithProgress[0]?.id);
  const prevMaterial = currentIndex > 0 ? allMaterials[currentIndex - 1] : null;
  const nextMaterial = currentIndex < allMaterials.length - 1 ? allMaterials[currentIndex + 1] : null;

  return (
    <TopicDetailClient
      topic={topic}
      materials={materialsWithProgress}
      prevMaterial={prevMaterial}
      nextMaterial={nextMaterial}
      chapter={topic.chapter}
    />
  );
}