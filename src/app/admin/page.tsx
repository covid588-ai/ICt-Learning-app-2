// Admin Dashboard Page
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const role = (session.user as any).role;
  if (role !== 'ADMIN') {
    redirect('/student');
  }

  // Fetch dashboard statistics
  const [
    totalSubjects,
    totalChapters,
    totalTopics,
    totalVideos,
    totalPdfs,
    totalStudents,
    activeStudents,
    recentMaterials,
    recentStudents,
  ] = await Promise.all([
    prisma.subject.count(),
    prisma.chapter.count(),
    prisma.topic.count(),
    prisma.learningMaterial.count({ where: { type: 'VIDEO' } }),
    prisma.learningMaterial.count({ where: { type: 'PDF' } }),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'STUDENT', status: 'ACTIVE' } }),
    prisma.learningMaterial.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        topic: {
          include: {
            chapter: { include: { subject: true } },
          },
        },
      },
    }),
    prisma.user.findMany({
      where: { role: 'STUDENT' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        status: true,
        createdAt: true,
        _count: { select: { progress: true } },
      },
    }),
  ]);

  const stats = {
    totalSubjects,
    totalChapters,
    totalTopics,
    totalVideos,
    totalPdfs,
    totalStudents,
    activeStudents,
    inactiveStudents: totalStudents - activeStudents,
  };

  return (
    <AdminDashboardClient
      stats={stats}
      recentMaterials={recentMaterials}
      recentStudents={recentStudents}
    />
  );
}