import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HackerNewsState } from '../reducers/hacker-news.reducer';

export const selectHackerNewsState = createFeatureSelector<HackerNewsState>('hackerNews');

export const selectTopStories = createSelector(
  selectHackerNewsState,
  (state: HackerNewsState) => state.topStories
);

export const selectBestStories = createSelector(
  selectHackerNewsState,
  (state: HackerNewsState) => state.bestStories
);

export const selectNewStories = createSelector(
  selectHackerNewsState,
  (state: HackerNewsState) => state.newStories
);

export const selectHackerNewsError = createSelector(
  selectHackerNewsState,
  (state: HackerNewsState) => state.error
);
