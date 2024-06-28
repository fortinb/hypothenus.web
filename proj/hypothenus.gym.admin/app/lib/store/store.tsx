import { configureStore } from "@reduxjs/toolkit"
import gymsPagingReducer from "./slices/gymsPagingSlice" 

export const store = configureStore({
  reducer: {
    gymsPaging: gymsPagingReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
// Get the type of our store variable
export type AppStore = typeof store