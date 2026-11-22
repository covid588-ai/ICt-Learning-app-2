// Material Detail API - Admin CRUD Operations
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole, ContentType } from '@prisma/client';
import { extractDriveFileId } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const userRole = (session.user as any).role;
    const isAdmin = userRole === UserRole.ADMIN;

    const material = await prisma.learningMaterial.findUnique({
      where: { id },
      include: {
        topic: {
          include: {
            chapter: { include: { subject: true } },
          },
        },
      },
    });

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    return NextResponse.json({ material });
  } catch (error) {
    console.error('Get material error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, driveUrl, driveFileId, order, published, thumbnail, duration } = body;

    const currentMaterial = await prisma.learningMaterial.findUnique({ where: { id } });
    if (!currentMaterial) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    // Handle Drive File ID update
    let finalDriveFileId = currentMaterial.driveFileId;
    if (driveUrl || driveFileId) {
      finalDriveFileId = extractDriveFileId(driveUrl || driveFileId || '');
      if (!finalDriveFileId) {
        return NextResponse.json({ error: 'Invalid Google Drive URL' }, { status: 400 });
      }

      // Check for duplicate
      if (finalDriveFileId !== currentMaterial.driveFileId) {
        const existing = await prisma.learningMaterial.findUnique({
          where: { driveFileId: finalDriveFileId },
        });
        if (existing) {
          return NextResponse.json({ error: 'This Google Drive file is already added' }, { status: 409 });
        }
      }
    }

    const material = await prisma.learningMaterial.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(finalDriveFileId !== currentMaterial.driveFileId && { driveFileId: finalDriveFileId }),
        ...(order !== undefined && { order }),
        ...(published !== undefined && { published }),
        ...(thumbnail !== undefined && { thumbnail: thumbnail?.trim() || null }),
        ...(duration !== undefined && { duration }),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: 'UPDATE',
        entity: 'LearningMaterial',
        entityId: id,
        oldData: currentMaterial,
        newData: material,
      },
    });

    return NextResponse.json({ material });
  } catch (error) {
    console.error('Update material error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const material = await prisma.learningMaterial.findUnique({ where: { id } });
    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    await prisma.learningMaterial.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: 'DELETE',
        entity: 'LearningMaterial',
        entityId: id,
        oldData: material,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete material error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}