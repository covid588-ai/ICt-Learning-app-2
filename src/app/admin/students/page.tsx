// Admin Students Management Page
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AdminStudentsClient from './AdminStudentsClient';

export default async function AdminStudentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const role = (session.user as any).role;
  if (role !== 'ADMIN') {
    redirect('/student');
  }

  const { searchParams } = new URL('http://localhost');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;
  const skip = (page - 1) * limit;

  const [students, total] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        status: true,
        createdAt: true,
        _count: {
          select: { progress: true, bookmarks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where: { role: 'STUDENT' } }),
  ]);

  // Get progress stats for each student
  const studentsWithStats = await Promise.all(
    students.map(async (student) => {
      const progress = await prisma.learningProgress.findMany({
        where: { userId: student.id },
        select: { completed: true },
      });

      const completedCount = progress.filter(p => p.completed).length;
      const totalProgress = progress.length;

      return {
        ...student,
        completedCount,
        totalProgress,
        progressPercentage: totalProgress > 0 ? Math.round((completedCount / totalProgress) * 100) : 0,
      };
    })
  );

  return <AdminStudentsClient students={studentsWithStats} total={total} page={page} limit={limit} />;
}