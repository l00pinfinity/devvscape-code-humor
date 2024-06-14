import { AuthState } from "./reducers/auth.reducer";
import { ImageState } from "./reducers/image.reducer";

export interface AppState {
    auth: AuthState,
    image:ImageState
}