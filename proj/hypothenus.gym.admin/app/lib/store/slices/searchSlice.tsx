import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface SearchState {
  active: boolean;
  searchCriteria: String
}

export const initialState: SearchState = {
  active: false,
  searchCriteria: ""
 };


export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    value: initialState
  },
  reducers: {
    activateSearch: (state) => {
      state.value.active = true;
      state.value.searchCriteria = "";
    },
    deactivateSearch: (state) => {
      state.value.active = false;
      state.value.searchCriteria = "";
    },
    setSearchCriteria: (state, action: PayloadAction<string>) => {
      state.value.searchCriteria = action.payload;
    },
    resetSearchCriteria: (state) => {
      state.value.searchCriteria = "";
    },
  }
});

// Action creators are generated for each case reducer function
export const { activateSearch, deactivateSearch, setSearchCriteria, resetSearchCriteria } = searchSlice.actions

export default searchSlice.reducer