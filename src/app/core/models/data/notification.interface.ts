export interface Notification {
  id?: string;
  title: string;
  body: string;
  isRead: boolean;
  type: 'like' | 'comment' | 'reply' | 'login' | 'promotional' | 'newUser' | 'security';
  imageId?: string;
  userId?: string;
  createdAt: Date;
}
