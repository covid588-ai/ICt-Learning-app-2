// Subject Detail Page - Chapters List
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import SubjectDetailClient from './SubjectDetailClient';

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
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

  const { subjectId } = await params;

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    include: {
      chapters: {
        where: { published: true },
        include: {
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
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!subject || !subject.published) {
    notFound();
  }

  // Get user progress
  const progress = await prisma.learningProgress.findMany({
    where: { userId },
    select: { materialId: true, completed: true, playbackPosition: true },
  });

  const progressMap = new Map(progress.map(p => [p.materialId, p]));

  // Calculate progress for each chapter
  const chaptersWithProgress = subject.chapters.map(chapter => {
    let totalMaterials = 0;
    let completedMaterials = 0;

    chapter.topics.forEach(topic => {
      topic.materials.forEach(material => {
        totalMaterials++;
        const p = progressMap.get(material.id);
        if (p?.completed) completedMaterials++;
      });
    });

    return {
      ...chapter,
      totalMaterials,
      completedMaterials,
      progressPercentage: totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0,
    };
  });

  // Overall subject progress
  const totalMaterials = chaptersWithProgress.reduce((acc, c) => acc + c.totalMaterials, 0);
  const completedMaterials = chaptersWithProgress.reduce((acc, c) => acc + c.completedMaterials, 0);
  const subjectProgress = totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0;

  return (
    <SubjectDetailClient
      subject={subject}
      chapters={chaptersWithProgress}
      subjectProgress={subjectProgress}
      totalMaterials={totalMaterials}
      completedMaterials={completedMaterials}
    />
  );
}