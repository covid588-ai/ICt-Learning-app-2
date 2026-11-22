// Subjects API - Admin CRUD Operations
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
    const published = searchParams.get('published');
    const includeStats = searchParams.get('includeStats') === 'true';

    const where: any = {};
    if (published !== null && !isAdmin) {
      where.published = published === 'true';
    } else if (published !== null) {
      where.published = published === 'true';
    }

    const subjects = await prisma.subject.findMany({
      where,
      include: {
        _count: {
          select: { chapters: true },
        },
        chapters: {
          where: isAdmin ? {} : { published: true },
          include: {
            _count: { select: { topics: true } },
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    let subjectsWithStats = subjects;
    if (includeStats) {
      subjectsWithStats = await Promise.all(
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
    }

    return NextResponse.json({ subjects: subjectsWithStats });
  } catch (error) {
    console.error('Get subjects error:', error);
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
    const { title, description, icon, coverImage, order, published } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Get max order for default
    const maxOrder = await prisma.subject.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const subject = await prisma.subject.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        icon: icon?.trim() || '📚',
        coverImage: coverImage?.trim() || null,
        order: order !== undefined ? order : (maxOrder?.order || 0) + 1,
        published: published ?? false,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: 'CREATE',
        entity: 'Subject',
        entityId: subject.id,
        newData: subject,
      },
    });

    return NextResponse.json({ subject }, { status: 201 });
  } catch (error) {
    console.error('Create subject error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}