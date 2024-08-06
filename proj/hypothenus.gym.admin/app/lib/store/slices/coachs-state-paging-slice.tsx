import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const DEFAULT_PAGING_SIZE: number = 10;

export interface CoachsStatePaging {
  page: number;
  pageSize: number;
  includeInactive: boolean;
  searchActive: boolean;
  searchCriteria: String
}

export const initialState: CoachsStatePaging = {
  page: 0,
  pageSize: DEFAULT_PAGING_SIZE,
  includeInactive: false,
  searchActive: false,
  searchCriteria: ""
}

export const coachsStatePagingSlice = createSlice({
  name: 'coachsStatePaging',
  initialState: initialState,
  reducers: {
    includeInactive: (state, action: PayloadAction<boolean>) => {
      //  console.log ("reducer nextPage");
      return {
        ...state,
        includeInactive: action.payload
      }
    },
    nextPage: (state) => {
      //  console.log ("reducer nextPage");
      return {
        ...state,
        page: state.page + 1
      }
    },
    previousPage: (state) => {
      //  console.log ("reducer previousPage");
      return {
        ...state,
        page: state.page - 1
      }
    },
    firstPage: (state) => {
      //  console.log ("reducer firstPage");
      return {
        ...state,
        page: 0,
        pageSize: DEFAULT_PAGING_SIZE

      }
    },
    setSearchCriteria: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        page: 0,
        pageSize: DEFAULT_PAGING_SIZE,
        searchActive: true,
        searchCriteria: action.payload
      }
    },
    resetSearchCriteria: (state) => {
      return {
        ...state,
        page: 0,
        pageSize: DEFAULT_PAGING_SIZE,
        searchActive: false,
        searchCriteria: ""
      }
    },
  }
});

// Action creators are generated for each case reducer function
export const { nextPage, previousPage, firstPage, setSearchCriteria, resetSearchCriteria, includeInactive } = coachsStatePagingSlice.actions

export default coachsStatePagingSlice.reducer