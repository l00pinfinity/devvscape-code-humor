import { AuthState } from "./reducers/auth.reducer";
import { HackerNewsState } from "./reducers/hacker-news.reducer";
import { ImageState } from "./reducers/image.reducer";

export interface AppState {
    auth: AuthState,
    image: ImageState,
    hackerNews: HackerNewsState
}