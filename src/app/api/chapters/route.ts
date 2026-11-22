// Chapters API - Admin CRUD Operations
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
    const subjectId = searchParams.get('subjectId');
    const published = searchParams.get('published');

    const where: any = {};
    if (subjectId) where.subjectId = subjectId;
    if (published !== null && !isAdmin) where.published = published === 'true';

    const chapters = await prisma.chapter.findMany({
      where,
      include: {
        subject: true,
        _count: { select: { topics: true } },
      },
      orderBy: [{ subject: { order: 'asc' } }, { order: 'asc' }],
    });

    return NextResponse.json({ chapters });
  } catch (error) {
    console.error('Get chapters error:', error);
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
    const { subjectId, title, description, order, published } = body;

    if (!subjectId || !title?.trim()) {
      return NextResponse.json({ error: 'Subject ID and title are required' }, { status: 400 });
    }

    // Verify subject exists
    const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    const maxOrder = await prisma.chapter.findFirst({
      where: { subjectId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const chapter = await prisma.chapter.create({
      data: {
        subjectId,
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
        entity: 'Chapter',
        entityId: chapter.id,
        newData: chapter,
      },
    });

    return NextResponse.json({ chapter }, { status: 201 });
  } catch (error) {
    console.error('Create chapter error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}