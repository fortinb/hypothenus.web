import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const DEFAULT_PAGING_SIZE: number = 6;

export interface MembersStatePaging {
  page: number;
  pageSize: number;
  includeInactive: boolean;
  searchActive: boolean;
  searchCriteria: String
}

export const initialState: MembersStatePaging = {
  page: 0,
  pageSize: DEFAULT_PAGING_SIZE,
  includeInactive: false,
  searchActive: false,
  searchCriteria: ""
}

export const membersStatePagingSlice = createSlice({
  name: 'membersStatePaging',
  initialState: initialState,
  reducers: {
    includeInactive: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        includeInactive: action.payload
      }
    },
    nextPage: (state) => {
      return {
        ...state,
        page: state.page + 1
      }
    },
    previousPage: (state) => {
      return {
        ...state,
        page: state.page - 1
      }
    },
    firstPage: (state) => {
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
export const { nextPage, previousPage, firstPage, setSearchCriteria, resetSearchCriteria, includeInactive } = membersStatePagingSlice.actions

export default membersStatePagingSlice.reducer