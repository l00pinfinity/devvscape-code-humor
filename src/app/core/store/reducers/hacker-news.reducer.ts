import { createReducer, on } from '@ngrx/store';
import * as HackerNewsActions from '../actions/hacker-news.actions';

export interface HackerNewsState {
  topStories: any[];
  bestStories: any[];
  newStories: any[];
  error: any;
}

export const initialState: HackerNewsState = {
  topStories: [],
  bestStories: [],
  newStories: [],
  error: null
};

export const hackerNewsReducer = createReducer(
  initialState,
  on(HackerNewsActions.loadTopStoriesSuccess, (state, { stories }) => ({
    ...state,
    topStories: stories,
    error: null
  })),
  on(HackerNewsActions.loadBestStoriesSuccess, (state, { stories }) => ({
    ...state,
    bestStories: stories,
    error: null
  })),
  on(HackerNewsActions.loadNewStoriesSuccess, (state, { stories }) => ({
    ...state,
    newStories: stories,
    error: null
  })),
  on(HackerNewsActions.loadTopStoriesFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(HackerNewsActions.loadBestStoriesFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(HackerNewsActions.loadNewStoriesFailure, (state, { error }) => ({
    ...state,
    error
  }))
);
