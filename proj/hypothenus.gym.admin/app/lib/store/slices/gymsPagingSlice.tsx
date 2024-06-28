import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface GymsPagingState {
  pageNumber: number;
  pageSize: number;
}

export const initialState: GymsPagingState = {
  pageNumber: 0,
  pageSize: 10
 };


export const gymsPagingSlice = createSlice({
  name: 'gymsPaging',
  initialState: {
    value: initialState
  },
  reducers: {
    nextPage: (state) => {
      return {
        ...state,
        pageNumber: state.value.pageNumber + 1
      }
    },
    previousPage: (state) => {
      return {
        ...state,
        pageNumber: state.value.pageNumber - 1
      }
    },
    specificPage: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        pageNumber: action.payload
      }
    },
  }
});

// Action creators are generated for each case reducer function
export const { nextPage, previousPage, specificPage } = gymsPagingSlice.actions

export default gymsPagingSlice.reducer