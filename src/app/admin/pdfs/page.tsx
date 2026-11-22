// Admin PDFs Management Page
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AdminPdfsClient from './AdminPdfsClient';

export default async function AdminPdfsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const role = (session.user as any).role;
  if (role !== 'ADMIN') {
    redirect('/student');
  }

  const pdfs = await prisma.learningMaterial.findMany({
    where: { type: 'PDF' },
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

  return <AdminPdfsClient pdfs={pdfs} />;
}