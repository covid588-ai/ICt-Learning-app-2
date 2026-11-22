// Video Streaming API - Secure Private Google Drive Video Delivery
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createDriveService, getVideoStreamHeaders } from '@/lib/drive';

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
    const userRole = (session.user as any).role;
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
            chapter: {
              include: { subject: true },
            },
          },
        },
      },
    });

    if (!material) {
      return new NextResponse('Video not found', { status: 404 });
    }

    if (material.type !== 'VIDEO') {
      return new NextResponse('Not a video material', { status: 400 });
    }

    // 3. Check if user has access to this material (enrolled, etc.)
    // For now, all published materials are accessible to authenticated students
    // You can add enrollment checks here

    // 4. Verify user has Google Drive authorization
    if (!userAccessToken) {
      return new NextResponse(
        'Google Drive authorization required. Please sign in with Google.',
        { status: 403 }
      );
    }

    // 5. Create Drive service with user's tokens
    const driveService = createDriveService({
      access_token: userAccessToken,
      refresh_token: userRefreshToken,
      expiry_date: userTokenExpiry,
    });

    // 6. Check if user has access to this specific Drive file
    const hasAccess = await driveService.checkFileAccess(material.driveFileId);
    if (!hasAccess) {
      return new NextResponse(
        'You do not have permission to watch this video. Please contact the administrator.',
        { status: 403 }
      );
    }

    // 7. Get file info to determine content length and type
    const fileInfo = await driveService.getFileInfo(material.driveFileId);
    if (!fileInfo) {
      return new NextResponse('Video file not found on Google Drive', { status: 404 });
    }

    // 8. Handle Range requests for video seeking
    const range = request.headers.get('range');
    const contentLength = fileInfo.size ? parseInt(fileInfo.size, 10) : undefined;

    // 9. Stream the video from Google Drive
    const drive = (driveService as any).drive;
    const response = await drive.files.get(
      { fileId: material.driveFileId, alt: 'media', supportsAllDrives: true },
      { responseType: 'stream' }
    );

    // 10. Create streaming response with proper headers
    const stream = response.data as NodeJS.ReadableStream;

    // Convert Node stream to Web ReadableStream
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

    // 11. Set headers for video streaming
    const headers = getVideoStreamHeaders(range || undefined, contentLength);
    headers['Content-Type'] = fileInfo.mimeType || 'video/mp4';
    headers['Content-Disposition'] = `inline; filename="${fileInfo.name}"`;
    headers['X-Content-Type-Options'] = 'nosniff';

    return new NextResponse(readableStream, {
      status: range ? 206 : 200,
      headers,
    });
  } catch (error: any) {
    console.error('Video streaming error:', error);

    if (error.message === 'ACCESS_DENIED') {
      return new NextResponse(
        'You do not have permission to watch this video. Please contact the administrator.',
        { status: 403 }
      );
    }

    return new NextResponse('Internal server error', { status: 500 });
  }
}

// Handle OPTIONS for CORS preflight
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