import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ImageActions from '../actions/image.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { defer, from, of } from 'rxjs';
import { ImageService } from '../../services/image.service';

@Injectable()
export class ImageEffects {
  constructor(
    private actions$: Actions,
    private imageService: ImageService
  ) {}

  loadImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.loadImages),
      mergeMap(() =>
        this.imageService.getImagePosts().pipe(
          map((images) => ImageActions.loadImagesSuccess({ images })),
          catchError((error) => of(ImageActions.loadImagesFailure({ error })))
        )
      )
    )
  );

  loadImageById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.loadImageById),
      mergeMap((action) =>
        this.imageService.getImagePostById(action.id).pipe(
          map((image) => ImageActions.loadImageByIdSuccess({ image })),
          catchError((error) => of(ImageActions.loadImageByIdFailure({ error })))
        )
      )
    )
  );

  reportImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.reportImage),
      mergeMap((action) =>
        defer(() => this.imageService.reportImage(action.imageId, action.userId, action.reason)).pipe(
          map(() => ImageActions.reportImageSuccess()),
          catchError((error) => of(ImageActions.reportImageFailure({ error })))
        )
      )
    )
  );

  loadUserPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.loadUserPosts),
      mergeMap(() =>
        from(this.imageService.getUserPosts()).pipe(
          switchMap((observable) => observable),
          map((images) => ImageActions.loadUserPostsSuccess({ images })),
          catchError((error) => of(ImageActions.loadUserPostsFailure({ error })))
        )
      )
    )
  );

  loadUserPostsComments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.loadUserPostsComments),
      mergeMap((action) =>
        this.imageService.getUserPostsComments(action.userId).pipe(
          map((comments) => ImageActions.loadUserPostsCommentsSuccess({ comments })),
          catchError((error) => of(ImageActions.loadUserPostsCommentsFailure({ error })))
        )
      )
    )
  );

  deleteUserPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.deleteUserPosts),
      mergeMap((action) =>
        defer(() => this.imageService.deleteUserPosts(action.userUid)).pipe(
          map(() => ImageActions.deleteUserPostsSuccess()),
          catchError((error) => of(ImageActions.deleteUserPostsFailure({ error })))
        )
      )
    )
  );

  loadStarredImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.loadStarredImages),
      mergeMap((action) =>
        this.imageService.getStarredImages(action.userId).pipe(
          map((images) => ImageActions.loadStarredImagesSuccess({ images })),
          catchError((error) => of(ImageActions.loadStarredImagesFailure({ error })))
        )
      )
    )
  );

  addComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.addComment),
      mergeMap((action) =>
        defer(() => this.imageService.addComment(action.postId, action.userId, action.displayName, action.commentText)).pipe(
          map(() => ImageActions.addCommentSuccess()),
          catchError((error) => of(ImageActions.addCommentFailure({ error })))
        )
      )
    )
  );

  deleteComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.deleteComment),
      mergeMap((action) =>
        defer(() => this.imageService.deleteComment(action.imageId, action.commentId)).pipe(
          map(() => ImageActions.deleteCommentSuccess()),
          catchError((error) => of(ImageActions.deleteCommentFailure({ error })))
        )
      )
    )
  );

  uploadImageAndPostText$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.uploadImageAndPostText),
      mergeMap((action) =>
        defer(() => this.imageService.uploadImageAndPostText(action.imageFile, action.postText, action.userId, action.displayName)).pipe(
          map(() => ImageActions.uploadImageAndPostTextSuccess()),
          catchError((error) => of(ImageActions.uploadImageAndPostTextFailure({ error })))
        )
      )
    )
  );

  loadImageComments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.loadImageComments),
      mergeMap((action) =>
        defer(() => this.imageService.getImageComments(action.imageId)).pipe(
          map((comments) => ImageActions.loadImageCommentsSuccess({ comments })),
          catchError((error) => of(ImageActions.loadImageCommentsFailure({ error })))
        )
      )
    )
  );

  downloadImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.downloadImage),
      mergeMap((action) =>
        defer(() => this.imageService.downloads(action.imageId, action.userId)).pipe(
          map(() => ImageActions.downloadImageSuccess()),
          catchError((error) => of(ImageActions.downloadImageFailure({ error })))
        )
      )
    )
  );

  likeImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.likeImage),
      mergeMap((action) =>
        defer(() => this.imageService.likeImage(action.postId, action.userId)).pipe(
          map(() => ImageActions.likeImageSuccess()),
          catchError((error) => of(ImageActions.likeImageFailure({ error })))
        )
      )
    )
  );
}