import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as HackerNewsActions from '../actions/hacker-news.actions';
import { HackerNewsService } from '../../services/hackers-news.service';

@Injectable()
export class HackerNewsEffects {

    constructor(private actions$: Actions, private hackerNewsService: HackerNewsService) {}

  loadTopStories$ = createEffect(() => this.actions$.pipe(
    ofType(HackerNewsActions.loadTopStories),
    mergeMap(() => this.hackerNewsService.getTopStories().pipe(
      map(stories => HackerNewsActions.loadTopStoriesSuccess({ stories })),
      catchError(error => of(HackerNewsActions.loadTopStoriesFailure({ error })))
    ))
  ));

  loadBestStories$ = createEffect(() => this.actions$.pipe(
    ofType(HackerNewsActions.loadBestStories),
    mergeMap(() => this.hackerNewsService.getBestStories().pipe(
      map(stories => HackerNewsActions.loadBestStoriesSuccess({ stories })),
      catchError(error => of(HackerNewsActions.loadBestStoriesFailure({ error })))
    ))
  ));

  loadNewStories$ = createEffect(() => this.actions$.pipe(
    ofType(HackerNewsActions.loadNewStories),
    mergeMap(() => this.hackerNewsService.getNewStories().pipe(
      map(stories => HackerNewsActions.loadNewStoriesSuccess({ stories })),
      catchError(error => of(HackerNewsActions.loadNewStoriesFailure({ error })))
    ))
  ));
}
