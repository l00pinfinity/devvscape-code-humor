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
  id: string;
  postedBy: string;
  text: string;
  stars: number;
  likedBy: string[];
  createdAt: Date;
}

export interface ImageDetails {
  id: string;
  comments: any[];
  updatedAt: {
    seconds: number;
    nanoseconds: number;
  };
  tags: string[];
  displayName: string;
  downloadedBy: any[];
  hashtags: any[];
  likedBy: any[];
  postedBy: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  postText: string;
  downloads: number;
  stars: number;
  imageUrl: string;
}

