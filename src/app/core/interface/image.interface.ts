export interface Image {
  likedBy: any[];
  downloadedBy: any[];
  id: string;
  imageUrl: string;
  postText: string;
  postedBy: string;
  stars: number;
  downloads: number;
  createdAt: string;
  updatedAt: string;
  displayName: string;
  comments: Comment[];
  tags: string[];
  hashtags: string[];
  isStarred: any;
}

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
