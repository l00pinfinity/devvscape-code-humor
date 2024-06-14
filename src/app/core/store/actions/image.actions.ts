import { createAction, props } from '@ngrx/store';
import { Image } from '../../models/data/image.interface';
import { Comment } from '../../models/data/comment.interface.ts';

export const loadImages = createAction('[Image] Load Images');
export const loadImagesSuccess = createAction('[Image] Load Images Success',props<{ images: Image[] }>());
export const loadImagesFailure = createAction('[Image] Load Images Failure',props<{ error: any }>());

export const loadImageById = createAction('[Image] Load Image By Id',props<{ id: string }>());
export const loadImageByIdSuccess = createAction('[Image] Load Image By Id Success',props<{ image: Image | null }>());
export const loadImageByIdFailure = createAction('[Image] Load Image By Id Failure',props<{ error: any }>());

export const reportImage = createAction('[Image] Report Image',props<{ imageId: string, userId: string, reason: string }>());
export const reportImageSuccess = createAction('[Image] Report Image Success');
export const reportImageFailure = createAction('[Image] Report Image Failure',props<{ error: any }>());

export const loadUserPosts = createAction('[Image] Load User Posts');
export const loadUserPostsSuccess = createAction('[Image] Load User Posts Success',props<{ images: Image[] }>());
export const loadUserPostsFailure = createAction('[Image] Load User Posts Failure',props<{ error: any }>());

export const loadUserPostsComments = createAction('[Image] Load User Posts Comments',props<{ userId: string }>());
export const loadUserPostsCommentsSuccess = createAction('[Image] Load User Posts Comments Success',props<{ comments: Comment[] }>());
export const loadUserPostsCommentsFailure = createAction('[Image] Load User Posts Comments Failure',props<{ error: any }>());

export const deleteUserPosts = createAction('[Image] Delete User Posts',props<{ userUid: string }>());
export const deleteUserPostsSuccess = createAction('[Image] Delete User Posts Success');
export const deleteUserPostsFailure = createAction('[Image] Delete User Posts Failure',props<{ error: any }>());

export const loadStarredImages = createAction('[Image] Load Starred Images',props<{ userId: string }>());
export const loadStarredImagesSuccess = createAction('[Image] Load Starred Images Success',props<{ images: Image[] }>());
export const loadStarredImagesFailure = createAction('[Image] Load Starred Images Failure',props<{ error: any }>());

export const addComment = createAction('[Image] Add Comment',props<{ postId: string, userId: string, displayName: string, commentText: string }>());
export const addCommentSuccess = createAction('[Image] Add Comment Success');
export const addCommentFailure = createAction('[Image] Add Comment Failure',props<{ error: any }>());

export const deleteComment = createAction('[Image] Delete Comment',props<{ imageId: string, commentId: string }>());
export const deleteCommentSuccess = createAction('[Image] Delete Comment Success');
export const deleteCommentFailure = createAction('[Image] Delete Comment Failure',props<{ error: any }>());

export const uploadImageAndPostText = createAction('[Image] Upload Image And Post Text',props<{ imageFile: File, postText: string, userId: string, displayName: string }>());
export const uploadImageAndPostTextSuccess = createAction('[Image] Upload Image And Post Text Success');
export const uploadImageAndPostTextFailure = createAction('[Image] Upload Image And Post Text Failure',props<{ error: any }>());

export const loadImageComments = createAction('[Image] Load Image Comments',props<{ imageId: string }>());
export const loadImageCommentsSuccess = createAction('[Image] Load Image Comments Success',props<{ comments: Comment[] }>());
export const loadImageCommentsFailure = createAction('[Image] Load Image Comments Failure',props<{ error: any }>());

export const downloadImage = createAction('[Image] Download Image',props<{ imageId: string, userId: string }>());
export const downloadImageSuccess = createAction('[Image] Download Image Success');
export const downloadImageFailure = createAction('[Image] Download Image Failure',props<{ error: any }>());

export const likeImage = createAction('[Image] Like Image',props<{ postId: string, userId: string }>());
export const likeImageSuccess = createAction('[Image] Like Image Success');
export const likeImageFailure = createAction('[Image] Like Image Failure',props<{ error: any }>());
