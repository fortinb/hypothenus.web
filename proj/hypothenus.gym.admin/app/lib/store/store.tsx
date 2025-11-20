import { configureStore } from "@reduxjs/toolkit";
import gymsStatePagingReducer from "./slices/gyms-state-paging-slice";
import gymStateReducer from "./slices/gym-state-slice";
import brandsStatePagingReducer from "./slices/brands-state-paging-slice";
import brandStateReducer from "./slices/brand-state-slice";
import coachsStatePagingReducer from "./slices/coachs-state-paging-slice";
import coachStateReducer from "./slices/coach-state-slice";
import coursesStatePagingReducer from "./slices/courses-state-paging-slice";
import courseStateReducer from "./slices/course-state-slice";
import breadcrumbStateReducer from "./slices/breadcrumb-state-slice";

export const store = configureStore({
  reducer: {
    gymsStatePaging: gymsStatePagingReducer,
    gymState: gymStateReducer,
    brandsStatePaging: brandsStatePagingReducer,
    brandState: brandStateReducer,
    coachsStatePaging: coachsStatePagingReducer,
    coachState: coachStateReducer,
    coursesStatePaging: coursesStatePagingReducer,
    courseState: courseStateReducer,
    breadcrumbState: breadcrumbStateReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
// Get the type of our store variable
export type AppStore = typeof store