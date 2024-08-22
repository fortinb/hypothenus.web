import { Course, newCourse } from "@/src/lib/entities/course";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface CourseState {
  course: Course;
}

export const initialState: CourseState = {
  course: newCourse()
}

export const courseStateSlice = createSlice({
  name: 'courseState',
  initialState: initialState,
  reducers: {
    updateCourseState: (state, action: PayloadAction<Course>) => {
      return {
        ...state,
        course: action.payload
      }
    },
    clearCourseState: (state) => {
      return {
        ...state,
        course: newCourse()
      }
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateCourseState, clearCourseState } = courseStateSlice.actions

export default courseStateSlice.reducer