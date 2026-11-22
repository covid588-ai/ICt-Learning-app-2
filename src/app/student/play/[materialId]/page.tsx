// Video Player / PDF Viewer Page
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import { ContentType } from '@prisma/client';
import PlayerPageClient from './PlayerPageClient';

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ materialId: string }>;
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

  const { materialId } = await params;

  const material = await prisma.learningMaterial.findUnique({
    where: { id: materialId, published: true },
    include: {
      topic: {
        include: {
          chapter: {
            include: { subject: true },
          },
        },
      },
    },
  });

  if (!material || !material.topic.published || !material.topic.chapter.published || !material.topic.chapter.subject.published) {
    notFound();
  }

  // Get user progress
  const progress = await prisma.learningProgress.findUnique({
    where: { userId_materialId: { userId, materialId } },
  });

  // Get bookmark
  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_materialId: { userId, materialId } },
  });

  // Get previous and next materials in chapter
  const chapterTopics = await prisma.topic.findMany({
    where: { chapterId: material.topicId, published: true },
    include: {
      materials: {
        where: { published: true },
        orderBy: { order: 'asc' },
        select: { id: true, topicId: true, order: true, type: true, title: true },
      },
    },
    orderBy: { order: 'asc' },
  });

  const allMaterials = chapterTopics.flatMap(t =>
    t.materials.map(m => ({ ...m, topicTitle: t.title, topicId: t.id }))
  );

  const currentIndex = allMaterials.findIndex(m => m.id === materialId);
  const prevMaterial = currentIndex > 0 ? allMaterials[currentIndex - 1] : null;
  const nextMaterial = currentIndex < allMaterials.length - 1 ? allMaterials[currentIndex + 1] : null;

  return (
    <PlayerPageClient
      material={material}
      progress={progress}
      isBookmarked={!!bookmark}
      prevMaterial={prevMaterial}
      nextMaterial={nextMaterial}
      userDriveToken={(session as any).accessToken}
      userRefreshToken={(session as any).refreshToken}
      userTokenExpiry={(session as any).accessTokenExpires}
    />
  );
}