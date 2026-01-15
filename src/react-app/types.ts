export interface MediaItem {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  type: 'video' | 'still';
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface AboutContent {
  content: string;
  updatedAt: string;
}
