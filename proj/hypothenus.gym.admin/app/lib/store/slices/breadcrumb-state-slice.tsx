"use client"

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Crumb {
  href: string,
  id: string,
  crumb: string,
}

export interface BreadcrumbState {
  breadcrumbs: Crumb[]
}

export const initialState: BreadcrumbState = {
  breadcrumbs:  []
}

export const breadcrumbStateSlice = createSlice({
  name: 'breadcrumbState',
  initialState: initialState,
  reducers: {
    pushBreadcrumb: (state, action: PayloadAction<Crumb>) => {

      const crumbIndex = state.breadcrumbs.findIndex(c => c.id == action.payload.id);
      if (crumbIndex === -1) {
        state.breadcrumbs.push(action.payload);
      } else {
        if (crumbIndex === state.breadcrumbs.length) {
          return;
        }
  
        state.breadcrumbs.splice(crumbIndex+1);
      }

      sessionStorage.setItem("breadcrumbs", JSON.stringify(state.breadcrumbs));
    },
    initBreadcrumbs: (state) => {
      try {
        state.breadcrumbs = JSON.parse(sessionStorage.getItem("breadcrumbs") ?? "[]");
      } catch (e) {
        state.breadcrumbs = [];
      }     
    },
    resetBreadcrumbs: (state, action: PayloadAction<Crumb>) => {
      state.breadcrumbs = [];
      state.breadcrumbs.push(action.payload);
      sessionStorage.setItem("breadcrumbs", JSON.stringify(state.breadcrumbs));
    }
  }
});

// Action creators are generated for each case reducer function
export const { pushBreadcrumb, initBreadcrumbs, resetBreadcrumbs } = breadcrumbStateSlice.actions

export default breadcrumbStateSlice.reducer