// Learning Progress API
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const materialId = searchParams.get('materialId');

    if (materialId) {
      // Get progress for specific material
      const progress = await prisma.learningProgress.findUnique({
        where: { userId_materialId: { userId, materialId } },
      });
      return NextResponse.json({ progress });
    }

    // Get all progress for user
    const progress = await prisma.learningProgress.findMany({
      where: { userId },
      include: {
        material: {
          include: {
            topic: {
              include: {
                chapter: { include: { subject: true } },
              },
            },
          },
        },
      },
      orderBy: { lastWatched: 'desc' },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { materialId, playbackPosition, completed } = body;

    if (!materialId) {
      return NextResponse.json({ error: 'Material ID required' }, { status: 400 });
    }

    // Verify material exists and is published
    const material = await prisma.learningMaterial.findUnique({
      where: { id: materialId, published: true },
    });

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    // Update or create progress
    const progress = await prisma.learningProgress.upsert({
      where: { userId_materialId: { userId, materialId } },
      update: {
        ...(playbackPosition !== undefined && { playbackPosition: Math.floor(playbackPosition) }),
        ...(completed !== undefined && {
          completed,
          completedAt: completed ? new Date() : null,
        }),
        lastWatched: new Date(),
        watchCount: { increment: 1 },
      },
      create: {
        userId,
        materialId,
        playbackPosition: Math.floor(playbackPosition || 0),
        completed: completed || false,
        completedAt: completed ? new Date() : null,
        lastWatched: new Date(),
        watchCount: 1,
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}