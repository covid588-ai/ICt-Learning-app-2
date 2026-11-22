// Global Search API
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;
    const isAdmin = userRole === UserRole.ADMIN;

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();
    const type = searchParams.get('type'); // subject, chapter, topic, material
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = `%${query}%`;
    const results: any[] = [];

    // Search subjects
    if (!type || type === 'subject') {
      const subjects = await prisma.subject.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
          ...(isAdmin ? {} : { published: true }),
        },
        take: 5,
        select: { id: true, title: true, description: true, icon: true, order: true, published: true },
      });

      results.push(...subjects.map(s => ({
        id: s.id,
        type: 'subject' as const,
        title: s.title,
        description: s.description,
        icon: s.icon,
        published: s.published,
      })));
    }

    // Search chapters
    if (!type || type === 'chapter') {
      const chapters = await prisma.chapter.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
          ...(isAdmin ? {} : { published: true, subject: { published: true } }),
        },
        take: 5,
        include: { subject: { select: { id: true, title: true } } },
      });

      results.push(...chapters.map(c => ({
        id: c.id,
        type: 'chapter' as const,
        title: c.title,
        description: c.description,
        parentId: c.subjectId,
        parentTitle: c.subject.title,
        published: c.published,
      })));
    }

    // Search topics
    if (!type || type === 'topic') {
      const topics = await prisma.topic.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
          ...(isAdmin ? {} : { published: true, chapter: { published: true, subject: { published: true } } }),
        },
        take: 5,
        include: { chapter: { include: { subject: { select: { id: true, title: true } } } } },
      });

      results.push(...topics.map(t => ({
        id: t.id,
        type: 'topic' as const,
        title: t.title,
        description: t.description,
        parentId: t.chapterId,
        parentTitle: `${t.chapter.subject.title} › ${t.chapter.title}`,
        published: t.published,
      })));
    }

    // Search materials (videos and PDFs)
    if (!type || type === 'material') {
      const materials = await prisma.learningMaterial.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
          ...(isAdmin ? {} : { published: true, topic: { published: true, chapter: { published: true, subject: { published: true } } } }),
        },
        take: 10,
        include: { topic: { include: { chapter: { include: { subject: { select: { id: true, title: true } } } } } } },
      });

      results.push(...materials.map(m => ({
        id: m.id,
        type: 'material' as const,
        title: m.title,
        description: m.description,
        materialType: m.type,
        parentId: m.topicId,
        parentTitle: `${m.topic.chapter.subject.title} › ${m.topic.chapter.title} › ${m.topic.title}`,
        published: m.published,
      })));
    }

    // Sort by relevance (exact matches first, then partial)
    const sortedResults = results.sort((a, b) => {
      const aExact = a.title.toLowerCase() === query.toLowerCase();
      const bExact = b.title.toLowerCase() === query.toLowerCase();
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aStarts = a.title.toLowerCase().startsWith(query.toLowerCase());
      const bStarts = b.title.toLowerCase().startsWith(query.toLowerCase());
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return 0;
    });

    return NextResponse.json({ results: sortedResults.slice(0, limit) });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}