// Type definitions for EduLearn Application

import { UserRole, ContentType, UserStatus, PublishStatus } from '@prisma/client';

export type { UserRole, ContentType, UserStatus, PublishStatus };

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionUser extends User {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
}

export interface AuthState {
  user: SessionUser | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// EDUCATIONAL CONTENT TYPES
// ============================================

export interface Subject {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  coverImage: string | null;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  chapters?: Chapter[];
  _count?: {
    chapters: number;
  };
}

export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  description: string | null;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  topics?: Topic[];
  subject?: Subject;
  _count?: {
    topics: number;
  };
}

export interface Topic {
  id: string;
  chapterId: string;
  title: string;
  description: string | null;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  materials?: LearningMaterial[];
  chapter?: Chapter;
  _count?: {
    materials: number;
  };
}

export interface LearningMaterial {
  id: string;
  topicId: string;
  type: ContentType;
  title: string;
  description: string | null;
  driveFileId: string;
  order: number;
  published: boolean;
  thumbnail: string | null;
  duration: number | null;
  createdAt: Date;
  updatedAt: Date;
  topic?: Topic;
  progress?: LearningProgress;
  isBookmarked?: boolean;
}

export interface LearningMaterialWithProgress extends LearningMaterial {
  progress: LearningProgress | null;
  isBookmarked: boolean;
}

// ============================================
// PROGRESS & BOOKMARKS
// ============================================

export interface LearningProgress {
  id: string;
  userId: string;
  materialId: string;
  playbackPosition: number;
  completed: boolean;
  completedAt: Date | null;
  lastWatched: Date;
  watchCount: number;
  createdAt: Date;
  updatedAt: Date;
  material?: LearningMaterial;
}

export interface Bookmark {
  id: string;
  userId: string;
  materialId: string;
  createdAt: Date;
  material?: LearningMaterial;
}

// ============================================
// GOOGLE DRIVE TYPES
// ============================================

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

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchResult {
  id: string;
  type: 'subject' | 'chapter' | 'topic' | 'material';
  title: string;
  description?: string;
  parentId?: string;
  parentTitle?: string;
  materialType?: ContentType;
}

// ============================================
// FORM TYPES
// ============================================

export interface CreateSubjectInput {
  title: string;
  description?: string;
  icon?: string;
  coverImage?: string;
  order?: number;
  published?: boolean;
}

export interface UpdateSubjectInput extends Partial<CreateSubjectInput> {
  id: string;
}

export interface CreateChapterInput {
  subjectId: string;
  title: string;
  description?: string;
  order?: number;
  published?: boolean;
}

export interface UpdateChapterInput extends Partial<CreateChapterInput> {
  id: string;
}

export interface CreateTopicInput {
  chapterId: string;
  title: string;
  description?: string;
  order?: number;
  published?: boolean;
}

export interface UpdateTopicInput extends Partial<CreateTopicInput> {
  id: string;
}

export interface CreateMaterialInput {
  topicId: string;
  type: ContentType;
  title: string;
  description?: string;
  driveFileId: string;
  order?: number;
  published?: boolean;
  thumbnail?: string;
  duration?: number;
}

export interface UpdateMaterialInput extends Partial<CreateMaterialInput> {
  id: string;
}

export interface AddVideoInput {
  topicId: string;
  driveUrl: string;
  title?: string;
  description?: string;
  order?: number;
}

export interface AddPdfInput {
  topicId: string;
  driveUrl: string;
  title?: string;
  description?: string;
  order?: number;
}

// ============================================
// VIDEO PLAYER TYPES
// ============================================

export interface VideoPlayerState {
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  fullscreen: boolean;
  playbackRate: number;
  buffered: number;
  error: string | null;
  loading: boolean;
}

export interface VideoPlayerControls {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  setPlaybackRate: (rate: number) => void;
}

// ============================================
// PDF VIEWER TYPES
// ============================================

export interface PdfViewerState {
  currentPage: number;
  totalPages: number;
  scale: number;
  loading: boolean;
  error: string | null;
  rotation: number;
}

export interface PdfViewerControls {
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  rotate: () => void;
  toggleFullscreen: () => void;
}

// ============================================
// NAVIGATION TYPES
// ============================================

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

// ============================================
// SETTINGS TYPES
// ============================================

export interface AppSettings {
  key: string;
  value: string;
  description?: string;
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  language: 'en' | 'bn';
}

// ============================================
// ADMIN TYPES
// ============================================

export interface AdminStats {
  totalSubjects: number;
  totalChapters: number;
  totalTopics: number;
  totalVideos: number;
  totalPdfs: number;
  totalStudents: number;
  activeStudents: number;
  recentContent: LearningMaterial[];
}

export interface StudentListItem {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  status: UserStatus;
  createdAt: Date;
  lastLogin?: Date;
  progressCount: number;
  completedCount: number;
}

export interface AuditLogEntry {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  oldData: any;
  newData: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  user?: {
    name: string | null;
    email: string;
  };
}

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface SubjectCardProps {
  subject: Subject;
  onClick?: () => void;
  showProgress?: boolean;
  progress?: number;
}

export interface ChapterCardProps {
  chapter: Chapter;
  onClick?: () => void;
  showProgress?: boolean;
  progress?: number;
}

export interface TopicCardProps {
  topic: Topic;
  onClick?: () => void;
  materials?: LearningMaterial[];
  showProgress?: boolean;
  progress?: number;
}

export interface MaterialCardProps {
  material: LearningMaterialWithProgress;
  onClick?: () => void;
  onBookmark?: () => void;
  variant?: 'default' | 'compact' | 'list';
}

export interface VideoPlayerProps {
  material: LearningMaterial;
  onProgressUpdate?: (position: number, completed: boolean) => void;
  onNext?: () => void;
  onPrev?: () => void;
  autoPlay?: boolean;
  startPosition?: number;
}

export interface PdfViewerProps {
  material: LearningMaterial;
  onProgressUpdate?: (page: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  startPage?: number;
}