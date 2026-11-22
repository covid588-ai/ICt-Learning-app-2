// Admin Subjects Management Page
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AdminSubjectsClient from './AdminSubjectsClient';

export default async function AdminSubjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const role = (session.user as any).role;
  if (role !== 'ADMIN') {
    redirect('/student');
  }

  const subjects = await prisma.subject.findMany({
    include: {
      _count: {
        select: { chapters: true },
      },
      chapters: {
        where: { published: true },
        include: {
          _count: { select: { topics: true } },
        },
      },
    },
    orderBy: { order: 'asc' },
  });

  // Calculate total materials per subject
  const subjectsWithStats = await Promise.all(
    subjects.map(async (subject) => {
      const chapters = await prisma.chapter.findMany({
        where: { subjectId: subject.id },
        include: {
          topics: {
            include: {
              _count: { select: { materials: true } },
            },
          },
        },
      });

      let totalTopics = 0;
      let totalVideos = 0;
      let totalPdfs = 0;

      chapters.forEach(chapter => {
        chapter.topics.forEach(topic => {
          totalTopics++;
          topic.materials.forEach((m: any) => {
            if (m.type === 'VIDEO') totalVideos++;
            else totalPdfs++;
          });
        });
      });

      return {
        ...subject,
        totalTopics,
        totalVideos,
        totalPdfs,
        totalMaterials: totalVideos + totalPdfs,
      };
    })
  );

  return <AdminSubjectsClient subjects={subjectsWithStats} />;
}