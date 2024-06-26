import { configureStore } from "@reduxjs/toolkit"
import gymReducer from "./slices/gymSlice" 

export const store = configureStore({
  reducer: {
    gym: gymReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
// Get the type of our store variable
export type AppStore = typeof store