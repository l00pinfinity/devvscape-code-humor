export interface Comment {
    id?: string;
    postedBy: string;
    postId?: string;
    displayName: string;
    text: string;
    stars: number;
    likedBy: string[];
    createdAt: Date;
}
