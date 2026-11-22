// Subject Detail API - Admin CRUD Operations
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

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

    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        chapters: {
          where: isAdmin ? {} : { published: true },
          include: {
            topics: {
              where: isAdmin ? {} : { published: true },
              include: {
                materials: {
                  where: isAdmin ? {} : { published: true },
                  orderBy: { order: 'asc' },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    return NextResponse.json({ subject });
  } catch (error) {
    console.error('Get subject error:', error);
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
    const { title, description, icon, coverImage, order, published } = body;

    // Get current subject for audit log
    const currentSubject = await prisma.subject.findUnique({ where: { id } });
    if (!currentSubject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(icon !== undefined && { icon: icon?.trim() || '📚' }),
        ...(coverImage !== undefined && { coverImage: coverImage?.trim() || null }),
        ...(order !== undefined && { order }),
        ...(published !== undefined && { published }),
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: 'UPDATE',
        entity: 'Subject',
        entityId: id,
        oldData: currentSubject,
        newData: subject,
      },
    });

    return NextResponse.json({ subject });
  } catch (error) {
    console.error('Update subject error:', error);
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

    const subject = await prisma.subject.findUnique({ where: { id } });
    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    // Delete subject (cascades to chapters, topics, materials)
    await prisma.subject.delete({ where: { id } });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: 'DELETE',
        entity: 'Subject',
        entityId: id,
        oldData: subject,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete subject error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}