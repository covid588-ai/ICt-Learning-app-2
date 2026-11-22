// Subjects Listing Page
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import SubjectsClient from './SubjectsClient';

export default async function SubjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  if (role === 'ADMIN') {
    redirect('/admin');
  }

  const subjects = await prisma.subject.findMany({
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
      _count: {
        select: { chapters: true },
      },
    },
    orderBy: { order: 'asc' },
  });

  // Get user progress for all materials
  const progress = await prisma.learningProgress.findMany({
    where: { userId },
    select: { materialId: true, completed: true, playbackPosition: true },
  });

  const progressMap = new Map(progress.map(p => [p.materialId, p]));

  // Calculate progress for each subject
  const subjectsWithProgress = subjects.map(subject => {
    let totalMaterials = 0;
    let completedMaterials = 0;

    subject.chapters.forEach(chapter => {
      chapter.topics.forEach(topic => {
        topic.materials.forEach(material => {
          totalMaterials++;
          const p = progressMap.get(material.id);
          if (p?.completed) completedMaterials++;
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

  return <SubjectsClient subjects={subjectsWithProgress} />;
}