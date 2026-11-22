// Topics API - Admin CRUD Operations
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

    const userRole = (session.user as any).role;
    const isAdmin = userRole === UserRole.ADMIN;

    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId');
    const published = searchParams.get('published');

    const where: any = {};
    if (chapterId) where.chapterId = chapterId;
    if (published !== null && !isAdmin) where.published = published === 'true';

    const topics = await prisma.topic.findMany({
      where,
      include: {
        chapter: { include: { subject: true } },
        _count: { select: { materials: true } },
        materials: {
          where: isAdmin ? {} : { published: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [{ chapter: { subject: { order: 'asc' } } }, { chapter: { order: 'asc' } }, { order: 'asc' }],
    });

    return NextResponse.json({ topics });
  } catch (error) {
    console.error('Get topics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { chapterId, title, description, order, published } = body;

    if (!chapterId || !title?.trim()) {
      return NextResponse.json({ error: 'Chapter ID and title are required' }, { status: 400 });
    }

    const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    const maxOrder = await prisma.topic.findFirst({
      where: { chapterId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const topic = await prisma.topic.create({
      data: {
        chapterId,
        title: title.trim(),
        description: description?.trim() || null,
        order: order !== undefined ? order : (maxOrder?.order || 0) + 1,
        published: published ?? false,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: 'CREATE',
        entity: 'Topic',
        entityId: topic.id,
        newData: topic,
      },
    });

    return NextResponse.json({ topic }, { status: 201 });
  } catch (error) {
    console.error('Create topic error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}