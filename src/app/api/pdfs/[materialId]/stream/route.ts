// PDF Streaming API - Secure Private Google Drive PDF Delivery
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createDriveService } from '@/lib/drive';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ materialId: string }> }
) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = (session.user as any).id;
    const userAccessToken = (session as any).accessToken;
    const userRefreshToken = (session as any).refreshToken;
    const userTokenExpiry = (session as any).accessTokenExpires;

    // 2. Get material and verify access
    const { materialId } = await params;
    const material = await prisma.learningMaterial.findUnique({
      where: { id: materialId, published: true },
      include: {
        topic: {
          include: {
            chapter: { include: { subject: true } },
          },
        },
      },
    });

    if (!material) {
      return new NextResponse('PDF not found', { status: 404 });
    }

    if (material.type !== 'PDF') {
      return new NextResponse('Not a PDF material', { status: 400 });
    }

    // 3. Verify user has Google Drive authorization
    if (!userAccessToken) {
      return new NextResponse(
        'Google Drive authorization required. Please sign in with Google.',
        { status: 403 }
      );
    }

    // 4. Create Drive service with user's tokens
    const driveService = createDriveService({
      access_token: userAccessToken,
      refresh_token: userRefreshToken,
      expiry_date: userTokenExpiry,
    });

    // 5. Check if user has access to this specific Drive file
    const hasAccess = await driveService.checkFileAccess(material.driveFileId);
    if (!hasAccess) {
      return new NextResponse(
        'You do not have permission to view this PDF. Please contact the administrator.',
        { status: 403 }
      );
    }

    // 6. Get file info
    const fileInfo = await driveService.getFileInfo(material.driveFileId);
    if (!fileInfo) {
      return new NextResponse('PDF file not found on Google Drive', { status: 404 });
    }

    // 7. Stream the PDF from Google Drive
    const drive = (driveService as any).drive;
    const response = await drive.files.get(
      { fileId: material.driveFileId, alt: 'media', supportsAllDrives: true },
      { responseType: 'stream' }
    );

    const stream = response.data as NodeJS.ReadableStream;

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
      cancel() {
        stream.destroy();
      },
    });

    // 8. Set headers for PDF streaming
    const headers = new Headers();
    headers.set('Content-Type', fileInfo.mimeType || 'application/pdf');
    headers.set('Content-Disposition', `inline; filename="${fileInfo.name}"`);
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');

    if (fileInfo.size) {
      headers.set('Content-Length', fileInfo.size);
      headers.set('Accept-Ranges', 'bytes');
    }

    return new NextResponse(readableStream, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('PDF streaming error:', error);

    if (error.message === 'ACCESS_DENIED') {
      return new NextResponse(
        'You do not have permission to view this PDF. Please contact the administrator.',
        { status: 403 }
      );
    }

    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Content-Type, Authorization',
      'Accept-Ranges': 'bytes',
    },
  });
}