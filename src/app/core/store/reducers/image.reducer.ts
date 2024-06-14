import { createReducer, on } from '@ngrx/store';
import * as ImageActions from '../actions/image.actions';
import { Image } from '../../models/data/image.interface';
import { Comment } from '../../models/data/comment.interface.ts';

export interface ImageState {
  images: Image[];
  userPosts: Image[];
  loaded: boolean;
  lastUpdated: number | null;
  userPostsComments: Comment[];
  starredImages: Image[];
  selectedImage: Image | null;
  comments: Comment[];
  error: string | null;
}

export const initialState: ImageState = {
  images: [],
  loaded: false,
  lastUpdated: null,
  userPosts: [],
  userPostsComments: [],
  starredImages: [],
  selectedImage: null,
  comments: [],
  error: null,
};

export const imageReducer = createReducer(
  initialState,
  
  on(ImageActions.loadImagesSuccess, (state, { images }) => ({
    ...state,
    images,
    loaded: true,
    lastUpdated: Date.now(),
    error: null,
  })),
  on(ImageActions.loadImagesFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Load Image By Id
  on(ImageActions.loadImageByIdSuccess, (state, { image }) => ({
    ...state,
    selectedImage: image,
    error: null,
  })),
  on(ImageActions.loadImageByIdFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Report Image
  on(ImageActions.reportImageSuccess, (state) => ({
    ...state,
    error: null,
  })),
  on(ImageActions.reportImageFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Load User Posts
  on(ImageActions.loadUserPostsSuccess, (state, { images }) => ({
    ...state,
    userPosts: images,
    error: null,
  })),
  on(ImageActions.loadUserPostsFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Load User Posts Comments
  on(ImageActions.loadUserPostsCommentsSuccess, (state, { comments }) => ({
    ...state,
    userPostsComments: comments,
    error: null,
  })),
  on(ImageActions.loadUserPostsCommentsFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Delete User Posts
  on(ImageActions.deleteUserPostsSuccess, (state) => ({
    ...state,
    userPosts: [],
    error: null,
  })),
  on(ImageActions.deleteUserPostsFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Load Starred Images
  on(ImageActions.loadStarredImagesSuccess, (state, { images }) => ({
    ...state,
    starredImages: images,
    error: null,
  })),
  on(ImageActions.loadStarredImagesFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Add Comment
  on(ImageActions.addCommentSuccess, (state) => ({
    ...state,
    error: null,
  })),
  on(ImageActions.addCommentFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Delete Comment
  on(ImageActions.deleteCommentSuccess, (state) => ({
    ...state,
    error: null,
  })),
  on(ImageActions.deleteCommentFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Upload Image and Post Text
  on(ImageActions.uploadImageAndPostTextSuccess, (state) => ({
    ...state,
    error: null,
  })),
  on(ImageActions.uploadImageAndPostTextFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Load Image Comments
  on(ImageActions.loadImageCommentsSuccess, (state, { comments }) => ({
    ...state,
    comments,
    error: null,
  })),
  on(ImageActions.loadImageCommentsFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Download Image
  on(ImageActions.downloadImageSuccess, (state) => ({
    ...state,
    error: null,
  })),
  on(ImageActions.downloadImageFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Like Image
  on(ImageActions.likeImageSuccess, (state) => ({
    ...state,
    error: null,
  })),
  on(ImageActions.likeImageFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
