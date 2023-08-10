export interface Image {
  docId: any;
  imageUrl: string;
  postText: string;
  postedBy: string;
  stars: number;
  createdAt: string;
  updatedAt: string;
  displayName: string;
  comments: Comment[];
  tags: string[];
  hashtags: string[];
  isStarred: any;
}
