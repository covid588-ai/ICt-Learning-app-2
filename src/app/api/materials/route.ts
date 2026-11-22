// Learning Materials API - Admin CRUD Operations for Videos and PDFs
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole, ContentType } from '@prisma/client';
import { extractDriveFileId } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const isAdmin = userRole === UserRole.ADMIN;

    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get('topicId');
    const type = searchParams.get('type') as ContentType | null;
    const published = searchParams.get('published');

    const where: any = {};
    if (topicId) where.topicId = topicId;
    if (type) where.type = type;
    if (published !== null && !isAdmin) where.published = published === 'true';

    const materials = await prisma.learningMaterial.findMany({
      where,
      include: {
        topic: {
          include: {
            chapter: { include: { subject: true } },
          },
        },
      },
      orderBy: [{ topic: { chapter: { subject: { order: 'asc' } } } }, { topic: { chapter: { order: 'asc' } } }, { topic: { order: 'asc' } }, { order: 'asc' }],
    });

    return NextResponse.json({ materials });
  } catch (error) {
    console.error('Get materials error:', error);
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
    const { topicId, type, title, description, driveUrl, driveFileId, order, published, thumbnail, duration } = body;

    if (!topicId || !type || !title?.trim()) {
      return NextResponse.json({ error: 'Topic ID, type, and title are required' }, { status: 400 });
    }

    if (!['VIDEO', 'PDF'].includes(type)) {
      return NextResponse.json({ error: 'Type must be VIDEO or PDF' }, { status: 400 });
    }

    // Extract Drive File ID from URL if provided
    let finalDriveFileId = driveFileId;
    if (driveUrl && !driveFileId) {
      finalDriveFileId = extractDriveFileId(driveUrl);
      if (!finalDriveFileId) {
        return NextResponse.json({ error: 'Invalid Google Drive URL' }, { status: 400 });
      }
    }

    if (!finalDriveFileId) {
      return NextResponse.json({ error: 'Google Drive File ID is required' }, { status: 400 });
    }

    // Verify topic exists
    const topic = await prisma.topic.findUnique({ where: { id: topicId } });
    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    // Check for duplicate Drive File ID
    const existing = await prisma.learningMaterial.findUnique({
      where: { driveFileId: finalDriveFileId },
    });
    if (existing) {
      return NextResponse.json({ error: 'This Google Drive file is already added' }, { status: 409 });
    }

    const maxOrder = await prisma.learningMaterial.findFirst({
      where: { topicId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const material = await prisma.learningMaterial.create({
      data: {
        topicId,
        type: type as ContentType,
        title: title.trim(),
        description: description?.trim() || null,
        driveFileId: finalDriveFileId,
        order: order !== undefined ? order : (maxOrder?.order || 0) + 1,
        published: published ?? false,
        thumbnail: thumbnail?.trim() || null,
        duration: duration || null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: 'CREATE',
        entity: 'LearningMaterial',
        entityId: material.id,
        newData: material,
      },
    });

    return NextResponse.json({ material }, { status: 201 });
  } catch (error) {
    console.error('Create material error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}