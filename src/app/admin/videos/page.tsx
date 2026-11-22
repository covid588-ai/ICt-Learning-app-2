// Admin Videos Management Page
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AdminVideosClient from './AdminVideosClient';

export default async function AdminVideosPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const role = (session.user as any).role;
  if (role !== 'ADMIN') {
    redirect('/student');
  }

  const videos = await prisma.learningMaterial.findMany({
    where: { type: 'VIDEO' },
    include: {
      topic: {
        include: {
          chapter: { include: { subject: true } },
        },
      },
    },
    orderBy: [
      { topic: { chapter: { subject: { order: 'asc' } } } },
      { topic: { chapter: { order: 'asc' } } },
      { topic: { order: 'asc' } },
      { order: 'asc' },
    ],
  });

  return <AdminVideosClient videos={videos} />;
}