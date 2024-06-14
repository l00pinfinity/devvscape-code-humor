export interface Notification {
    id?: string;
    title: string;
    body: string;
    isRead: boolean;
    type: 'like' | 'comment' | 'login' | 'promotional' | 'newUser';
    imageId?: string; 
    userId?: string;
    createdAt: Date;
}
