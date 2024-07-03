import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export  const DEFAULT_PAGING_SIZE : number = 8;

export interface GymsPagingState {
  pageNumber: number;
  pageSize: number;
}

export const gymsPagingSlice = createSlice({
  name: 'gymsPaging',
  initialState: {
      pageNumber: 0,
      pageSize: DEFAULT_PAGING_SIZE
   },
  reducers: {
    nextPage: (state) => {
      console.log ("reducer nextPage");
      return {
        ...state,
        pageNumber: state.pageNumber + 1
      }
    },
    previousPage: (state) => {
      console.log ("reducer previousPage");
      return {
        ...state,
        pageNumber: state.pageNumber - 1
      }
    },
    firstPage: (state) => {
      console.log ("reducer firstPage");
      return {
        ...state,
        pageNumber: 0,
        pageSize: DEFAULT_PAGING_SIZE
       
      }
    },
  }
});

// Action creators are generated for each case reducer function
export const { nextPage, previousPage, firstPage } = gymsPagingSlice.actions

export default gymsPagingSlice.reducer