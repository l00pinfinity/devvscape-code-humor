import { createAction, props } from '@ngrx/store';

export const loadTopStories = createAction('[Hacker News] Load Top Stories');
export const loadTopStoriesSuccess = createAction('[Hacker News] Load Top Stories Success',props<{ stories: any[] }>());
export const loadTopStoriesFailure = createAction('[Hacker News] Load Top Stories Failure',props<{ error: any }>());

export const loadBestStories = createAction('[Hacker News] Load Best Stories');
export const loadBestStoriesSuccess = createAction('[Hacker News] Load Best Stories Success',props<{ stories: any[] }>());
export const loadBestStoriesFailure = createAction('[Hacker News] Load Best Stories Failure',props<{ error: any }>());

export const loadNewStories = createAction('[Hacker News] Load New Stories');
export const loadNewStoriesSuccess = createAction('[Hacker News] Load New Stories Success',props<{ stories: any[] }>());
export const loadNewStoriesFailure = createAction('[Hacker News] Load New Stories Failure',props<{ error: any }>());
