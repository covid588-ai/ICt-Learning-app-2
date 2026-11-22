import { google, drive_v3 } from 'googleapis';
import { prisma } from './prisma';

export interface DriveFileInfo {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  thumbnailLink?: string;
  webViewLink: string;
  webContentLink?: string;
  videoMediaMetadata?: {
    width: number;
    height: number;
    durationMillis: string;
  };
}

export interface DrivePermission {
  id: string;
  type: string;
  role: string;
  emailAddress?: string;
  displayName?: string;
}

class GoogleDriveService {
  private oauth2Client: any;
  private drive: drive_v3.Drive | null = null;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
    );
  }

  setCredentials(tokens: { access_token: string; refresh_token?: string; expiry_date?: number }) {
    this.oauth2Client.setCredentials(tokens);
    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  async getFileInfo(fileId: string): Promise<DriveFileInfo | null> {
    if (!this.drive) throw new Error('Drive client not initialized');

    try {
      const response = await this.drive.files.get({
        fileId,
        fields: 'id,name,mimeType,size,thumbnailLink,webViewLink,webContentLink,videoMediaMetadata',
        supportsAllDrives: true,
      });
      return response.data as DriveFileInfo;
    } catch (error: any) {
      if (error.code === 404) return null;
      if (error.code === 403) throw new Error('ACCESS_DENIED');
      throw error;
    }
  }

  async checkFileAccess(fileId: string): Promise<boolean> {
    if (!this.drive) throw new Error('Drive client not initialized');

    try {
      await this.drive.files.get({
        fileId,
        fields: 'id',
        supportsAllDrives: true,
      });
      return true;
    } catch (error: any) {
      if (error.code === 403 || error.code === 404) return false;
      throw error;
    }
  }

  async getFilePermissions(fileId: string): Promise<DrivePermission[]> {
    if (!this.drive) throw new Error('Drive client not initialized');

    try {
      const response = await this.drive.permissions.list({
        fileId,
        fields: 'permissions(id,type,role,emailAddress,displayName)',
        supportsAllDrives: true,
      });
      return (response.data.permissions || []) as DrivePermission[];
    } catch (error) {
      return [];
    }
  }

  async getVideoStreamUrl(fileId: string): Promise<string | null> {
    if (!this.drive) throw new Error('Drive client not initialized');

    try {
      const response = await this.drive.files.get({
        fileId,
        alt: 'media',
        supportsAllDrives: true,
      }, { responseType: 'stream' });

      // This returns a stream, we'll handle streaming in the API route
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async listFiles(folderId?: string): Promise<DriveFileInfo[]> {
    if (!this.drive) throw new Error('Drive client not initialized');

    const query = folderId
      ? `'${folderId}' in parents and trashed=false`
      : 'trashed=false';

    try {
      const response = await this.drive.files.list({
        q: query,
        fields: 'files(id,name,mimeType,size,thumbnailLink,webViewLink,videoMediaMetadata)',
        pageSize: 100,
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });
      return (response.data.files || []) as DriveFileInfo[];
    } catch (error) {
      return [];
    }
  }

  // For admin: get file using service account or admin credentials
  static async getFileAsAdmin(fileId: string): Promise<DriveFileInfo | null> {
    const adminTokens = await prisma.appSettings.findUnique({
      where: { key: 'admin_drive_tokens' },
    });

    if (!adminTokens?.value) return null;

    const tokens = JSON.parse(adminTokens.value);
    const service = new GoogleDriveService();
    service.setCredentials(tokens);
    return service.getFileInfo(fileId);
  }
}

export const googleDrive = new GoogleDriveService();

// Helper to create service with user tokens
export function createDriveService(tokens: { access_token: string; refresh_token?: string; expiry_date?: number }) {
  const service = new GoogleDriveService();
  service.setCredentials(tokens);
  return service;
}

// Video MIME types that can be played in browser
export const SUPPORTED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
];

export const SUPPORTED_PDF_MIME_TYPES = [
  'application/pdf',
];

export function isVideoFile(mimeType: string): boolean {
  return SUPPORTED_VIDEO_MIME_TYPES.includes(mimeType);
}

export function isPdfFile(mimeType: string): boolean {
  return SUPPORTED_PDF_MIME_TYPES.includes(mimeType);
}

export function getVideoStreamHeaders(range?: string, contentLength?: number) {
  const headers: Record<string, string> = {
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };

  if (range && contentLength) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : contentLength - 1;
    const chunkSize = (end - start) + 1;

    headers['Content-Range'] = `bytes ${start}-${end}/${contentLength}`;
    headers['Content-Length'] = chunkSize.toString();
    headers['Content-Type'] = 'video/mp4';
  }

  return headers;
}