import { Gym } from "@/src/lib/entities/gym";
import { Page } from "@/src/lib/entities/page";
import { createSlice } from "@reduxjs/toolkit"

export interface gymState {
  pageofGym: Page<Gym>;
}

const initialState: gymState = {
  pageofGym: {
    content: [],
    pageable: {
      pageNumber: 0,
      pageSize:0
    },
    sort: null,
    total: 0
  } 
}

export const gymSlice = createSlice({
  name: 'gyms',
  initialState: {
    value: initialState
  },
  reducers: {
    getNewPage: (state) => { 
    },
  }
});

// Action creators are generated for each case reducer function
export const { getNewPage } = gymSlice.actions

export default gymSlice.reducer