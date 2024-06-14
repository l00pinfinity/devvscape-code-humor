import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ImageState } from '../reducers/image.reducer';

export const selectImageState = createFeatureSelector<ImageState>('image');

export const selectAllImages = createSelector(
  selectImageState,
  (state: ImageState) => state.images
);

export const selectImagesLoaded = createSelector(
  selectImageState,
  (state: ImageState) => state.loaded
);

export const selectUserPosts = createSelector(
  selectImageState,
  (state: ImageState) => state.userPosts
);

export const selectUserPostsComments = createSelector(
  selectImageState,
  (state: ImageState) => state.userPostsComments
);

export const selectStarredImages = createSelector(
  selectImageState,
  (state: ImageState) => state.starredImages
);

export const selectSelectedImage = createSelector(
  selectImageState,
  (state: ImageState) => state.selectedImage
);

export const selectComments = createSelector(
  selectImageState,
  (state: ImageState) => state.comments
);

export const selectError = createSelector(
  selectImageState,
  (state: ImageState) => state.error
);
