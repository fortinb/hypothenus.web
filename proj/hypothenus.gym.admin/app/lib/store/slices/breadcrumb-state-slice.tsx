"use client"

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { saveBreadcrumbState } from "../store-persistence";

export interface Crumb {
  reset: boolean,
  locale: string,
  href: string,
  id: string,
  key: string,
  value?: string,
  namespace: string
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
        
        state.breadcrumbs[crumbIndex].key = action.payload.key;
        state.breadcrumbs.splice(crumbIndex+1);
      }
      saveBreadcrumbState(state);
    },
    updateBreadcrumbsLocale: (state, action: PayloadAction<string>) => {
      state.breadcrumbs.forEach((crumb) => crumb.locale = action.payload);
      saveBreadcrumbState(state);
    },
    resetBreadcrumbs: (state, action: PayloadAction<Crumb>) => {
      state.breadcrumbs = [];
      state.breadcrumbs.push(action.payload);
      saveBreadcrumbState(state);
    }
  }
});

// Action creators are generated for each case reducer function
export const { pushBreadcrumb, resetBreadcrumbs, updateBreadcrumbsLocale } = breadcrumbStateSlice.actions

export default breadcrumbStateSlice.reducer