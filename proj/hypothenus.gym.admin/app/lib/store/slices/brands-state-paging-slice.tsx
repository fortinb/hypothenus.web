import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const DEFAULT_PAGING_SIZE: number = 6;

export interface BrandsStatePaging {
  page: number;
  pageSize: number;
  includeInactive: boolean;
  searchActive: boolean;
  searchCriteria: String
}

export const initialState: BrandsStatePaging = {
  page: 0,
  pageSize: DEFAULT_PAGING_SIZE,
  includeInactive: false,
  searchActive: false,
  searchCriteria: ""
}

export const brandsStatePagingSlice = createSlice({
  name: 'brandsStatePaging',
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
export const { nextPage, previousPage, firstPage, setSearchCriteria, resetSearchCriteria, includeInactive } = brandsStatePagingSlice.actions

export default brandsStatePagingSlice.reducer